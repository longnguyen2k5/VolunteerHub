-- ==========================================
-- V3: EXTENSIVE MOCK DATA (Users, Events, Registrations)
-- ==========================================

-- 1. INSERT USERS (Password: 'password')
INSERT IGNORE INTO users (full_name, email, password, role, is_locked, created_at) VALUES
-- ADMIN
('System Admin', 'admin@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'ADMIN', FALSE, NOW()),

-- EVENT MANAGERS (5 Accounts)
('Cristiano Ronaldo', 'ronaldo@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'EVENT_MANAGER', FALSE, NOW()),
('Lionel Messi', 'messi@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'EVENT_MANAGER', FALSE, NOW()),
('Phạm Nhật Vượng', 'vuong@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'EVENT_MANAGER', FALSE, NOW()),
('Phạm Thị Lan', 'manager4@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'EVENT_MANAGER', FALSE, NOW()),
('Đặng Văn Lâm', 'manager5@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'EVENT_MANAGER', FALSE, NOW()),

-- VOLUNTEERS (20 Accounts)
('Hugo Ekitike', 'ekitike@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Nguyễn Phương Thảo', 'user2@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Đỗ Hùng Dũng', 'user3@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Hoàng Thùy Linh', 'user4@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Vũ Đức Đam', 'user5@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Lương Thùy Linh', 'user6@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Bùi Tiến Dũng', 'user7@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Nguyễn Xuân Son', 'user8@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Sơn Tùng MTP', 'user9@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Mỹ Tâm', 'user10@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Trấn Thành', 'user11@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Trường Giang', 'user12@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Ninh Dương Lan Ngọc', 'user13@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Ngô Thanh Vân', 'user14@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Lý Nhã Kỳ', 'user15@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Quyền Linh', 'user16@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Đại Nghĩa', 'user17@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Việt Hương', 'user18@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Thủy Tiên', 'user19@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', FALSE, NOW()),
('Khóa Tài Khoản', 'locked@gmail.com', '$2a$10$n1rAHYRU2XgbO2rX4o8.leuae/Auqva8bYKVs6pr/B57TXY0hYP.2', 'VOLUNTEER', TRUE, NOW());

-- 2. INSERT EVENTS (Rich variety)
INSERT IGNORE INTO events (name, description, location, start_time, end_time, status, category, max_participants, manager_id, created_at) VALUES

-- HEALTH
('Hiến máu: Giọt hồng Đất Việt', 'Hiến máu nhân đạo đợt 1 năm 2025.', 'Viện Huyết học TW', DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 26 HOUR), 'APPROVED', 'HEALTH', 200, 2, NOW()),
('Tư vấn sức khỏe cộng đồng', 'Đội ngũ bác sĩ BV Bạch Mai tư vấn miễn phí.', 'Công viên Thống Nhất', DATE_ADD(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 125 HOUR), 'APPROVED', 'HEALTH', 100, 2, NOW()),
('Chạy bộ gây quỹ: Beat Cancer', 'Giải chạy marathon gây quỹ hỗ trợ bệnh nhân ung thư.', 'Hồ Hoàn Kiếm', DATE_ADD(NOW(), INTERVAL 20 DAY), DATE_ADD(NOW(), INTERVAL 484 HOUR), 'PENDING_APPROVAL', 'HEALTH', 1000, 2, NOW()),

-- ENVIRONMENT
('Làm sạch Hồ Tây', 'Chiến dịch thu gom rác thải quanh hồ.', 'Hồ Tây, Hà Nội', DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 28 HOUR), 'PENDING_APPROVAL', 'ENVIRONMENT', 50, 2, NOW()),
('Trồng rừng ngập mặn', 'Dự án trồng 5000 cây đước tại Nam Định.', 'Giao Thủy, Nam Định', DATE_ADD(NOW(), INTERVAL 14 DAY), DATE_ADD(NOW(), INTERVAL 350 HOUR), 'PENDING_APPROVAL', 'ENVIRONMENT', 150, 2, NOW()),
('Workshop: Sống Xanh', 'Hướng dẫn tái chế rác thải nhựa thành đồ dùng.', 'ĐH Bách Khoa', DATE_ADD(NOW(), INTERVAL 4 DAY), DATE_ADD(NOW(), INTERVAL 100 HOUR), 'PENDING_APPROVAL', 'ENVIRONMENT', 30, 2, NOW()),
('Hưởng ứng Giờ Trái Đất', 'Sự kiện tắt đèn và biểu diễn nghệ thuật đường phố.', 'Quảng trường Cách mạng Tháng 8', DATE_ADD(NOW(), INTERVAL 30 DAY), DATE_ADD(NOW(), INTERVAL 724 HOUR), 'PENDING_APPROVAL', 'ENVIRONMENT', 500, 2, NOW()),

-- EDUCATION
('Gia sư tình nguyện: Mùa thi', 'Ôn thi tốt nghiệp THPT cho học sinh nghèo.', 'Trung tâm GDTX Cầu Giấy', DATE_ADD(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 170 HOUR), 'PENDING_APPROVAL', 'EDUCATION', 40, 3, NOW()),
('Quyên góp sách giáo khoa', 'Thu gom sách cũ cho trẻ em vùng cao.', 'Thư viện Quốc gia', DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 76 HOUR), 'PENDING_APPROVAL', 'EDUCATION', 20, 3, NOW()),
('Dạy Tiếng Anh cho trẻ em SOS', 'Lớp học cuối tuần tại làng trẻ SOS.', 'Làng trẻ em SOS Hà Nội', DATE_ADD(NOW(), INTERVAL 8 DAY), DATE_ADD(NOW(), INTERVAL 200 HOUR), 'PENDING_APPROVAL', 'EDUCATION', 15, 3, NOW()),
('Hội thảo: Du học 0 đồng', 'Chia sẻ kinh nghiệm săn học bổng.', 'Khách sạn Melia', DATE_ADD(NOW(), INTERVAL 12 DAY), DATE_ADD(NOW(), INTERVAL 290 HOUR), 'REJECTED', 'EDUCATION', 200, 3, NOW()), -- Rejected event

-- COMMUNITY
('Bếp ăn 0 đồng', 'Phát cơm miễn phí cho người vô gia cư.', 'Ga Hà Nội', DATE_ADD(NOW(), INTERVAL -2 DAY), DATE_ADD(NOW(), INTERVAL -40 HOUR), 'PENDING_APPROVAL', 'COMMUNITY', 20, 3, NOW()), -- Past event
('Trung thu cho em', 'Tổ chức phá cỗ trung thu cho trẻ em đường phố.', 'Công viên Thủ Lệ', DATE_ADD(NOW(), INTERVAL 45 DAY), DATE_ADD(NOW(), INTERVAL 1084 HOUR), 'PENDING_APPROVAL', 'COMMUNITY', 50, 3, NOW()),
('Sửa nhà tình nghĩa', 'Hỗ trợ sửa chữa nhà dột nát cho mẹ Việt Nam anh hùng.', 'Huyện Sóc Sơn', DATE_ADD(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 250 HOUR), 'APPROVED', 'COMMUNITY', 25, 3, NOW()),

-- EMERGENCY_RELIEF
('Cứu trợ lũ lụt Miền Trung', 'Vận chuyển nhu yếu phẩm đợt 1.', 'Quảng Bình', DATE_ADD(NOW(), INTERVAL 12 HOUR), DATE_ADD(NOW(), INTERVAL 60 HOUR), 'PENDING_APPROVAL', 'EMERGENCY_RELIEF', 50, 2, NOW()),
('Hiến tiểu cầu khẩn cấp', 'Cần nhóm máu O lóc tách tiểu cầu gấp.', 'Viện Huyết học TW', DATE_ADD(NOW(), INTERVAL 2 HOUR), DATE_ADD(NOW(), INTERVAL 12 HOUR), 'PENDING_APPROVAL', 'EMERGENCY_RELIEF', 10, 2, NOW());

-- 3. INSERT REGISTRATIONS
INSERT IGNORE INTO event_registrations (user_id, event_id, status, registered_at) VALUES
-- Event 1: Hiến máu (High interest)
(7, 1, 'PENDING', NOW()), (8, 1, 'PENDING', NOW()), (9, 1, 'APPROVED', NOW()), (10, 1, 'APPROVED', NOW()),
(11, 1, 'PENDING', NOW()), (12, 1, 'PENDING', NOW()), (13, 1, 'CANCELLED', NOW()), (14, 1, 'APPROVED', NOW()),
(15, 1, 'PENDING', NOW()), (16, 1, 'PENDING', NOW()), (17, 1, 'PENDING', NOW()), (18, 1, 'PENDING', NOW()),

-- Event 4: Làm sạch Hồ Tây
(17, 4, 'APPROVED', NOW()), (18, 4, 'APPROVED', NOW()), (19, 4, 'APPROVED', NOW()), (20, 4, 'APPROVED', NOW()),
(21, 4, 'COMPLETED', NOW()), -- Completed early? Or just marked status manually

-- Event 8: Gia sư tình nguyện
(7, 8, 'APPROVED', NOW()), (8, 8, 'PENDING', NOW()), (9, 8, 'APPROVED', NOW()),

-- Event 12: Bếp ăn 0 đồng (Past event, should be COMPLETED)
(10, 12, 'COMPLETED', DATE_ADD(NOW(), INTERVAL -1 DAY)), 
(11, 12, 'COMPLETED', DATE_ADD(NOW(), INTERVAL -1 DAY)),
(12, 12, 'COMPLETED', DATE_ADD(NOW(), INTERVAL -1 DAY)),
(13, 12, 'COMPLETED', DATE_ADD(NOW(), INTERVAL -1 DAY)),
(14, 12, 'COMPLETED', DATE_ADD(NOW(), INTERVAL -1 DAY)),

-- Event 15: Cứu trợ (Urgent)
(13, 15, 'APPROVED', NOW()), (14, 15, 'APPROVED', NOW()), (15, 15, 'APPROVED', NOW()), (16, 15, 'APPROVED', NOW()), (17, 15, 'APPROVED', NOW()),
(18, 15, 'PENDING', NOW()), (19, 15, 'PENDING', NOW());
