-- SEED DATA FOR ECOMMERCEDB
-- Run this in SQL Server Management Studio

-- Cleanup existing data
DELETE FROM ProductAttributes;
DELETE FROM ProductImages;
DELETE FROM Products;
DELETE FROM Categories;

-- RESET IDENTITIES (Optional since we use IDENTITY_INSERT)
DBCC CHECKIDENT ('Categories', RESEED, 0);
DBCC CHECKIDENT ('Products', RESEED, 0);
DBCC CHECKIDENT ('ProductImages', RESEED, 0);
DBCC CHECKIDENT ('ProductAttributes', RESEED, 0);

-- ======================================================
-- CATEGORIES (Explicit IDs: 1-7)
-- ======================================================
SET IDENTITY_INSERT Categories ON;

INSERT INTO Categories (Id, Name, Description) VALUES
(1, N'Bàn phím cơ', N'Keyboard Gaming'),
(2, N'Chuột Gaming', N'Mouse Gaming'),
(3, N'Tai nghe', N'Headset Gaming'),
(4, N'Laptop', N'Gaming & Workstation'),
(5, N'Điện thoại', N'Smartphone & Tablet'),
(6, N'Lót chuột', N'Mousepad'),
(7, N'Ghế Gaming', N'Gaming Chair');

SET IDENTITY_INSERT Categories OFF;

-- ======================================================
-- PRODUCTS (Explicit IDs: 1-35)
-- ======================================================
SET IDENTITY_INSERT Products ON;

-- Category 1: Bàn phím
INSERT INTO Products (Id, Name, Description, Price, Stock, Sold, CategoryId) VALUES
(1, N'Keychron K2', N'Bàn phím không dây', 1800000, 50, 120, 1),
(2, N'Akko 3068B', N'Layout 65% nhỏ gọn', 1600000, 30, 85, 1),
(3, N'Razer Huntsman', N'Switch quang học', 4000000, 15, 45, 1),
(4, N'Corsair K70', N'Fullsize cao cấp', 3500000, 20, 30, 1),
(5, N'Leopold FC750R', N'Độ bền cực cao', 3200000, 10, 15, 1);

-- Category 2: Chuột
INSERT INTO Products (Id, Name, Description, Price, Stock, Sold, CategoryId) VALUES
(6, N'Logitech G Pro X', N'Siêu nhẹ 63g', 3100000, 40, 200, 2),
(7, N'Razer DeathAdder V3', N'Cảm biến 30K', 3500000, 25, 150, 2),
(8, N'SteelSeries Rival 3', N'Giá rẻ hiệu năng cao', 800000, 100, 300, 2),
(9, N'Zowie EC2', N'Chuột FPS huyền thoại', 1900000, 30, 90, 2),
(10, N'Glorious Model O', N'Vỏ tổ ong', 1400000, 50, 110, 2);

-- Category 3: Tai nghe
INSERT INTO Products (Id, Name, Description, Price, Stock, Sold, CategoryId) VALUES
(11, N'HyperX Cloud II', N'Âm thanh 7.1', 2500000, 60, 250, 3),
(12, N'Logitech G733', N'Không dây RGB', 2900000, 20, 80, 3),
(13, N'Razer BlackShark', N'Chống ồn cực tốt', 2200000, 45, 120, 3),
(14, N'SteelSeries Arctis 7', N'Lossless wireless', 4500000, 15, 40, 3),
(15, N'Corsair HS80', N'Dolby Atmos', 3800000, 25, 55, 3);

-- Category 4: Laptop
INSERT INTO Products (Id, Name, Description, Price, Stock, Sold, CategoryId) VALUES
(16, N'ROG Strix G16', N'RTX 4060, i7-13650H', 38000000, 10, 25, 4),
(17, N'MacBook M3', N'Mỏng nhẹ mạnh mẽ', 32000000, 15, 60, 4),
(18, N'MSI Katana 15', N'Giá rẻ hiệu năng cao', 24000000, 20, 45, 4),
(19, N'Acer Helios Neo', N'Tản nhiệt cực đỉnh', 31000000, 8, 12, 4),
(20, N'Dell XPS 15', N'Đẳng cấp văn phòng', 50000000, 5, 8, 4);

-- Category 5: Điện thoại
INSERT INTO Products (Id, Name, Description, Price, Stock, Sold, CategoryId) VALUES
(21, N'iPhone 15 Pro', N'Titan tự nhiên', 28000000, 20, 150, 5),
(22, N'Samsung S24 Ultra', N'Galaxy AI', 26000000, 25, 130, 5),
(23, N'ROG Phone 8', N'Chiến game đỉnh cao', 27000000, 10, 40, 5),
(24, N'iPad Pro M4', N'Màn hình OLED', 27500000, 15, 35, 5),
(25, N'Xiaomi 14', N'Camera Leica', 18000000, 30, 95, 5);

-- Category 6: Lót chuột
INSERT INTO Products (Id, Name, Description, Price, Stock, Sold, CategoryId) VALUES
(26, N'SteelSeries Qck+', N'Vải mịn Large', 450000, 100, 500, 6),
(27, N'Razer Gigantus', N'Chống trượt', 550000, 80, 350, 6),
(28, N'Logitech G640', N'Độ ma sát thấp', 600000, 50, 200, 6),
(29, N'Lót chuột Custom', N'In hình theo yêu cầu', 250000, 200, 400, 6),
(30, N'Asus ROG Scabbard', N'Cực đại 90x40', 1200000, 30, 120, 6);

-- Category 7: Ghế Gaming
INSERT INTO Products (Id, Name, Description, Price, Stock, Sold, CategoryId) VALUES
(31, N'Secretlab Titan', N'Ghế số 1 thế giới', 12000000, 5, 15, 7),
(32, N'Warrior Raider', N'Da PU cao cấp', 3500000, 15, 40, 7),
(33, N'E-Dra Midnight', N'Rẻ mà bền', 2200000, 20, 65, 7),
(34, N'Sihoo M57', N'Công thái học', 3800000, 25, 50, 7),
(35, N'Anda Seat Kaiser', N'Khung thép chắc chắn', 8500000, 10, 20, 7);

SET IDENTITY_INSERT Products OFF;

-- ======================================================
-- PRODUCT IMAGES
-- ======================================================
INSERT INTO ProductImages (ProductId, ImageUrl, IsPrimary) VALUES
-- Hình Bàn phím (1-5)
(1, 'https://cdn.shopify.com/s/files/1/0608/5145/4022/files/Keychron-K2-6.png?v=1728319130', 1),
(2, 'https://akkogear.com.vn/wp-content/uploads/2021/11/ban-phim-co-akko-3068b-multi-modes-black-pink02.jpg', 1),
(3, 'https://product.hstatic.net/1000333506/product/dition_rgb_chroma_razer_optical_linear_switch_black_rz03_03080100_r3m1_0db25d29b7c24a33b120f785d0fcd723.jpg', 1),--
(4, 'https://bizweb.dktcdn.net/100/410/941/products/1-e41a5415-d6d4-4ec1-83d7-463eca3e2b78.jpg?v=1613968257280', 1),--
(5, 'https://images-na.ssl-images-amazon.com/images/I/71XCJrkpp-L.jpg', 1),--
-- Hình Chuột (6-10)
(6, 'https://bizweb.dktcdn.net/thumb/1024x1024/100/598/846/products/41863-1.jpg?v=1758297157970', 1),
(7, 'https://hanoicomputercdn.com/media/product/67663_chuot_game_khong_day_razer_deathadder_v3_pro_ergonomic_usb_rgb_rz01_04630100_r3a1_0004_5.jpg', 1),
(8, 'https://owlgaming.vn/wp-content/uploads/2021/01/Chu%E1%BB%99t-SteelSeries-Rival-3-4.jpg', 1),
(9, 'https://image.benq.com/is/image/benqco/03-ec2-c-back-left-45-202501?$ResponsivePreset$&fmt=png-alpha', 1),
(10, 'https://owlgaming.vn/wp-content/uploads/2023/08/chuot-khong-day-glorious-model-o-2-wireless-matte-white.jpg', 1),
-- Hình Tai nghe (11-15)
(11, 'https://laptop88.vn/media/product/5783_16.jpg', 1),
(12, 'https://bizweb.dktcdn.net/thumb/1024x1024/100/598/846/products/oip-sg5iizl8fodnq5jkq9cndghaig.jpg?v=1775638813637', 1),
(13, 'https://product.hstatic.net/200000637319/product/71u8xpmccxl._ac_sl1500___1__c0f2108126be464790dfaada7b92fdbd.jpg', 1),
(14, 'https://hanoicomputercdn.com/media/product/79118_tai_nghe_gaming_khong_day_steelseries_arctis_7_white_1.jpg', 1),
(15, 'https://product.hstatic.net/200000722513/product/led_rgb_wireless_ca_9011235_ap_0001_2_436fee75cc8d499e9d7619b9efef8acd_8f3b7e1f606c49b8b209034703d29d54.jpg', 1),
-- Hình Laptop (16-20)
(16, 'https://bizweb.dktcdn.net/thumb/grande/100/512/769/products/h732-2-copy-ff8f0d62-ab2b-4162-8c68-72ebadac0b4d.jpg?v=1714908745957', 1),
(17, 'https://macstores.vn/wp-content/uploads/2024/03/macbook_air_2024_m3_13inch__16gb_512gb_silver_1-300x300.jpg', 1),
(18, 'https://lapvip.vn/upload/products/thumb_800x0/httpslaptopworldvnmediaproduct250-22701-msi-crosshair-16-hx-ai-d2xw-5jpg-1753931384.jpg', 1),
(19, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_14__9_26_1.png', 1),
(20, 'https://www.laptopvip.vn/images/ab__webp/detailed/31/notebook-xps-15-9530-t-black-g--4-~1-clce-or-www.laptopvip.vn-1683083662.webp', 1),
-- Hình Điện thoại (21-25)
(21, 'https://hanoicomputercdn.com/media/product/76341_natural_titanium_update__3_.jpg', 1),
(22, 'https://azmobile.net/pic/product/8a6ce85b-4cce-4e0a-8c0f-0c74b7c5c541.jpg', 1),
(23, 'https://images-na.ssl-images-amazon.com/images/I/71jfVe7scjL.jpg', 1),
(24, 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_5_10_638509284806101849_danh-gia-ipad-pro-2024-6.jpeg', 1),
(25, 'https://viostore.vn/wp-content/uploads/2024/02/4-2.png', 1),
-- Hình Lót chuột (26-30)
(26, 'https://m.media-amazon.com/images/I/41fv54TCDyL.jpg', 1),
(27, 'https://nguyencongpc.vn/media/product/19829-razer-gigantus-v2-large-2.jpg', 1),
(28, 'https://bizweb.dktcdn.net/thumb/grande/100/598/846/products/oip-rh-t6ndl-scsvuzekbosmqhae3.webp?v=1762414115513', 1),
(29, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m9n5ohw5skg264', 1),
(30, 'https://product.hstatic.net/1000129940/product/asus-rog-scabbard_3fa28e59031e4ed2af7e1bdde54bbc5c.jpg', 1),
-- Hình Ghế (31-35)
(31, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ45-0ixRQ33tU74CKJW-KRGDn9lqGgRnIrbw&s', 1),
(32, 'https://akkogear.com.vn/wp-content/uploads/2023/06/ghe-choi-game-warrior-wgc203-black-red-01.jpg', 1),
(33, 'https://owlgaming.vn/wp-content/uploads/2020/06/e-dra-midnight-gaming-chair-egc205-01.jpg', 1),
(34, 'https://m.media-amazon.com/images/I/71O-02eW61L.jpg', 1),
(35, 'https://www.andaseat.com/cdn/shop/files/AndaSeat-new-kaiser-4-series-gaming-chair-bentley-brown-45.webp?v=1769062951&width=720', 1);


-- ======================================================
-- PRODUCT ATTRIBUTES
-- ======================================================
INSERT INTO ProductAttributes (ProductId, AttributeName, AttributeValue) VALUES
(1, N'Kết nối', N'Bluetooth 5.1 / Wired'),
(1, N'Switch', N'Gateron Mechanical'),
(1, N'Layout', N'75%'),
(2, N'Kết nối', N'2.4Ghz / Bluetooth / USB-C'),
(2, N'Keycap', N'PBT Double-shot'),
(3, N'Công nghệ', N'Razer Optical Switches'),
(4, N'Chất liệu', N'Khung nhôm máy bay'),
(5, N'Loại phím', N'TKL (Tenkeyless)'),
(6, N'Trọng lượng', N'63 grams'),
(6, N'Cảm biến', N'HERO 25K'),
(7, N'Độ nhạy', N'30,000 DPI'),
(8, N'Đèn nền', N'Prism RGB 3 vùng'),
(9, N'Tần số quét', N'1000 Hz'),
(10, N'Kiểu vỏ', N'Honeycomb (Tổ ong)'),
(11, N'Kiểu kết nối', N'Wireless 2.4Ghz'),
(11, N'Thời lượng pin', N'30 giờ'),
(12, N'Trọng lượng', N'278 grams'),
(13, N'Driver', N'Triforce Titanium 50mm'),
(14, N'Âm thanh', N'DTS Headphone:X v2.0'),
(15, N'Công nghệ mic', N'Broadcast-grade Omni-directional'),
(16, N'CPU', N'Intel Core i7-13650HX'),
(16, N'VGA', N'NVIDIA RTX 4060 8GB'),
(17, N'Màn hình', N'Liquid Retina XDR'),
(17, N'RAM', N'16GB Unified Memory'),
(18, N'Ổ cứng', N'512GB NVMe SSD'),
(19, N'Màn hình', N'16 inch 2K 165Hz'),
(20, N'Độ phân giải', N'3.5K OLED Touch'),
(21, N'Chipset', N'A17 Pro (3nm)'),
(21, N'Camera', N'48MP Main / 5x Telephoto'),
(22, N'Bút cảm ứng', N'S-Pen đi kèm'),
(23, N'Tản nhiệt', N'GameCool 8 System'),
(24, N'Màn hình', N'13 inch Ultra Retina Tandem OLED'),
(25, N'Sạc nhanh', N'HyperCharge 90W'),
(26, N'Kích thước', N'450 x 400 x 2 mm'),
(27, N'Bề mặt', N'Hybrid (Speed & Control)'),
(28, N'Độ dày', N'3 mm'),
(29, N'Tính năng', N'Chống nước nhẹ'),
(30, N'Chất liệu', N'Cordura Fabric'),
(31, N'Chất liệu', N'Da giả cao cấp Hybrid Leatherette'),
(31, N'Trọng tải tối đa', N'130 kg'),
(32, N'Góc ngả', N'135 độ'),
(33, N'Loại đệm', N'Mousse đúc nguyên khối'),
(34, N'Cơ chế', N'Công thái học (Ergonomic)'),
(35, N'Tay ghế', N'4D Adjustable');

-- ======================================================
-- SETTINGS
-- ======================================================
DELETE FROM Settings;
INSERT INTO Settings ([Key], [Value], [Group], [Description]) VALUES
('StoreName', N'Antigravity Gear', 'Store', N'Tên hiển thị của cửa hàng'),
('StoreEmail', 'contact@antigravity.vn', 'Store', N'Email liên hệ chính thức'),
('StorePhone', '0901234567', 'Store', N'Số điện thoại hỗ trợ'),
('StoreAddress', N'280 An Dương Vương, P4, Q5, TP.HCM', 'Store', N'Địa chỉ trụ sở chính'),
('ShippingFee', '30000', 'Shipping', N'Phí vận chuyển mặc định (VNĐ)'),
('FreeShippingThreshold', '2000000', 'Shipping', N'Ngưỡng đơn hàng được miễn phí ship (VNĐ)'),
('EnableCOD', 'true', 'Payment', N'Cho phép thanh toán khi nhận hàng'),
('BankName', 'Vietcombank', 'Payment', N'Tên ngân hàng'),
('BankAccountName', N'NGUYEN VAN A', 'Payment', N'Tên chủ tài khoản'),
('BankAccountNumber', '1234567890', 'Payment', N'Số tài khoản ngân hàng');
