import mongoose from 'mongoose';
import createTopicModel from './topic.js';
import createAccessControlModel from './accessControl.js';
import createSensorDataModel from './sensorData.js';
import createLogModel from './log.js';

const db = {};
db.Topic = createTopicModel(mongoose);
db.AccessControl = createAccessControlModel(mongoose);
db.SensorData = createSensorDataModel(mongoose);
db.Log = createLogModel(mongoose);

export default db;
