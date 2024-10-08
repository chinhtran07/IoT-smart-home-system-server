import redis from 'redis';

const client = redis.createClient({
    url: "redis://localhost:6379"         
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