using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Helpers;
using backend.Models;
using backend.Services.Interfaces;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VnpayController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly IOrderService _orderService;
    private readonly AppDbContext _context;
    private readonly ILogger<VnpayController> _logger;

    public VnpayController(IConfiguration config, IOrderService orderService,
        AppDbContext context, ILogger<VnpayController> logger)
    {
        _config = config;
        _orderService = orderService;
        _context = context;
        _logger = logger;
    }

    private int? CurrentUserId
    {
        get
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return claim != null ? int.Parse(claim) : null;
        }
    }

    [Authorize]
    [HttpPost("create-payment")]
    public async Task<IActionResult> CreatePayment([FromBody] OrderCreateDto orderDto)
    {
        var userId = CurrentUserId;
        if (userId == null) return Unauthorized();

        var order = await _orderService.CreateOrderAsync(userId.Value, orderDto);
        if (order == null) return BadRequest(new { message = "Giỏ hàng trống hoặc không hợp lệ." });

        var now = DateTime.Now;
        var amount = (long)(order.TotalAmount * 100);
        var ipAddr = VnpayHelper.GetClientIp(HttpContext);

        // Strictly follow VNPay v2.1.0 parameter spec — no extra fields
        var vnp = new VnpayHelper();
        vnp.AddRequestData("vnp_Version",    _config["Vnpay:Version"]!);
        vnp.AddRequestData("vnp_Command",    _config["Vnpay:Command"]!);
        vnp.AddRequestData("vnp_TmnCode",    _config["Vnpay:TmnCode"]!);
        vnp.AddRequestData("vnp_Amount",     amount.ToString());
        vnp.AddRequestData("vnp_CreateDate", now.ToString("yyyyMMddHHmmss"));
        vnp.AddRequestData("vnp_CurrCode",   _config["Vnpay:CurrCode"]!);
        vnp.AddRequestData("vnp_IpAddr",     ipAddr);
        vnp.AddRequestData("vnp_Locale",     _config["Vnpay:Locale"]!);
        // OrderInfo: ASCII only, no special chars (VNPay limitation)
        vnp.AddRequestData("vnp_OrderInfo",  $"Thanh toan don hang {order.Id}");
        vnp.AddRequestData("vnp_OrderType",  "other");
        vnp.AddRequestData("vnp_ReturnUrl",  _config["Vnpay:ReturnUrl"]!);
        vnp.AddRequestData("vnp_TxnRef",     order.Id.ToString());

        var paymentUrl = vnp.CreatePaymentUrl(
            _config["Vnpay:BaseUrl"]!,
            _config["Vnpay:HashSecret"]!
        );

        _logger.LogInformation("VNPay URL for order {OrderId}: {Url}", order.Id, paymentUrl);

        return Ok(new { paymentUrl, orderId = order.Id });
    }

    [HttpGet("return")]
    public async Task<IActionResult> PaymentReturn()
    {
        var frontendUrl = "http://localhost:4200";

        var isValid = VnpayHelper.ValidateSignature(Request.Query, _config["Vnpay:HashSecret"]!);
        var responseCode = Request.Query["vnp_ResponseCode"].ToString();
        var txnRef = Request.Query["vnp_TxnRef"].ToString();

        _logger.LogInformation("VNPay return — valid:{Valid} code:{Code} txn:{Txn}",
            isValid, responseCode, txnRef);

        if (!isValid)
            return Redirect($"{frontendUrl}/orders?vnp_status=invalid");

        if (!int.TryParse(txnRef, out int orderId))
            return Redirect($"{frontendUrl}/orders?vnp_status=error");

        var order = await _context.Orders.FindAsync(orderId);
        if (order == null)
            return Redirect($"{frontendUrl}/orders?vnp_status=notfound");

        if (responseCode == "00")
        {
            order.Status = "Processing";
            await _context.SaveChangesAsync();
            return Redirect($"{frontendUrl}/orders?vnp_status=success&orderId={orderId}");
        }
        else
        {
            order.Status = "Cancelled";
            await _context.SaveChangesAsync();
            return Redirect($"{frontendUrl}/orders?vnp_status=failed&orderId={orderId}");
        }
    }
}
