# Goethe AI-Prep

Ứng dụng React/Vite hỗ trợ luyện Lesen, Hören, Schreiben, Sprechen, ngữ pháp và từ vựng chuyên ngành B1/B2.

## Chạy giao diện

```bash
npm install
npm run dev
```

## Cấu hình AI an toàn

Frontend gọi endpoint cùng origin `/api/ai`. Endpoint serverless nằm tại `api/ai.js` và đọc khóa từ biến môi trường; khóa không được đặt trong `src` hoặc biến `VITE_*`.

1. Sao chép `.env.example` thành cấu hình môi trường của nền tảng triển khai.
2. Tạo **khóa API mới** và đặt vào `AI_API_KEY`.
3. Thu hồi khóa cũ từng xuất hiện trong mã nguồn.
4. Triển khai bằng nền tảng hỗ trợ Node serverless functions (ví dụ Vercel), hoặc trỏ `VITE_AI_PROXY_URL` tới backend tương đương.

Lệnh `vite` đơn lẻ chỉ chạy frontend; các chức năng AI cần proxy server hoạt động.

## Kiểm tra

```bash
npm test
npm run lint
npm run build
```

## Giới hạn cần biết

- Chấm viết và đánh giá transcript bằng AI chỉ mang tính tham khảo, không thay thế giám khảo Goethe.
- Ứng dụng không chấm phát âm vì hiện chưa gửi hoặc phân tích âm thanh.
- Hören dùng giọng đọc tổng hợp của thiết bị, không phải audio kỳ thi thật.
- Tiến độ được lưu trong localStorage của trình duyệt và chưa đồng bộ tài khoản.