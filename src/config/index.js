require('dotenv').config('../.env');

module.exports = {
    mongo_url: process.env.MONGO_URL,
    port: process.env.PORT,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h'
    }
}