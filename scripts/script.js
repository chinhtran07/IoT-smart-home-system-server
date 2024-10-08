import crypto from 'crypto';
// Tạo chuỗi bí mật ngẫu nhiên dài 32 bytes
const refreshSecret = crypto.randomBytes(64).toString('hex');

console.log('Refresh Secret:', refreshSecret);
