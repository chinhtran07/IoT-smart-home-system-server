const mongoose = require('mongoose');

const db = {};
db.Topic = require('./topic')(mongoose);
db.AccessControl = require('./accessControl')(mongoose);
db.SensorData = require('./sensorData')(mongoose);
db.Log = require('./log')(mongoose);

module.exports = db;
