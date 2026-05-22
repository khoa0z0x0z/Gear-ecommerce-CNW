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
(1, N'Keychron K2', N'Bàn phím cơ không dây đa năng, lý tưởng cho dân coder/văn phòng thích sự nhỏ gọn. Gõ cực êm không ồn ào.', 1800000, 50, 120, 1),
(2, N'Akko 3068B', N'Bàn phím thiết kế layout 65% nhỏ gọn, màu sắc pastel nữ tính. Phù hợp cho setup góc làm việc tối giản.', 1600000, 30, 85, 1),
(3, N'Razer Huntsman', N'Trang bị Switch quang học tốc độ siêu phản hồi. Dành riêng cho game thủ eSport try-hard cần độ trễ bằng 0.', 4000000, 15, 45, 1),
(4, N'Corsair K70', N'Bàn phím Fullsize cao cấp khung nhôm máy bay bền bỉ, tích hợp kê tay. Phù hợp anh em thích hầm hố, gõ đầm tay.', 3500000, 20, 30, 1),
(5, N'Leopold FC750R', N'Huyền thoại phím cơ cổ điển, Keycap PBT cực dày dặn, gõ êm ái vô địch trong tầm giá. Dành cho người gõ phím chuyên nghiệp.', 3200000, 10, 15, 1);

-- Category 2: Chuột
INSERT INTO Products (Id, Name, Description, Price, Stock, Sold, CategoryId) VALUES
(6, N'Logitech G Pro X Superlight', N'Chỉ 63g siêu nhẹ, cảm biến HERO 25K đỉnh cao. Lựa chọn số 1 của các game thủ CS:GO và Valorant.', 3100000, 40, 200, 2),
(7, N'Razer DeathAdder V3 Pro', N'Thiết kế công thái học ôm sát tay, cảm biến 30K siêu nhạy. Dành cho người tay to thích cầm theo kiểu Palm Grip.', 3500000, 25, 150, 2),
(8, N'SteelSeries Rival 3', N'Chuột giá rẻ quốc dân nhưng hiệu năng cực cao, phù hợp HSSV và học sinh mua về học tập lẫn giải trí.', 800000, 100, 300, 2),
(9, N'Zowie EC2', N'Huyền thoại bắn súng FPS form bất đối xứng. Không rườm rà LED lủng, tập trung 100% vào kỹ năng.', 1900000, 30, 90, 2),
(10, N'Glorious Model O Wireless', N'Chuột vỏ tổ ong xuyên thấu độc đáo, trọng lượng nhẹ, led RGB siêu đẹp phù hợp góc setup sặc sỡ.', 1400000, 50, 110, 2);

-- Category 3: Tai nghe
INSERT INTO Products (Id, Name, Description, Price, Stock, Sold, CategoryId) VALUES
(11, N'HyperX Cloud II', N'Tai nghe quốc dân với âm thanh vòm 7.1. Cảm giác đeo êm ái cả ngày dài, phù hợp nghe nhạc và chơi game.', 2500000, 60, 250, 3),
(12, N'Logitech G733', N'Tai nghe không dây siêu nhẹ, mút xốp êm ái, màu sắc trẻ trung. Microphone chống ồn đàm thoại cực tốt.', 2900000, 20, 80, 3),
(13, N'Razer BlackShark V2', N'Chụp tai cách âm bị động cực tốt, khử ồn bên ngoài xuất sắc. Trọng lượng nhẹ không gây đau đầu.', 2200000, 45, 120, 3),
(14, N'SteelSeries Arctis 7', N'Công nghệ không dây Lossless mượt mà, thiết kế dải băng đô thông minh giúp phân bổ trọng lượng. Âm thanh cực chi tiết.', 4500000, 15, 40, 3),
(15, N'Corsair HS80', N'Tích hợp công nghệ Dolby Atmos xịn xò. Cho trải nghiệm xem phim và chơi game AAA cực kỳ sống động.', 3800000, 25, 55, 3);

-- Category 4: Laptop
INSERT INTO Products (Id, Name, Description, Price, Stock, Sold, CategoryId) VALUES
(16, N'ROG Strix G16', N'Chiếc Laptop Gaming sở hữu RTX 4060, CPU i7-13650H cực mạnh. Phù hợp để lập trình AI, edit video 4K hoặc chiến mượt các game nặng nhất.', 38000000, 10, 25, 4),
(17, N'MacBook Air M3', N'Laptop mỏng nhẹ đẳng cấp, chip M3 siêu tiết kiệm pin tới 18 tiếng. Chuyên dụng cho dân văn phòng, lập trình viên web/mobile.', 32000000, 15, 60, 4),
(18, N'MSI Katana 15', N'Laptop Gaming giá rẻ nhưng sở hữu Card rời RTX 3050 mạnh mẽ. Lựa chọn tuyệt vời cho sinh viên khối kỹ thuật và đồ họa cơ bản.', 24000000, 20, 45, 4),
(19, N'Acer Helios Neo', N'Vua tản nhiệt phân khúc, máy luôn mát lạnh dù treo game cường độ cao. GPU RTX 4060 cùng màn hình 165Hz chuẩn màu.', 31000000, 8, 12, 4),
(20, N'Dell XPS 15', N'Kiệt tác công nghệ với viền màn hình siêu mỏng, vỏ nhôm nguyên khối. Dành riêng cho Doanh nhân và Giám đốc yêu sự hoàn mỹ.', 50000000, 5, 8, 4);

-- Category 5: Điện thoại
INSERT INTO Products (Id, Name, Description, Price, Stock, Sold, CategoryId) VALUES
(21, N'iPhone 15 Pro', N'Sự kết hợp hoàn hảo giữa vật liệu Titan siêu nhẹ và chip A17 Pro. Quay video điện ảnh chuẩn Hollywood, chụp đêm đỉnh cao.', 28000000, 20, 150, 5),
(22, N'Samsung S24 Ultra', N'Kỷ nguyên Galaxy AI thông minh, dịch thuật trực tiếp, khoanh tròn tìm kiếm tiện lợi. Bút S-Pen hoàn hảo cho người làm nội dung.', 26000000, 25, 130, 5),
(23, N'ROG Phone 8', N'Mãnh thú làng game Mobile, tản nhiệt buồng hơi siêu lớn, tần số quét 165Hz. Chơi Genshin Impact không tụt khung hình.', 27000000, 10, 40, 5),
(24, N'iPad Pro M4', N'Sức mạnh xử lý vượt qua cả laptop, màn hình OLED Tandem siêu nét rực rỡ, thiết kế vuốt mỏng ấn tượng.', 27500000, 15, 35, 5),
(25, N'Xiaomi 14', N'Smartphone nhỏ gọn sở hữu cụm Camera Leica nhiếp ảnh chuyên nghiệp. Sạc siêu tốc đáp ứng ngày dài bận rộn.', 18000000, 30, 95, 5);

-- Category 6: Lót chuột
INSERT INTO Products (Id, Name, Description, Price, Stock, Sold, CategoryId) VALUES
(26, N'SteelSeries Qck+', N'Quốc dân làng lót chuột với bề mặt vải nhám mịn, kiểm soát cực tốt (Control), phù hợp game bắn súng FPS.', 450000, 100, 500, 6),
(27, N'Razer Gigantus V2', N'Độ dày ấn tượng, foam cao su đặc chống lún tốt. Giúp di chuột mượt mà cả ngày dài.', 550000, 80, 350, 6),
(28, N'Logitech G640', N'Bề mặt ma sát thấp (Speed), phù hợp cho những pha lia chuột tốc độ cao trong LMHT hay Dota 2.', 600000, 50, 200, 6),
(29, N'Lót chuột Custom', N'Sản phẩm cá nhân hóa, in mọi hình ảnh theo yêu cầu với chất lượng sắc nét, bo viền cẩn thận chống bung chỉ.', 250000, 200, 400, 6),
(30, N'Asus ROG Scabbard', N'Kích cỡ bao toàn bộ bàn làm việc, vải Cordura chống nước, chống xước cực kỳ bền bỉ chuẩn quân đội.', 1200000, 30, 120, 6);

-- Category 7: Ghế Gaming
INSERT INTO Products (Id, Name, Description, Price, Stock, Sold, CategoryId) VALUES
(31, N'Secretlab Titan Evo', N'Biểu tượng xa xỉ của góc Gaming. Chất liệu da đệ nhất, form dáng chuẩn y khoa, độ êm vô đối xứng đáng từng xu.', 12000000, 5, 15, 7),
(32, N'Warrior Raider', N'Ngon bổ rẻ cho người mới nhập môn, da PU dễ lau chùi, form người Việt Nam ngồi ôm lưng thoải mái.', 3500000, 15, 40, 7),
(33, N'E-Dra Midnight', N'Rẻ nhất nhưng độ cứng cáp bất ngờ, mút đúc chống lún. Hợp ví tiền học sinh sinh viên lập góc chơi game.', 2200000, 20, 65, 7),
(34, N'Sihoo M57', N'Ghế lưới công thái học tản nhiệt siêu thoáng. Cứu tinh đau mỏi vai gáy cho Coder làm việc 10 tiếng một ngày.', 3800000, 25, 50, 7),
(35, N'Anda Seat Kaiser 3', N'Form cực kỳ rộng rãi cho người đô con (Tới 150kg). Khung thép gia cố siêu dày, gối tựa đầu từ tính xịn xò.', 8500000, 10, 20, 7);

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
-- Keyboards (1-5)
(1, N'Kết nối', N'Bluetooth 5.1 / Type-C'), (1, N'Switch', N'Gateron Brown'), (1, N'Layout', N'75% (84 phím)'), (1, N'Pin', N'4000mAh (Lên đến 240 giờ)'), (1, N'Trọng lượng', N'663g'), (1, N'Nhu cầu', N'Văn phòng, Lập trình'),
(2, N'Kết nối', N'2.4Ghz / Bluetooth 5.0 / Type-C'), (2, N'Switch', N'Akko CS Jelly Pink'), (2, N'Layout', N'65% (68 phím)'), (2, N'Pin', N'1800mAh'), (2, N'Nhu cầu', N'Góc tối giản, Gõ phím nhẹ'),
(3, N'Công nghệ', N'Razer Optical Switches (Linear)'), (3, N'Layout', N'Fullsize (104 phím)'), (3, N'Độ trễ', N'0.2ms'), (3, N'Nhu cầu', N'Moba, FPS eSport chuyên nghiệp'),
(4, N'Chất liệu', N'Khung nhôm nguyên khối'), (4, N'Switch', N'Cherry MX Red'), (4, N'Tính năng', N'Kê tay rời, Con lăn âm lượng'), (4, N'Nhu cầu', N'Chơi game AAA, Streamer'),
(5, N'Thiết kế', N'Cổ điển, Không LED'), (5, N'Keycap', N'PBT Double-shot siêu dày 1.5mm'), (5, N'Switch', N'Cherry MX Blue'), (5, N'Nhu cầu', N'Nhà văn, Coder chuyên đánh máy'),

-- Mice (6-10)
(6, N'Trọng lượng', N'63g siêu nhẹ'), (6, N'Cảm biến', N'HERO 25K'), (6, N'Pin', N'70 giờ liên tục'), (6, N'Form', N'Đối xứng'), (6, N'Nhu cầu', N'FPS, Try hard CSGO, Valorant'),
(7, N'Trọng lượng', N'63g'), (7, N'Cảm biến', N'Focus Pro 30K Optical'), (7, N'Switch', N'Razer Optical Gen-3'), (7, N'Form', N'Công thái học lệch phải'), (7, N'Nhu cầu', N'Tay to, Bắn súng'),
(8, N'Mắt đọc', N'TrueMove Core'), (8, N'Đèn LED', N'Prism RGB 3 vùng'), (8, N'Trọng lượng', N'77g'), (8, N'Nhu cầu', N'Học sinh sinh viên, Múc đích chung'),
(9, N'Cảm biến', N'3360'), (9, N'Thiết kế', N'Plug and Play (Không Driver)'), (9, N'Form', N'Ergonomic (Lưng cao)'), (9, N'Nhu cầu', N'Tuyển thủ CSGO'),
(10, N'Thiết kế', N'Vỏ đục lỗ tổ ong (Honeycomb)'), (10, N'Trọng lượng', N'69g'), (10, N'Pin', N'71 giờ (Tắt LED)'), (10, N'Nhu cầu', N'Setup RGB, Game MOBA'),

-- Headsets (11-15)
(11, N'Kết nối', N'Wireless 2.4Ghz'), (11, N'Âm thanh', N'Giả lập 7.1 Surround'), (11, N'Pin', N'Lên đến 30 giờ'), (11, N'Nhu cầu', N'Nghe tiếng bước chân FPS'),
(12, N'Kết nối', N'Lightspeed Wireless'), (12, N'Trọng lượng', N'278g'), (12, N'Đèn nền', N'Lightsync RGB 2 vùng'), (12, N'Nhu cầu', N'Setup trẻ trung, Streamer'),
(13, N'Màng loa', N'Triforce Titanium 50mm'), (13, N'Mic', N'HyperClear Cardioid'), (13, N'Cách âm', N'Passive Noise Cancellation'), (13, N'Nhu cầu', N'Phòng ồn, Giải đấu eSport'),
(14, N'Kết nối', N'Băng tần kép (2.4Ghz & Bluetooth)'), (14, N'Chất liệu', N'Hợp kim thép, Vải dù'), (14, N'Phần mềm', N'Sonar Audio Desktop'), (14, N'Nhu cầu', N'Đa dụng PC, PS5, Mobile'),
(15, N'Âm thanh', N'Hỗ trợ Dolby Atmos spatial audio'), (15, N'Mic', N'Broadcast-grade'), (15, N'Kết nối', N'Slipstream Wireless'), (15, N'Nhu cầu', N'Xem phim điện ảnh, Chơi game AAA'),

-- Laptops (16-20)
(16, N'CPU', N'Intel Core i7-13650HX (14 nhân)'), (16, N'VGA', N'NVIDIA RTX 4060 8GB'), (16, N'RAM', N'16GB DDR5 4800MHz'), (16, N'Màn hình', N'16" FHD+ 165Hz'), (16, N'Nhu cầu', N'Lập trình AI, Học máy, Game Nặng'),
(17, N'Chip', N'Apple M3 (8-core CPU, 10-core GPU)'), (17, N'RAM', N'16GB Unified'), (17, N'Lưu trữ', N'512GB SSD'), (17, N'Pin', N'18 tiếng'), (17, N'Nhu cầu', N'Đi công tác, Code Web, Sang trọng'),
(18, N'CPU', N'Intel Core i7-12650H'), (18, N'VGA', N'NVIDIA RTX 3050 4GB'), (18, N'Màn hình', N'15.6" FHD 144Hz'), (18, N'Trọng lượng', N'2.25kg'), (18, N'Nhu cầu', N'Sinh viên đồ họa nền tảng, Game tầm trung'),
(19, N'CPU', N'Intel Core i5-13500HX'), (19, N'VGA', N'NVIDIA RTX 4060 140W'), (19, N'Màn hình', N'16" WQXGA 165Hz 100% sRGB'), (19, N'Tản nhiệt', N'Quạt AeroBlade 3D thế hệ 5'), (19, N'Nhu cầu', N'Cày cuốc game liên tục không sợ nóng'),
(20, N'CPU', N'Intel Core i7-13700H'), (20, N'Màn hình', N'15.6" 3.5K OLED Cảm ứng'), (20, N'Vỏ', N'Nhôm nguyên khối cắt CNC, viền Carbon siêu mỏng'), (20, N'Nhu cầu', N'Giám đốc, Doanh nhân đẳng cấp'),

-- Phones & Tablets (21-25)
(21, N'Chip', N'A17 Pro (3nm)'), (21, N'Vật liệu', N'Titanium Cấp Hàng Không'), (21, N'Camera', N'48MP (Zoom Quang 5x)'), (21, N'Cổng sạc', N'USB-C 3.0 (10Gbps)'), (21, N'Nhu cầu', N'Quay Vlog TikTok, Nhiếp ảnh'),
(22, N'Tính năng AI', N'Dịch trực tiếp, Khoanh tròn tìm kiếm, Note Assist'), (22, N'Bút cảm ứng', N'Trang bị S-Pen tích hợp'), (22, N'Màn hình', N'6.8" Dynamic AMOLED (Độ sáng 2600 nits)'), (22, N'Nhu cầu', N'Làm việc di động, Ghi chú sáng tạo'),
(23, N'Chip', N'Snapdragon 8 Gen 3'), (23, N'Tản nhiệt', N'GameCool 8 (Dẫn nhiệt kim loại lỏng)'), (23, N'Màn hình', N'AMOLED 165Hz'), (23, N'Nhu cầu', N'Tuyển thủ PUBG, Genshin thủ'),
(24, N'Chip', N'Apple M4 (Ai Engine Vượt trội)'), (24, N'Màn hình', N'13" Ultra Retina Tandem OLED'), (24, N'Độ mỏng', N'5.1 mm (Siêu mỏng)'), (24, N'Nhu cầu', N'Thiết kế đồ họa kĩ thuật số, Thay thế Laptop'),
(25, N'Camera', N'Leica Summilux, Cảm biến Light Hunter 900'), (25, N'Sạc', N'90W (Có dây) / 50W (Không dây)'), (25, N'Kích thước', N'6.36 inch (Cầm vừa gọn tay)'), (25, N'Nhu cầu', N'Smartphone nhỏ gọn sức mạnh Flagship'),

-- Lót chuột (26-30)
(26, N'Bề mặt', N'Vải nhám mật độ cao (Micro-woven)'), (26, N'Kích thước', N'450 x 400 x 2mm (Large)'), (26, N'Form', N'Dành cho lối chơi Control'),
(27, N'Bề mặt', N'Vải sợi nhám siêu mỏng'), (27, N'Chất nền', N'Cao su đặc bám bàn chân không'), (27, N'Độ dày', N'3mm'),
(28, N'Bề mặt', N'Ma sát cực thấp (Speed)'), (28, N'Kích thước', N'400 x 460 x 3mm'), (28, N'Nhu cầu', N'Game cường độ quay chuột cao (Flick)'),
(29, N'Dịch vụ', N'In theo hình cầu khách (Custom Art)'), (29, N'Bề mặt', N'Phủ Poly siêu mịn, chống nước văng'), (29, N'Viền', N'Bo mép chống bung 100%'),
(30, N'Chất liệu', N'Nhựa Cordura siêu bền siêu trượt'), (30, N'Kích thước', N'900 x 400 x 3mm (Deskmat)'), (30, N'Tính năng', N'Chống xước, Chống đổ nước trực tiếp'),

-- Ghế Gaming (31-35)
(31, N'Chất liệu da', N'Neo Hybrid Leatherette (Bền gấp 12 lần)'), (31, N'Đệm tựa lưng', N'L-ADAPT™ 4 hướng có thể điều chỉnh'), (31, N'Kệ để tay', N'4D nam châm CloudSwap'), (31, N'Nhu cầu', N'Thượng lưu, Ngồi lâu không gãy lưng'),
(32, N'Chất liệu da', N'Da PU chống xước'), (32, N'Khung', N'Thép chống gỉ siêu cường'), (32, N'Tải trọng', N'Đến 120kg'), (32, N'Nhu cầu', N'Kinh phí thấp mua xài ngay'),
(33, N'Đệm mút', N'Cao su non nguyên khối siêu đàn hồi'), (33, N'Chân đế', N'Nylon cứng siêu bền chịu va đập'), (33, N'Góc ngả', N'180 độ'), (33, N'Nhu cầu', N'Phòng Stream giá rẻ, Ngả lưng ngủ ngon giấc'),
(34, N'Chất liệu', N'Lưới cao cấp siêu thoáng mát'), (34, N'Cơ chế lưng', N'Lưng kép ôm tự động bám dính cột sống'), (34, N'Tay vịn', N'3D di chuyển'), (34, N'Nhu cầu', N'Dân lập trình Code ròng rã 12 tiếng'),
(35, N'Kích cỡ', N'Size XL Rộng rãi'), (35, N'Đệm đầu', N'Ruột đệm mút hoạt tính, hít nam châm (Không dây)'), (35, N'Tải trọng tĩnh', N'Tối đa 180kg'), (35, N'Nhu cầu', N'Người đô con béo tròn ngồi cực sướng');

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

-- ======================================================
-- COUPONS
-- ======================================================
DELETE FROM Coupons;

-- Reset identity for Coupons
DBCC CHECKIDENT ('Coupons', RESEED, 0);

INSERT INTO Coupons (Code, Description, IsPercentage, DiscountValue, MaxDiscount, StartAt, ExpiryAt, IsActive) VALUES
(N'WELCOME10', N'10% off for new customers', 1, 10.00, NULL, SYSDATETIME(), DATEADD(month,3,SYSDATETIME()), 1),
(N'FLAT50000', N'Fixed 50,000 VND off orders over 1,000,000', 0, 50000.00, NULL, SYSDATETIME(), DATEADD(month,6,SYSDATETIME()), 1),
(N'SUMMER25MAX200000', N'25% off up to 200,000 VND', 1, 25.00, 200000.00, SYSDATETIME(), DATEADD(month,2,SYSDATETIME()), 1);