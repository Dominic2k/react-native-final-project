export const formatCurrency = (amount: number | string | undefined | null): string => {
    // 1. Kiểm tra nếu không có giá trị thì trả về 0 đ
    if (amount === undefined || amount === null || amount === '') {
        return '0 ₫';
    }

    // 2. Chuyển đổi sang số (đề phòng trường hợp truyền vào là string "100000")
    const numberAmount = Number(amount);

    // 3. Kiểm tra nếu không phải là số hợp lệ
    if (isNaN(numberAmount)) {
        return '0 ₫';
    }

    // 4. Sử dụng Intl.NumberFormat để format chuẩn tiếng Việt
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(numberAmount);
};