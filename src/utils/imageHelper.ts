import { ImageSourcePropType } from 'react-native';

// Ánh xạ tên file ảnh tới require tương ứng
const images: { [key: string]: ImageSourcePropType } = {
  'macbook_pro_m3.jpg': require('../assets/images/macbook_pro_m3.jpg'),
  'iphone_15_pro_max.jpg': require('../assets/images/iphone_15_pro_max.jpg'),
  'ipad_pro_12_9.jpg': require('../assets/images/ipad_pro_12_9.jpg'),
  'airpods_pro_2.jpg': require('../assets/images/airpods_pro_2.jpg'),
  'dell_xps_15.jpg': require('../assets/images/dell_xps_15.jpg'),
  'samsung_galaxy_s24_ultra.jpg': require('../assets/images/samsung_galaxy_s24_ultra.jpg'),
  'surface_pro_9.jpg': require('../assets/images/surface_pro_9.jpg'),
  'magic_mouse_3.jpg': require('../assets/images/magic_mouse_3.jpg'),
  // Thêm các ảnh khác ở đây
};

export const getProductImage = (
  imageIdentifier: string,
): ImageSourcePropType => {
  // Kiểm tra xem đây là URI (từ ảnh mới tạo) hay là tên file (từ dữ liệu mẫu)
  if (
    imageIdentifier.startsWith('file://') ||
    imageIdentifier.startsWith('http')
  ) {
    return { uri: imageIdentifier };
  }

  // Nếu là tên file, tìm trong danh sách ảnh đã require
  const imageSource = images[imageIdentifier];
  if (imageSource) {
    return imageSource;
  }

  // Trả về một ảnh mặc định nếu không tìm thấy
  return require('../assets/images/placeholder.jpg'); // Bạn cần tạo file placeholder.jpg
};
