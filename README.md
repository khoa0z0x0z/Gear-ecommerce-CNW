# Giới thiệu đồ án Gear-ecommerce- KAT
Dự án xây dựng một hệ thống website thương mại điện tử chuyên bán các thiết bị công nghệ như PC, laptop, linh kiện và gear, đồng thời tích hợp các tính năng AI nhằm nâng cao trải nghiệm người dùng.

## Mục tiêu
* Xây dựng hệ thống bán hàng online đầy đủ chức năng
* Áp dụng AI vào gợi ý sản phẩm, tìm kiếm thông minh
* Tối ưu hiệu năng và bảo mật
* Triển khai theo kiến trúc Web API + Frontend hiện đại

## Công nghệ sử dụng

### Backend
* ASP.NET Web API
* Entity Framework Core
* SQL Server
* JWT Authentication

### Frontend
* Angular
* Bootstrap / TailwindCSS

## Cấu trúc hệ thống
backend/
│
├── Controllers/ # Nhận request từ FE
│ └── ProductsController.cs
│ └── OrdersController.cs
│
├── Models/ # Entity mapping DB
│ └── Product.cs
│ └── Order.cs
│
├── DTOs/ # Data transfer object
│ └── Validators/ # FluentValidation
│   └── ProductValidator.cs
│
├── Services/ # Business logic
│ ├── Interfaces/
│ │ └── IProductService.cs
│ └── ProductService.cs
│
├── Repositories/ # Truy vấn DB
│ ├── Interfaces/
│ │ └── IProductRepository.cs
│ └── ProductRepository.cs
│
├── Data/
│ └── AppDbContext.cs
│
├── Helpers/ # JWT, AutoMapper, Utils
│ └── MappingProfile.cs
│ └── JwtHelper.cs
│
├── appsettings.json
├── Program.cs
frontend/
│
├── src/app/
│
│ ├── shared/ # Component, Pipes, Directives dùng lại
│ │ └── components/
│
│ ├── pages/ # Các trang của ứng dụng
│ │ ├── homepage/
│ │ ├── product-list/
│ │ ├── product-detail/
│ │ ├── cart-page/
│ │ ├── checkout-page/
│ │ ├── login-page/
│ │ ├── register-page/
│ │ ├── contact-page/
│ │ ├── about-page/
│ │ └── not-found/
│
│ ├── services/ # API services
│ │ ├── product.service.ts
│ │ ├── auth.service.ts
│ │ └── order.service.ts
│
│ ├── models/ # Interfaces/Classes
│ │ ├── product.model.ts
│ │ └── order.model.ts
│
│ ├── app.routes.ts
│ ├── app.config.ts
│ └── app.ts
### Các bảng chính trong CSDL

* Users
* Addresses
* Categories
* Products
* ProductImages
* Reviews
* Cart, CartItems
* Wishlist, WishlistItems
* Orders, OrderDetails
* OrderStatusHistory
* Payments
* Contacts
* RefreshTokens
* ProductAttributes
* ProductRecommendations

## Chức năng chính

### Người dùng

* Đăng ký / Đăng nhập
* Xem danh sách sản phẩm
* Tìm kiếm và lọc sản phẩm
* Thêm vào giỏ hàng / wishlist
* Đặt hàng và thanh toán
* Xem lịch sử đơn hàng

### Admin

* Quản lý sản phẩm
* Quản lý đơn hàng
* Quản lý người dùng
* Thống kê doanh thu

### AI (dự kiến)

* Gợi ý sản phẩm (recommendation system)
* Tìm kiếm thông minh
* Chatbot hỗ trợ khách hàng

## Bảo mật

* Xác thực bằng JWT
* Phân quyền (RBAC)
* Chống SQL Injection
* Validate dữ liệu đầu vào

## Cài đặt và chạy dự án

### 1. Clone project

```bash
git clone <repo-url>
cd project-folder
```

### 2. Backend

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

### 3. Frontend

```bash
cd frontend
npm install
ng serve
```

## Kiến trúc hệ thống

* Client (Angular)
* Web API (ASP.NET)
* Database (SQL Server)