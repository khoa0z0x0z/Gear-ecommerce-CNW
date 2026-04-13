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
```
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
```
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

## Hướng dẫn cài đặt và chạy dự án 🚀

### 1. Chuẩn bị (Prerequisites)
*   **Backend**: .NET 8 SDK, SQL Server.
*   **Frontend**: Node.js (v18+), Angular CLI.

### 2. Cấu hình và chạy Backend
1.  **Cấu hình CSDL**: Mở file `backend/appsettings.json` và cập nhật chuỗi kết nối `DefaultConnection` cho phù hợp với SQL Server của bạn.
2.  **Di chuyển vào thư mục backend**:
    ```bash
    cd backend
    ```
3.  **Khởi tạo cơ sở dữ liệu (Migrations)**:
    ```bash
    dotnet ef database update
    ```
4.  **Chạy Seed Data (Dữ liệu mẫu)**:
    *   Mở SQL Server Management Studio (SSMS).
    *   Mở file **`backend/seed_data.sql`**.
    *   Copy toàn bộ nội dung và chạy (Execute) trong database của đồ án để có sẵn sản phẩm và hình ảnh.
5.  **Chạy Server API**:
    ```bash
    dotnet run --launch-profile https
    ```
    *API sẽ chạy tại: `https://localhost:7057`*

### 3. Cấu hình và chạy Frontend
1.  **Di chuyển vào thư mục frontend**:
    ```bash
    cd frontend
    ```
2.  **Cài đặt thư viện**:
    ```bash
    npm install
    ```
3.  **Chạy Web**:
    ```bash
    npm start
    ```
    *Website sẽ chạy tại: `http://localhost:4200`*

---

## Lưu ý quan trọng (Troubleshooting) 🛠
*   **Lỗi Cổng (Port already in use)**: Nếu gặp lỗi cổng 4200 hoặc 7057 bị chiếm dụng, hãy dùng lệnh sau để giải phóng:
    *   `taskkill /F /IM dotnet.exe /T`
    *   `taskkill /F /IM node.exe /T`
*   **Seed Data**: Luôn đảm bảo đã chạy `database update` trước khi chạy file `seed_data.sql`.
*   **CORS**: Đã được cấu hình trong `Program.cs` để cho phép `localhost:4200` truy cập.

---

## Kiến trúc hệ thống
*   **Client**: Angular 17+ (Signal-based)
*   **Web API**: ASP.NET Core 8
*   **Database**: SQL Server (Entity Framework Core)
