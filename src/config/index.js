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

    session: {
        secret: process.env.SESSION_SECRET
    },

    cookie: {
        secret: process.env.COOKIE_SECRET
    },

    google: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET
    },
    cloudinary: {
        name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    },
    mqtt: {
        port: process.env.MQTT_PORT,
    },
    wss: {
        port: process.env.WSS_PORT,
    },
    redis: {
        url: process.env.REDIS_URL
    }
};

export default config;
