# 📱 Ứng dụng Thương mại Điện tử - React Native

Một ứng dụng di động được xây dựng bằng React Native, mô phỏng một cửa hàng bán lẻ các thiết bị điện tử. Ứng dụng có đầy đủ các chức năng cho cả người dùng và quản trị viên, sử dụng SQLite làm cơ sở dữ liệu cục bộ để lưu trữ dữ liệu ngay trên thiết bị.

## 📸 Hình ảnh ứng dụng

*(Thêm ảnh chụp màn hình các tính năng chính của ứng dụng tại đây)*

| Màn hình chính | Danh sách sản phẩm | Chi tiết sản phẩm |
| :---: | :---: | :---: |
| (ảnh) | (ảnh) | (ảnh) |

| Giỏ hàng | Quản lý sản phẩm (Admin) | Quản lý đơn hàng (Admin) |
| :---: | :---: | :---: |
| (ảnh) | (ảnh) | (ảnh) |

## ✨ Tính năng chính

### Dành cho Người dùng (User)
- **Xác thực người dùng**: Đăng ký, Đăng nhập và quản lý thông tin cá nhân.
- **Duyệt sản phẩm**: Xem danh sách sản phẩm, lọc sản phẩm theo từng danh mục.
- **Tìm kiếm & Lọc**:
  - Tìm kiếm sản phẩm nhanh chóng theo tên hoặc danh mục.
  - Lọc sản phẩm theo khoảng giá tùy chỉnh.
- **Chi tiết sản phẩm**: Xem thông tin chi tiết, hình ảnh của sản phẩm.
- **Giỏ hàng**: Thêm sản phẩm vào giỏ, cập nhật số lượng, xóa sản phẩm khỏi giỏ.
- **Đặt hàng**: Thực hiện đặt hàng từ các sản phẩm trong giỏ.
- **Lịch sử mua hàng**: Xem lại các đơn hàng đã đặt và trạng thái của chúng.

### Dành cho Quản trị viên (Admin)
- **Giao diện quản lý**: Truy cập vào một tab quản lý riêng biệt, được bảo vệ.
- **Quản lý sản phẩm (CRUD)**:
  - Thêm sản phẩm mới với tên, giá, danh mục và hình ảnh.
  - Sửa thông tin các sản phẩm hiện có.
  - Xóa sản phẩm khỏi hệ thống.
- **Quản lý đơn hàng**:
  - Xem tất cả đơn hàng từ người dùng.
  - Cập nhật trạng thái đơn hàng (`Chờ xử lý`, `Đã xác nhận`, `Đang giao`, `Hoàn thành`, `Đã hủy`).

## 🛠️ Công nghệ sử dụng

- **Framework**: React Native
- **Ngôn ngữ**: TypeScript
- **Điều hướng (Navigation)**: React Navigation (Stack & Bottom Tabs)
- **Cơ sở dữ liệu**: SQLite (`react-native-sqlite-storage`)
- **Quản lý State**: React Hooks (`useState`, `useEffect`, `useCallback`, `useContext`)
- **UI Components**:
  - `@react-native-picker/picker`
  - `@ptomasroos/react-native-multi-slider`
- **Tương tác với thiết bị**: `react-native-image-picker`

## 📂 Cấu trúc thư mục

Dự án được tổ chức theo cấu trúc module hóa để dễ dàng bảo trì và phát triển.

```
/src
|-- /assets          # Chứa hình ảnh, fonts...
|-- /components      # Các component có thể tái sử dụng (ProductCard, LoadingSpiner...)
|-- /constants       # Các hằng số (màu sắc, kích thước font...)
|-- /database        # Logic khởi tạo và các hàm trợ giúp cho SQLite
|-- /navigation      # Cấu hình điều hướng (Stack, Tab)
|-- /screens         # Các màn hình của ứng dụng, chia theo vai trò
|   |-- /admin
|   `-- /user
|-- /types           # Định nghĩa các kiểu dữ liệu TypeScript (Product, Order...)
`-- /utils           # Các hàm tiện ích (format tiền tệ, xử lý ảnh...)
```

## 🚀 Hướng dẫn cài đặt

### 1. Yêu cầu
- Đảm bảo bạn đã cài đặt **Node.js** (phiên bản >= 20 theo `package.json`).
- Hoàn thành hướng dẫn cài đặt môi trường cho React Native tại **React Native Environment Setup**.

### 2. Clone Repository
```bash
git clone <your-repository-url>
cd reactnative-final-project
```

### 3. Cài đặt Dependencies
Sử dụng `npm` hoặc `yarn`:
```bash
npm install
# HOẶC
yarn install
```

### 4. Khởi chạy Metro Bundler
Mở một terminal và chạy lệnh sau từ thư mục gốc của dự án:
```bash
npm start
# HOẶC
yarn start
```

### 5. Chạy ứng dụng
Mở một terminal **mới** và chạy các lệnh tương ứng với hệ điều hành của bạn:

#### ▶️ Android
```bash
npm run android
# HOẶC
yarn android
```

#### ▶️ iOS
```bash
# Cài đặt pods trước (chỉ cần cho lần đầu hoặc sau khi cập nhật thư viện native)
cd ios && pod install && cd ..

# Chạy ứng dụng
npm run ios
# HOẶC
yarn ios
```

## 🗃️ Lưu ý về Cơ sở dữ liệu

- Ứng dụng sử dụng **SQLite** và tự động khởi tạo dữ liệu mẫu (sản phẩm, danh mục, người dùng) trong lần chạy đầu tiên. Logic này nằm trong file `src/database/database.ts`.
- **Để reset hoàn toàn cơ sở dữ liệu**:
  1. Mở file `src/database/database.ts`.
  2. Bỏ comment các dòng `DROP TABLE ...`.
  3. Chạy lại ứng dụng một lần.
  4. Sau khi ứng dụng đã chạy, **comment lại** các dòng đó để tránh việc xóa dữ liệu ở các lần khởi động sau.
 
  Copyright © 2025 Pham Duc Dat. All Rights Reserved.


