const EventEmitter = require('events');
const emmitter = new EventEmitter();

emmitter.setMaxListeners(20);

module.exports = emmitter;
