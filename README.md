# Giới thiệu đồ án Gear-ecommerce- KAT
Dự án xây dựng một hệ thống website thương mại điện tử chuyên bán các thiết bị công nghệ như PC, laptop, linh kiện và gear.

## Mục tiêu
* Xây dựng hệ thống bán hàng online đầy đủ chức năng
* Tìm kiếm thông minh
* Tối ưu hiệu năng và bảo mật
* Triển khai theo kiến trúc Web API + Frontend hiện đại

## Công nghệ sử dụng

### Backend
* ASP.NET Web API (.NET 8)
* Entity Framework Core
* SQL Server
* JWT Authentication
* VNPAY Payment Gateway

### Frontend
* Angular 17+
* TailwindCSS / Bootstrap

## Cấu trúc hệ thống
```text
backend/
│
├── Controllers/ # Nhận request từ FE
│ ├── ProductsController.cs
│ ├── OrdersController.cs
│ ├── AuthController.cs
│ ├── CartsController.cs
│ ├── CategoriesController.cs
│ ├── VnpayController.cs
│ ├── ReviewsController.cs
│ ├── CouponsController.cs
│ └── ...
│
├── Models/ # Entity mapping DB
│ ├── Product.cs
│ ├── Order.cs
│ ├── Category.cs
│ ├── User.cs
│ └── ...
│
├── DTOs/ # Data transfer object
│ └── Validators/ # FluentValidation
│
├── Services/ # Business logic
│ ├── Interfaces/
│ └── Implementations...
│
├── Repositories/ # Truy vấn DB (Nếu có)
│ ├── Interfaces/
│ └── Implementations...
│
├── Data/ # DB Context
│ └── AppDbContext.cs
│
├── Helpers/ # JWT, AutoMapper, Utils
│ ├── MappingProfile.cs
│ └── JwtHelper.cs
│
├── Migrations/ # Lịch sử cập nhật database EF Core
│
├── wwwroot/ # Nơi lưu trữ tập tin tĩnh (hình ảnh sản phẩm, avatar)
│ └── uploads/
│
├── appsettings.json
├── Program.cs
└── seed_data.sql # File script mẫu db

frontend/
│
├── src/app/
│
│ ├── shared/ # Component, Pipes, Directives dùng chung
│ │ └── components/ (Header, Footer, ProductCard,...)
│
│ ├── pages/ # Các trang chính của ứng dụng
│ │ ├── Client Pages:
│ │ │ ├── homepage/
│ │ │ ├── product-list/
│ │ │ ├── product-detail/
│ │ │ ├── cart-page/
│ │ │ ├── checkout-page/
│ │ │ ├── login-page/
│ │ │ ├── register-page/
│ │ │ ├── profile-page/
│ │ │ ├── wishlist-page/
│ │ │ ├── order-history-page/
│ │ │ └── ...
│ │ │
│ │ ├── Admin Pages:
│ │ │ ├── admin-dashboard/
│ │ │ ├── admin-add-product/
│ │ │ ├── admin-categories/
│ │ │ ├── admin-orders/
│ │ │ ├── admin-customers/
│ │ │ ├── admin-coupons/
│ │ │ ├── admin-stats/
│ │ │ └── ...
│
│ ├── services/ # API services giao tiếp với Backend
│ │ ├── product.service.ts
│ │ ├── auth.service.ts
│ │ ├── order.service.ts
│ │ └── ...
│
│ ├── models/ # Interfaces/Classes
│ │ ├── product.model.ts
│ │ └── order.model.ts
│
│ ├── app.routes.ts # Định tuyến
│ ├── app.config.ts # Cấu hình Angular 17+
│ └── app.component.ts # Root Component
```
## Chức năng chính

### Người dùng (Client)

* Đăng nhập / Đăng ký / Quản lý trang cá nhân (Profile, Avatar Upload)
* Xem danh sách sản phẩm, chi tiết sản phẩm, danh mục
* Tìm kiếm và lọc sản phẩm
* Thêm đánh giá (Review / Rating) cho sản phẩm
* Thêm vào giỏ hàng và thanh toán trực tuyến qua VNPAY / COD
* Quản lý danh sách mong ước (Wishlist)
* Xem lịch sử đơn hàng và chi tiết đơn hàng
* Nhận thông báo hệ thống

### Admin

* Dashboard thống kê và biểu đồ doanh thu, báo cáo hoạt động
* Quản lý sản phẩm (Thêm, sửa, xóa, cập nhật, upload hình ảnh)
* Quản lý và phân loại danh mục sản phẩm
* Quản lý đơn hàng và trạng thái vận chuyển
* Quản lý người dùng hệ thống và vai trò (Roles)
* Quản lý mã giảm giá (Coupons)
* Quản lý thông báo (Notfitication)
* Xem nhật ký hoạt động hệ thống (System Audit / Logs)
* Cài đặt cấu hình (Settings)

### AI (dự kiến)

* Gợi ý sản phẩm (Recommendation system)
* Tìm kiếm thông minh bằng AI
* Chatbot tư vấn, hỗ trợ khách hàng

## Bảo mật

* Xác thực và ủy quyền bằng JWT Token
* Phân quyền hệ thống (RBAC: Admin - User)
* Chống SQL Injection (Thông qua EF Core)
* Validate dữ liệu đầu vào với FluentValidation (Backend) và Reactive Forms (Frontend)

## Hướng dẫn cài đặt và chạy dự án 🚀

### 1. Chuẩn bị (Prerequisites)
*   **Backend**: .NET 8 SDK, SQL Server.
*   **Frontend**: Node.js (v18+), Angular CLI.

### 2. Cấu hình và chạy Backend
1.  **Cấu hình CSDL**: Mở file `backend/appsettings.json` (và `appsettings.Development.json`) rồi cập nhật nội dung chuỗi kết nối `DefaultConnection` cho phù hợp với SQL Server của bạn.
2.  **Mở cửa sổ dòng lệnh tại thư mục backend**:
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
    *   Copy toàn bộ nội dung và chạy (Execute) trên database vừa sinh ra để có sẵn dữ liệu sản phẩm, danh mục.
    *   *(Ghi chú: đảm bảo phải chạy `database update` THÀNH CÔNG trước khi dùng file `seed_data.sql` này)*
5.  **Chạy Server API**:
    ```bash
    dotnet run
    ```
    *API mặc định sẽ chạy ở cổng hiển thị trong Terminal (Ví dụ: `https://localhost:7057`)*

### 3. Cấu hình và chạy Frontend
1.  **Mở cửa sổ dòng lệnh ở thư mục frontend**:
    ```bash
    cd frontend
    ```
2.  **Cài đặt các gói thư viện**:
    ```bash
    npm install
    ```
3.  **Khởi động Web server**:
    ```bash
    ng serve
    # Hoặc npm start
    ```
    *Web dev server sẽ chạy và có thể truy cập tại: `http://localhost:4200`*

---

## Lưu ý quan trọng (Troubleshooting) 🛠
*   **Lỗi Cổng (Port already in use)**: Nếu gặp lỗi port 4200 hoặc port của dotnet bị chiếm dụng, hãy dùng lệnh sau trên Windows để giải phóng cổng:
    *   `taskkill /F /IM dotnet.exe /T`
    *   `taskkill /F /IM node.exe /T`
*   **Thư mục lưu trữ tĩnh (Tải ảnh/Avatar)**: Hình ảnh tải lên sẽ được ghi trực tiếp vào thư mục `backend/wwwroot/uploads...`. Hãy đảm bảo Project có đủ quyền truy cập đọc/ghi các file này.
*   **CORS**: Hệ thống đã được cấu hình CORS trong `Program.cs` hỗ trợ sẵn cho Client ở cổng `localhost:4200`.

---

## Kiến trúc 
*   **Client**: Angular 21 (Sử dụng kiến trúc Standalone Components, Signals)
*   **Web API**: ASP.NET Core 8
*   **Database**: SQL Server + Entity Framework Core 8
