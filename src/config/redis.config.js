import redis from 'redis';
import config from './index.js';

const client = redis.createClient({
    url: config.redis.url         
});

(async () => {
    try {
        await client.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error("Redis connection error", error);
    }
})();

client.on('error', (err) => {
    console.error('Redis error:', err);
});

export default client;