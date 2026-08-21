# TKW_2354050099_Phuc

## Bài thực hành Thiết kế Web

### Sản phẩm

**HPTime - SaaS chấm công thông minh**

HPTime là nền tảng SaaS hỗ trợ doanh nghiệp quản lý chấm công, thời gian làm việc, ca làm và thông tin nhân viên trên một hệ thống thống nhất.

---

# Buổi 1 - Design Token và giao diện cơ bản

## Design Token

| Vai trò | Giá trị | Token | Tailwind |
|---|---|---|---|
| Màu thương hiệu rất nhạt | #f5faff | --color-brand-50 | bg-brand-50 |
| Màu thương hiệu nhạt | #edf6fc | --color-brand-100 | bg-brand-100 |
| Màu thương hiệu phụ | #dcecf9 | --color-brand-200 | bg-brand-200 |
| Màu thương hiệu chính | #c4dff6 | --color-brand-600 | bg-brand-600 |
| Màu thương hiệu đậm | #8fc2e8 | --color-brand-700 | bg-brand-700 |
| Màu nhấn | #4f8fbd | --color-accent-500 | text-accent-500 |
| Chữ chính | #111827 | --color-ink | text-ink |
| Chữ phụ | #6b7280 | --color-muted | text-muted |
| Nền trang | #ffffff | --color-surface | bg-surface |
| Nền phụ | #f8fafc | --color-surface-soft | bg-surface-soft |
| Viền | #e5e7eb | --color-line | border-line |
| Phông tiêu đề | Inter | --font-display | font-display |
| Phông nội dung | Inter | --font-body | font-body |
| Bo góc thẻ | 0.5rem | --radius-card | rounded-card |

---

# Buổi 2 - Flexbox và Grid

Trang chủ được hoàn thiện bằng Flexbox và Grid.

Các khu vực chính gồm:

- Navbar
- Hero
- Customer Logos
- Features
- Statistics
- Testimonial
- Pricing
- FAQ
- Cách hoạt động
- CTA
- Footer

Layout sử dụng container thống nhất:

```html
mx-auto w-full max-w-6xl px-5