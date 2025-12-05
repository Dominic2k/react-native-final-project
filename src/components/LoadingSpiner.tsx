import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Modal } from 'react-native';

const LoadingSpiner = ({ visible, text = "Đang xử lý..." }: { visible: boolean, text?: string }) => {
  return (
    <Modal
      transparent={true} // Để nhìn xuyên thấu xuống dưới
      animationType="fade" // Hiệu ứng hiện ra mờ dần
      visible={visible} // Ẩn/Hiện dựa vào props này
      statusBarTranslucent={true} // Ph
      // ủ lên cả thanh pin/sóng
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu đen mờ 50%
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5, // Đổ bóng cho đẹp trên Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 150,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  }
});

export default LoadingSpiner;