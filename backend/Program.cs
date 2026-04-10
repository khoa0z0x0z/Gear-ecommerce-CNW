using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Text;
using backend.Data;
using backend.Services;
using backend.Services.Interfaces;
using backend.Helpers;
using Scalar.AspNetCore;
using FluentValidation;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Register DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "DefaultSecretKey1234567890123456"))
        };
    });

// Register Controllers and Validation
builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Register AutoMapper
builder.Services.AddAutoMapper(typeof(Program).Assembly);

// Register Helpers
builder.Services.AddSingleton<JwtHelper>();

// Register Business Services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();

// Seed Admin User
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (!context.Users.Any(u => u.Email == "admin@gmail.com"))
    {
        var admin = new backend.Models.User
        {
            Email = "admin@gmail.com",
            FullName = "Administrator",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            Role = "Admin",
            IsActive = true
        };
        context.Users.Add(admin);
        context.SaveChanges();
    }

    // Seed Settings
    if (!context.Settings.Any())
    {
        context.Settings.AddRange(new List<backend.Models.Settings>
        {
            new() { Key = "StoreName", Value = "Antigravity Gear", Group = "Store", Description = "Tên hiển thị của cửa hàng" },
            new() { Key = "StoreEmail", Value = "contact@antigravity.vn", Group = "Store", Description = "Email liên hệ chính thức" },
            new() { Key = "StorePhone", Value = "0901234567", Group = "Store", Description = "Số điện thoại hỗ trợ" },
            new() { Key = "StoreAddress", Value = "280 An Dương Vương, P4, Q5, TP.HCM", Group = "Store", Description = "Địa chỉ trụ sở chính" },
            new() { Key = "ShippingFee", Value = "30000", Group = "Shipping", Description = "Phí vận chuyển mặc định (VNĐ)" },
            new() { Key = "FreeShippingThreshold", Value = "2000000", Group = "Shipping", Description = "Ngưỡng đơn hàng được miễn phí ship (VNĐ)" },
            new() { Key = "EnableCOD", Value = "true", Group = "Payment", Description = "Cho phép thanh toán khi nhận hàng" },
            new() { Key = "BankName", Value = "Vietcombank", Group = "Payment", Description = "Tên ngân hàng" },
            new() { Key = "BankAccountName", Value = "NGUYEN VAN A", Group = "Payment", Description = "Tên chủ tài khoản" },
            new() { Key = "BankAccountNumber", Value = "1234567890", Group = "Payment", Description = "Số tài khoản ngân hàng" }
        });
        context.SaveChanges();
    }
}

app.MapControllers();

app.Run();
