# VolunteerHub - Nền Tảng Kết Nối Tình Nguyện Viên

<p align="center">
  <img src="logo.png" alt="VolunteerHub Logo" width="120">
</p>

**VolunteerHub** là một nền tảng web toàn diện giúp kết nối các tổ chức tình nguyện với cộng đồng những người mong muốn đóng góp sức lực cho xã hội. Ứng dụng cung cấp giải pháp trọn gói từ việc quản lý sự kiện, tuyển tình nguyện viên, đến việc tạo môi trường tương tác xã hội cho các thành viên.

### � Logo & Nhận Diện Thương Hiệu
Logo của VolunteerHub được thiết kế với hình ảnh **các bàn tay đan xen vào nhau**, tượng trưng cho tinh thần **đoàn kết, hợp tác và sẻ chia** – những giá trị cốt lõi của hoạt động tình nguyện. Màu sắc chủ đạo là gam màu cam – hồng ấm áp, thể hiện sự nhiệt huyết và năng lượng tích cực của cộng đồng tình nguyện viên.

## �🌟 Tính Năng Chính

### 1. Tình nguyện viên (Volunteer)
*   **Đăng ký/Đăng nhập:** Tạo tài khoản, đăng nhập an toàn bằng email/password.
*   **Khám phá sự kiện:** Xem danh sách sự kiện chi tiết (tên, thời gian, địa điểm, mô tả). Lọc sự kiện theo thời gian và danh mục yêu thích.
*   **Đăng ký tham gia:** Gửi yêu cầu tham gia sự kiện và nhận thông báo xác nhận từ quản lý.
*   **Thoái đăng sự kiện:** Hủy đăng ký linh hoạt trước khi sự kiện diễn ra.
*   **Lịch sử hoạt động:** Theo dõi danh sách các sự kiện đã tham gia và trạng thái hoàn thành.
*   **Kênh trao đổi:** Thảo luận, đăng bài, bình luận và thả tim (like) trên trang sự kiện (tương tự mạng xã hội) để giao lưu với các thành viên khác.
*   **Thông báo thông minh:** Nhận thông báo đẩy (Web Push API) ngay lập tức về trạng thái đăng ký và các cập nhật mới.
*   **Dashboard cá nhân:** Xem tổng hợp sự kiện mới, sắp diễn ra và các hoạt động cá nhân.

### 2. Quản lý sự kiện (Event Manager)
*   **Đăng ký/Đăng nhập:** Tạo tài khoản, đăng nhập an toàn bằng email/password.
*   **Quản lý sự kiện:** Tạo mới, chỉnh sửa và quản lý thông tin sự kiện. Hệ thống hỗ trợ validate dữ liệu đầu vào chặt chẽ.
*   **Quản lý đăng ký:** Duyệt hoặc từ chối yêu cầu tham gia của tình nguyện viên.
*   **Đánh dấu hoàn thành:** Xác nhận tình nguyện viên đã hoàn thành nhiệm vụ sau khi sự kiện kết thúc.
*   **Báo cáo & Thống kê:** Xem danh sách chi tiết tình nguyện viên tham gia.
*   **Kênh trao đổi:** Tương tác, giải đáp thắc mắc và thông báo trên kênh thảo luận của sự kiện.
*   **Dashboard quản lý:** Theo dõi thống kê tổng quan về các sự kiện đang quản lý.

### 3. Quản trị viên (Admin)
*   **Đăng ký/Đăng nhập:** Đăng nhập bằng email/password, muốn tạo tài khoản admin thì phải đăng nhập vào tài khoản admin rồi mới tạo được tài khoản admin mới.
*   **Quản lý sự kiện:** Kiểm duyệt (Duyệt/Xóa) các sự kiện do Quản lý sự kiện gửi lên.
*   **Quản lý người dùng:** Xem danh sách người dùng, thực hiện Khóa/Mở khóa tài khoản khi cần thiết.
*   **Xuất dữ liệu:** Hỗ trợ xuất danh sách sự kiện và tình nguyện viên ra file CSV để báo cáo.
*   **Dashboard hệ thống:** Xem thống kê toàn bộ hệ thống (Số lượng user, sự kiện, lượt đăng ký) và các sự kiện nổi bật.

### Với mỗi sự kiện sau khi được duyệt, hệ thống sẽ tự động mở một kênh trao đổi riêng cho sự kiện để các thành viên post bài và trao đổi về sự kiện đó.
---

## 🛠️ Công Nghệ Sử Dụng

### Backend
*   **Ngôn ngữ:** Java 21
*   **Framework:** Spring Boot 3.3.4
*   **Bảo mật:** Spring Security, OAuth2 Resource Server, JWT (JSON Web Token).
*   **Database:** MySQL 8.0 (Quản lý migration bằng Flyway).
*   **Thông báo:** Web Push API (VAPID).

### Frontend
*   **Library:** React 18, Vite.
*   **UI Framework:** Material UI (MUI) v5.
*   **Quản lý State:** React Context API.
*   **Styling:** Emotion, CSS Modules.
*   **HTTP Client:** Axios.

---

## 🚀 Cài Đặt và Chạy Ứng Dụng

### Yêu cầu hệ thống
*   Java JDK 21
*   Node.js (v18 trở lên)
*   MySQL 8.0
*   Maven

### 1. Cấu hình Database
Tạo database MySQL tên là `volunteer_hub`:
```sql
CREATE DATABASE volunteer_hub;
```

### 2. Cài đặt Backend
Di chuyển vào thư mục backend:
```bash
cd backend
```

**Cấu hình Biến môi trường (BẮT BUỘC):**
Để tính năng thông báo hoạt động, bạn cần tạo cặp khóa VAPID và cấu hình vào biến môi trường (Environment Variables) trong IDE hoặc file hệ thống:

*   `VAPID_PUBLIC_KEY`: <Key public của bạn>
*   `VAPID_PRIVATE_KEY`: <Key private của bạn>

*(Bạn có thể sinh khóa bằng lệnh `npx web-push generate-vapid-keys`)*

Chạy ứng dụng:
```bash
mvn spring-boot:run
```
Backend sẽ khởi chạy tại: `http://localhost:8386`

### 3. Cài đặt Frontend
Di chuyển vào thư mục frontend:
```bash
cd frontend
```

Cài đặt các thư viện:
```bash
npm install
npm install yup react-hook-form @hookform/resolvers
```

Chạy server phát triển:
```bash
npm run dev
```
Frontend sẽ khởi chạy tại: `http://localhost:3000`

---

## 👤 Tài Khoản Mặc Định (Mock Data)

Hệ thống đã có sẵn dữ liệu mẫu trong `V3__Insert_Mock_Data.sql`.

*   **Admin:**
    *   Email: `admin@gmail.com`
    *   Password: `111111`

*   **Event Manager:**
    *   Email: `ronaldo@gmail.com` (Cristiano Ronaldo)
    *   Password: `111111`

*   **Volunteer:**
    *   Email: `ekitike@gmail.com` (Hugo Ekitike)
    *   Password: `111111`

---

## 👥 Thành Viên Nhóm

| STT | Họ và Tên | Mã Sinh Viên | Vai Trò |
|:---:|:---|:---|:---|
| 1 | Nguyễn Thành Long | 23020104 | Xác thực, Quản lý User (33.3%) |
| 2 | Bùi Đức Nhật | 23020128 | Quản lý Sự kiện & Đăng ký (33.3%) |
| 3 | Nguyễn Ngọc Phát | 23020131 | Mạng xã hội & Frontend UI (33.3%) |

---

## 📄 License
Dự án được thực hiện cho môn học Phát triển Ứng dụng Web - INT3306.

---

## 📋 Tiêu Chí Chấm Điểm & Kết Quả Thực Hiện

| STT | Tiêu chí | Hệ số | Trạng thái | Chi tiết thực hiện (Evidence) |
|:---:|:---|:---:|:---:|:---|
| 1 | **Chức năng và các features** | 0.35 | ✅ Đã làm | Đầy đủ 3 role (Volunteer, Manager, Admin). <br> • **Volunteer:** Đăng ký, thoái đăng, xem lịch sử, kênh trao đổi, thông báo. <br> • **Manager:** CRUD sự kiện, duyệt đăng ký, xuất CSV. <br> • **Admin:** Quản lý User, duyệt sự kiện. |
| 2 | **Thiết kế: Logic, dễ sử dụng** | 0.1 | ✅ Đã làm | Luồng nghiệp vụ chặt chẽ: Sự kiện PENDING -> Duyệt -> Public -> Đăng ký -> Duyệt tham gia. Giao diện thân thiện, UX tối ưu. |
| 3 | **Giao diện: Responsive, đẹp, hiện đại** | 0.2 | ✅ Đã làm | • Sử dụng **Material UI v5** với thiết kế hiện đại (Gradient, Glassmorphism). <br> • **Responsive 100%**: Mobile (Drawer Menu), Tablet, Desktop. <br> • Theme đồng bộ, font chữ Be Vietnam Pro. |
| 4 | **Hiệu năng (AJAX/Fetch)** | 0.1 | ✅ Đã làm | • **Single Page Application (SPA)** với ReactJS & Vite. <br> • Sử dụng **Axios** gọi API, dữ liệu JSON. <br> • Cập nhật DOM ảo, không reload trang. |
| 5 | **Phong cách lập trình** | 0.05 | ✅ Đã làm | • **Backend:** Mô hình Layered (Controller - Service - Repository). DTO pattern. <br> • **Frontend:** Component-based, Custom Hooks, Context API. <br> • Code sạch, comment đầy đủ. |
| 6 | **Xử lý nhập liệu** | 0.05 | ✅ Đã làm | • **Frontend:** Validation realtime với **Yup** và **React Hook Form**. <br> • **Backend:** Validation với Hibernate Validator (`@NotNull`, `@Size`, `@Future`). |
| 7 | **An ninh** | 0.05 | ✅ Đã làm | • **Spring Security 6** & **OAuth2 Resource Server**. <br> • **JWT** cho xác thực & phân quyền. <br> • **PKCE** flow chống tấn công đánh cắp mã. <br> • Mã hóa mật khẩu BCrypt. |
| 8 | **Định tuyến URL** | 0.05 | ✅ Đã làm | Sử dụng **React Router v6**. Định tuyến động (`/events/:id`), Private Route, Role-based Guard. |

| 9 | **Thao tác CSDL (ORM)** | 0.05 | ✅ Đã làm | Sử dụng **Spring Data JPA (Hibernate)**. Độc lập hệ quản trị CSDL (có thể chuyển đổi MySQL/PostgreSQL dễ dàng). |
