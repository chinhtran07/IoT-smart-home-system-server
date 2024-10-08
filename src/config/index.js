import dotenv from 'dotenv';

dotenv.config();

const config = {
    mongo_url: process.env.MONGO_URI,
    port: process.env.PORT,
    jwt: {
        secret: process.env.JWT_SECRET,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '1h',
    },
    mqtt: {
        port: 1883,
    },
    wss: {
        port: 8081,
    },
};

export default config;
