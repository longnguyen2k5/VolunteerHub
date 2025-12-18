-- ========================
-- 0. BẢNG USERS
-- ========================

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Khóa chính định danh người dùng duy nhất',
    full_name VARCHAR(255) NOT NULL COMMENT 'Họ và tên người dùng',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email đăng nhập, đảm bảo duy nhất trong hệ thống',
    password VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã được mã hóa (hashed) bằng thuật toán bảo mật',
    role ENUM('VOLUNTEER', 'EVENT_MANAGER', 'ADMIN') NOT NULL DEFAULT 'VOLUNTEER' COMMENT 'Vai trò người dùng trong hệ thống: Tình nguyện viên, Quản lý sự kiện hoặc Quản trị viên',
    is_locked BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Trạng thái tài khoản: FALSE = hoạt động, TRUE = bị khóa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo tài khoản',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất'
) COMMENT = 'Bảng lưu trữ thông tin người dùng cho cả 3 vai trò: tình nguyện viên, quản lý sự kiện và quản trị viên';


-- ========================
-- 1. BẢNG EVENTS
-- ========================
CREATE TABLE events (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL COMMENT 'Tên sự kiện',
                        description TEXT COMMENT 'Mô tả chi tiết về sự kiện',
                        location VARCHAR(255) NOT NULL COMMENT 'Địa điểm tổ chức',
                        start_time TIMESTAMP NOT NULL COMMENT 'Thời gian bắt đầu sự kiện',
                        end_time TIMESTAMP NOT NULL COMMENT 'Thời gian kết thúc sự kiện',
                        status ENUM('PENDING_APPROVAL', 'APPROVED', 'REJECTED')
                            NOT NULL DEFAULT 'PENDING_APPROVAL' COMMENT 'Trạng thái sự kiện',
                        category ENUM('EDUCATION', 'ENVIRONMENT', 'HEALTH', 'COMMUNITY', 'EMERGENCY_RELIEF', 'OTHER') DEFAULT 'OTHER' COMMENT 'Danh mục sự kiện',
                        max_participants INT DEFAULT 100 COMMENT 'Số lượng người tham gia tối đa',
                        manager_id BIGINT NOT NULL COMMENT 'ID của người quản lý sự kiện',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        CONSTRAINT fk_events_manager FOREIGN KEY (manager_id) REFERENCES users(id)
                            ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Lưu trữ thông tin về các sự kiện tình nguyện';

-- ========================
-- 2. BẢNG EVENT_REGISTRATIONS
-- ========================
CREATE TABLE event_registrations (
                                     id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     user_id BIGINT NOT NULL COMMENT 'ID của Tình nguyện viên đăng ký',
                                     event_id BIGINT NOT NULL COMMENT 'ID của sự kiện được đăng ký',
                                     status ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED')
                                         NOT NULL DEFAULT 'PENDING' COMMENT 'Trạng thái đăng ký',
                                     registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                     CONSTRAINT fk_event_reg_user FOREIGN KEY (user_id) REFERENCES users(id)
                                         ON DELETE CASCADE ON UPDATE CASCADE,
                                     CONSTRAINT fk_event_reg_event FOREIGN KEY (event_id) REFERENCES events(id)
                                         ON DELETE CASCADE ON UPDATE CASCADE,
                                     CONSTRAINT uq_event_reg UNIQUE (user_id, event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Lưu trữ thông tin đăng ký tham gia sự kiện';

-- ========================
-- 3. BẢNG POSTS
-- ========================
CREATE TABLE posts (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       content TEXT NOT NULL COMMENT 'Nội dung bài viết',
                       user_id BIGINT NOT NULL COMMENT 'ID của người đăng bài',
                       event_id BIGINT NOT NULL COMMENT 'ID của sự kiện mà bài viết thuộc về',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users(id)
                           ON DELETE CASCADE ON UPDATE CASCADE,
                       CONSTRAINT fk_posts_event FOREIGN KEY (event_id) REFERENCES events(id)
                           ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Lưu trữ các bài đăng trên kênh trao đổi của mỗi sự kiện';

-- ========================
-- 4. BẢNG COMMENTS
-- ========================
CREATE TABLE comments (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          content VARCHAR(1000) NOT NULL COMMENT 'Nội dung bình luận',
                          user_id BIGINT NOT NULL COMMENT 'ID của người bình luận',
                          post_id BIGINT NOT NULL COMMENT 'ID của bài viết được bình luận',
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id)
                              ON DELETE CASCADE ON UPDATE CASCADE,
                          CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts(id)
                              ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Lưu trữ các bình luận cho bài đăng';

-- ========================
-- 5. BẢNG LIKES
-- ========================
CREATE TABLE likes (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       user_id BIGINT NOT NULL COMMENT 'ID của người thích',
                       post_id BIGINT NOT NULL COMMENT 'ID của bài viết được thích',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES users(id)
                           ON DELETE CASCADE ON UPDATE CASCADE,
                       CONSTRAINT fk_likes_post FOREIGN KEY (post_id) REFERENCES posts(id)
                           ON DELETE CASCADE ON UPDATE CASCADE,
                       CONSTRAINT uq_likes UNIQUE (user_id, post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Lưu trữ lượt thích cho các bài đăng';


-- ========================
-- 6. BẢNG PUSH_SUBSCRIPTIONS (Web Push Notifications)
-- ========================
CREATE TABLE push_subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    endpoint VARCHAR(2048),
    p256dh VARCHAR(255),
    auth VARCHAR(255),
    CONSTRAINT fk_push_subscriptions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Lưu trữ thông tin đăng ký nhận thông báo đẩy (Web Push)';