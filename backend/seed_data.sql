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
INSERT INTO Products (Id, Name, Description, Price, Stock, CategoryId) VALUES
(1, N'Keychron K2', N'Bàn phím không dây', 1800000, 50, 1),
(2, N'Akko 3068B', N'Layout 65% nhỏ gọn', 1600000, 30, 1),
(3, N'Razer Huntsman', N'Switch quang học', 4000000, 15, 1),
(4, N'Corsair K70', N'Fullsize cao cấp', 3500000, 20, 1),
(5, N'Leopold FC750R', N'Độ bền cực cao', 3200000, 10, 1);

-- Category 2: Chuột
INSERT INTO Products (Id, Name, Description, Price, Stock, CategoryId) VALUES
(6, N'Logitech G Pro X', N'Siêu nhẹ 63g', 3100000, 40, 2),
(7, N'Razer DeathAdder V3', N'Cảm biến 30K', 3500000, 25, 2),
(8, N'SteelSeries Rival 3', N'Giá rẻ hiệu năng cao', 800000, 100, 2),
(9, N'Zowie EC2', N'Chuột FPS huyền thoại', 1900000, 30, 2),
(10, N'Glorious Model O', N'Vỏ tổ ong', 1400000, 50, 2);

-- Category 3: Tai nghe
INSERT INTO Products (Id, Name, Description, Price, Stock, CategoryId) VALUES
(11, N'HyperX Cloud II', N'Âm thanh 7.1', 2500000, 60, 3),
(12, N'Logitech G733', N'Không dây RGB', 2900000, 20, 3),
(13, N'Razer BlackShark', N'Chống ồn cực tốt', 2200000, 45, 3),
(14, N'SteelSeries Arctis 7', N'Lossless wireless', 4500000, 15, 3),
(15, N'Corsair HS80', N'Dolby Atmos', 3800000, 25, 3);

-- Category 4: Laptop
INSERT INTO Products (Id, Name, Description, Price, Stock, CategoryId) VALUES
(16, N'ROG Strix G16', N'RTX 4060, i7-13650H', 38000000, 10, 4),
(17, N'MacBook M3', N'Mỏng nhẹ mạnh mẽ', 32000000, 15, 4),
(18, N'MSI Katana 15', N'Giá rẻ hiệu năng cao', 24000000, 20, 4),
(19, N'Acer Helios Neo', N'Tản nhiệt cực đỉnh', 31000000, 8, 4),
(20, N'Dell XPS 15', N'Đẳng cấp văn phòng', 50000000, 5, 4);

-- Category 5: Điện thoại
INSERT INTO Products (Id, Name, Description, Price, Stock, CategoryId) VALUES
(21, N'iPhone 15 Pro', N'Titan tự nhiên', 28000000, 20, 5),
(22, N'Samsung S24 Ultra', N'Galaxy AI', 26000000, 25, 5),
(23, N'ROG Phone 8', N'Chiến game đỉnh cao', 27000000, 10, 5),
(24, N'iPad Pro M4', N'Màn hình OLED', 27500000, 15, 5),
(25, N'Xiaomi 14', N'Camera Leica', 18000000, 30, 5);

-- Category 6: Lót chuột
INSERT INTO Products (Id, Name, Description, Price, Stock, CategoryId) VALUES
(26, N'SteelSeries Qck+', N'Vải mịn Large', 450000, 100, 6),
(27, N'Razer Gigantus', N'Chống trượt', 550000, 80, 6),
(28, N'Logitech G640', N'Độ ma sát thấp', 600000, 50, 6),
(29, N'Lót chuột Custom', N'In hình theo yêu cầu', 250000, 200, 6),
(30, N'Asus ROG Scabbard', N'Cực đại 90x40', 1200000, 30, 6);

-- Category 7: Ghế Gaming
INSERT INTO Products (Id, Name, Description, Price, Stock, CategoryId) VALUES
(31, N'Secretlab Titan', N'Ghế số 1 thế giới', 12000000, 5, 7),
(32, N'Warrior Raider', N'Da PU cao cấp', 3500000, 15, 7),
(33, N'E-Dra Midnight', N'Rẻ mà bền', 2200000, 20, 7),
(34, N'Sihoo M57', N'Công thái học', 3800000, 25, 7),
(35, N'Anda Seat Kaiser', N'Khung thép chắc chắn', 8500000, 10, 7);

SET IDENTITY_INSERT Products OFF;

-- ======================================================
-- PRODUCT IMAGES
-- ======================================================
INSERT INTO ProductImages (ProductId, ImageUrl, IsPrimary) VALUES
(1, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500', 1),
(2, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500', 1),
(3, 'https://images.unsplash.com/photo-1626958390898-162d3577f593?w=500', 1),
(4, 'https://images.unsplash.com/photo-1618384881928-0288219493f0?w=500', 1),
(5, 'https://images.unsplash.com/photo-1541140532154-b024d715b909?w=500', 1),
(6, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500', 1),
(7, 'https://images.unsplash.com/photo-1527814732934-94a1a5d13599?w=500', 1),
(8, 'https://images.unsplash.com/photo-1613141411244-0e4ac259d217?w=500', 1),
(9, 'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=500', 1),
(10, 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=500', 1),
(11, 'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=500', 1),
(12, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500', 1),
(13, 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=500', 1),
(14, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500', 1),
(15, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 1),
(16, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500', 1),
(17, 'https://images.unsplash.com/photo-1517336714467-d23784a1c67d?w=500', 1),
(18, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500', 1),
(19, 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?w=500', 1),
(20, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500', 1),
(21, 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500', 1),
(22, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500', 1),
(23, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 1),
(24, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', 1),
(25, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', 1),
(26, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500', 1),
(27, 'https://images.unsplash.com/photo-1629429464245-48cb615e4f4c?w=500', 1),
(28, 'https://images.unsplash.com/photo-1631553127988-3485780eb178?w=500', 1),
(29, 'https://images.unsplash.com/photo-1600084053334-757482855163?w=500', 1),
(30, 'https://images.unsplash.com/photo-1616509091215-574349ab9027?w=500', 1),
(31, 'https://images.unsplash.com/photo-1598550476439-6847785fce6c?w=500', 1),
(32, 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=500', 1),
(33, 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500', 1),
(34, 'https://images.unsplash.com/photo-1505797149-43b007664a3d?w=500', 1),
(35, 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500', 1);

-- ======================================================
-- PRODUCT ATTRIBUTES
-- ======================================================
INSERT INTO ProductAttributes (ProductId, AttributeName, AttributeValue) VALUES
(1, N'Kết nối', N'Bluetooth 5.1 / Wired'),
(1, N'Switch', N'Gateron Mechanical'),
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
