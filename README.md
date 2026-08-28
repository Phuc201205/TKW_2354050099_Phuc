# TKW_2354050099_Phuc

## Thực hành Thiết kế Web

### Sinh viên thực hiện

**Họ tên:** Lê Hữu Phúc

**Sản phẩm:** HPTime - SaaS chấm công thông minh

---

# Giới thiệu

HPTime là nền tảng SaaS hỗ trợ doanh nghiệp quản lý chấm công, ca làm, thời gian làm việc và thông tin nhân viên trên một hệ thống thống nhất.

Website được xây dựng bằng:

- HTML5
- Tailwind CSS v4
- JavaScript ES Modules
- GitHub Pages

Không sử dụng thư viện JavaScript bên ngoài cho các tính năng tương tác.

---

# Cấu trúc project

```text
TKW_2354050099_Phuc/
│
├── index.html
├── pricing.html
├── contact.html
│
├── src/
│   └── input.css
│
├── dist/
│   └── output.css
│
├── js/
│   ├── main.js
│   ├── nav.js
│   ├── theme.js
│   ├── faq.js
│   ├── pricing.js
│   ├── slider.js
│   ├── reveal.js
│   └── extra.js
│
├── package.json
├── package-lock.json
└── README.md

---

## Buổi 4 - JavaScript DOM và tương tác

Các tính năng JavaScript đã hoàn thành:

- Menu mobile có `aria-expanded`, đóng bằng ESC và click ra ngoài.
- Navbar thay đổi trạng thái bằng `IntersectionObserver`.
- Accordion FAQ sử dụng Event Delegation.
- Dark Mode lưu lựa chọn bằng `localStorage` và mặc định theo `prefers-color-scheme`.
- Công tắc giá tháng/năm sử dụng `Intl.NumberFormat("vi-VN")`.
- Slider cảm nhận tự viết, có `inert` cho slide ẩn.
- Reveal Animation sử dụng `IntersectionObserver` và hỗ trợ `prefers-reduced-motion`.

### Tương tác tự chọn - Sao chép email hỗ trợ

Nút **Sao chép email** giúp người dùng lấy nhanh địa chỉ `support@hptime.vn` mà không cần chọn và sao chép thủ công.

Tương tác này giúp người dùng dễ dàng dán email hỗ trợ sang ứng dụng email hoặc công cụ làm việc khác, đặc biệt thuận tiện khi sử dụng trên điện thoại.

Sau khi sao chép, website sử dụng `role="status"` và `aria-live="polite"` để thông báo kết quả cho cả người dùng thông thường và người dùng trình đọc màn hình.