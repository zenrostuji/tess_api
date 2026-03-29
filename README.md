# WebTruyện - Frontend (Vite + React)

Dự án frontend website đọc truyện tranh online được xây dựng bằng Vite và React JS. 

## Tính Năng Chính
- Hiển thị danh sách truyện mới cập nhật, truyện theo dõi (có phân trang)
- Hệ thống tìm kiếm truyện nhanh gọn, có gợi ý (suggestions)
- Lọc danh sách truyện theo Thể Loại
- Xem chi tiết truyện, đọc chapters, bình luận.
- **Hệ Thống Phân Quyền/Auth**: Đăng nhập, Đăng ký.
- **Trang Cá Nhân (Profile)**: 
  - Xem thông tin tài khoản, thống kê số truyện theo dõi, bình luận, trạng thái.
  - Cập nhật Avatar: Bạn có thể thay đổi avatar cá nhân dễ dàng ngay tại trang Profile bằng cách click trực tiếp vào ảnh đại diện. Giao diện thay ảnh (có hiệu ứng hover) sẽ hiện ra để bạn upload ảnh mới.

## Các Bản Vá Gần Nhất
- Đã khắc phục triệt để lỗi **click vào truyện từ danh sách nhưng không xem được nội dung chi tiết truyện**. Cập nhật logic để nhận dạng chính xác khóa chính của truyện (`comicId`, `id`, `_id`) từ nhiều API endpoint trả về khác nhau (như API Search, API Genre, API Homepage).
- Hoàn thiện thêm trang **ProfilePage.jsx**, bổ sung chức năng cho phép upload và thay đổi ảnh avatar. Khi hover vào avatar, icon máy ảnh sẽ hiện lên để thao tác sửa.

## Cấu Trúc Thư Mục Cốt Lõi
```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Setup định tuyến (React Router)
│   ├── contexts/
│   │   └── AuthContext.jsx   # Xử lý State của Session (User, Token, Theo dõi)
│   ├── utils/
│   │   └── api.js            # Các hàm wrapper gọi RESTful APIs và Helpers
│   ├── components/           # Components dùng chung 
│   │   ├── ComicCard.jsx     # Card hiển thị cho 1 truyện
│   │   ├── AuthModal.jsx     # Giao diện Đăng nhập/Đăng ký dạng Modal popup
│   │   ├── Header.jsx        # Thanh navigation & search bar dropdown
│   │   └── ...
│   ├── pages/
│   │   ├── HomePage.jsx      # Điểm chạm đầu tiên: Hero banner và thư viện truyện
│   │   ├── SearchPage.jsx    # Danh sách các truyện tìm kiếm được
│   │   ├── GenrePage.jsx     # Lọc nội dung truyện theo thể loại
│   │   ├── ComicDetailPage.jsx # Màn hình chi tiết, listing chapters và comments
│   │   ├── ReadingPage.jsx   # Màn hình không gian đọc truyện đen tối ưu mắt
│   │   ├── FollowsPage.jsx   # Tủ sách (Truyện đang theo dõi)
│   │   └── ProfilePage.jsx   # Thông tin account, đổi user settings (Avatar)
│   └── styles/
│       └── index.css         # Hệ thống Design System (Variables, components UI)
```

## Chạy Ứng Dụng Chế Độ Nhà Phát Triển

Yêu cầu hệ thống: Cài đặt Node.js version tối thiểu >= 18.x

1. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

2. **Khởi động server Dev:**
   ```bash
   npm run dev
   ```

3. Mở ứng dụng trong trình duyệt:
   Server Vite mặc định sẽ expose port `5173`. Truy cập [http://localhost:5173/](http://localhost:5173/).

## Lưu Ý Về Kết Nối
Backend API Base path đang được quản lý tĩnh và trực tiếp tại file `src/utils/api.js` biến môi trường `API_BASE`, và mặc định đang sử dụng ngrok proxy forwarding tunnel. Nếu ngrok session hết hạn, bạn hãy chủ động thay thế `API_BASE` thành endpoint URL mới có hiệu lực.
