const redisClient = require('../src/config/redis.config');

redisClient.ping((err, response) => {
    if (err) {
        console.error('Error connecting to Redis:', err);
    } else {
        console.log('Redis response:', response); // Nên trả về 'PONG'
    }
});
