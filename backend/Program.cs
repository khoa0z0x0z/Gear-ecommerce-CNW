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
builder.Services.AddScoped<IWishlistService, WishlistService>();
// Audit logging (file-based)
builder.Services.AddSingleton<backend.Services.Interfaces.IAuditService, backend.Services.AuditService>();
// Chatbot AI
builder.Services.AddHttpClient();
builder.Services.AddScoped<IChatbotService, ChatbotService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngular");

// Serve static files (for uploaded images)
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

// Seed Admin User
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    try {
        context.Database.ExecuteSqlRaw(@"
IF OBJECT_ID(N'Coupons', N'U') IS NULL
BEGIN
    CREATE TABLE Coupons (
        Id int NOT NULL IDENTITY,
        Code nvarchar(max) NOT NULL,
        Description nvarchar(max) NULL,
        IsPercentage bit NOT NULL,
        DiscountValue decimal(18,2) NOT NULL,
        MaxDiscount decimal(18,2) NULL,
        StartAt datetime2 NULL,
        ExpiryAt datetime2 NULL,
        IsActive bit NOT NULL DEFAULT CAST(1 AS bit),
        CreatedAt datetime2 NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT PK_Coupons PRIMARY KEY (Id)
    );
END
        ");
        context.Database.ExecuteSqlRaw(@"
IF OBJECT_ID(N'Notifications', N'U') IS NULL
BEGIN
    CREATE TABLE Notifications (
        Id int NOT NULL IDENTITY,
        Title nvarchar(max) NOT NULL,
        Message nvarchar(max) NOT NULL,
        VisibleToRoles nvarchar(max) NULL,
        VisibleToUserIds nvarchar(max) NULL,
        IsActive bit NOT NULL DEFAULT CAST(1 AS bit),
        CreatedAt datetime2 NOT NULL DEFAULT SYSDATETIME(),
        ExpiresAt datetime2 NULL,
        CONSTRAINT PK_Notifications PRIMARY KEY (Id)
    );
END
        ");
        context.Database.ExecuteSqlRaw(@"
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'Phone' AND Object_ID = Object_ID(N'Contacts'))
BEGIN
    ALTER TABLE Contacts ADD Phone nvarchar(50) NULL;
END
        ");
        context.Database.ExecuteSqlRaw(@"
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'AvatarUrl' AND Object_ID = Object_ID(N'Users'))
BEGIN
    ALTER TABLE Users ADD AvatarUrl nvarchar(500) NULL;
END
        ");
    } catch { }

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
