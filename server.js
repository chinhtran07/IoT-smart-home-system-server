require('dotenv').config();

const config = require('./src/config');

const app = require('./src/app');

const server = app.listen(config.port, () => {
    console.log(`Server start with http://localhost:${config.PORT}`);
})

process.on('SIGINT', () => {
    server.close( () => console.log(`exits server express`))
})