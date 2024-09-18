const redis = require('redis');
const client = redis.createClient({
  url: 'redis://localhost:6379'  // Adjust the URL if necessary
});

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect().then(() => {
  client.set('testkey', 'Hello Redis!', (err, reply) => {
    if (err) console.error(err);
    else console.log(reply); // Should print 'OK'
    
    client.get('testkey', (err, reply) => {
      if (err) console.error(err);
      else console.log(reply); // Should print 'Hello Redis!'
      
      client.quit();
    });
  });
});
