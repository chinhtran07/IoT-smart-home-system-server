require('dotenv').config();

module.exports = {
    mongo_url: process.env.MONGO_URI,
    port: process.env.PORT,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h'
    },
    mqtt: {
        port: 1883
    },
    wss: {
        port:8081
    }
}