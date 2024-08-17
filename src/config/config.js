require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '123456',
    database: process.env.MYSQL_DB_NAME || 'smarthomedb'
  },
  jwtSecret: process.env.JWT_SECRET || '5a3018dd3f75ade7fbc2f5665afefb669b2e5376f58904e3856fbb9dd07137bd03f41b1aaa2b8f631034e9e8988bc308a6ff9d4b6d7a3d824bc727d99d2ce9f4',
//   mailer: {
//     service: process.env.MAIL_SERVICE,
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS
//   }
};
