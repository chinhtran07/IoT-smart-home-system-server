const { Sequelize, DataTypes } = require('sequelize');
const config = require('../../config/config.json');
const env = process.env.NODE_ENV || 'development';
const configEnv = config[env];
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);


const sequelize = new Sequelize(configEnv.database, configEnv.username, configEnv.password, {
  host: configEnv.host,
  dialect: configEnv.dialect,
});

const db = {};

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.User = require('./user')(sequelize, DataTypes);
// db.Gateway = require('./gateway')(sequelize, DataTypes);
// db.Device = require('./device')(sequelize, DataTypes);
// db.Group = require('./group')(sequelize, DataTypes);
// db.DeviceGroup = require('./deviceGroup')(sequelize, DataTypes);
// db.Action = require('./action')(sequelize, DataTypes);
// db.Scenario = require('./scenario')(sequelize, DataTypes);
// db.Trigger = require('./trigger')(sequelize, DataTypes);
// db.TimeTrigger = require('./timeTrigger')(sequelize, DataTypes);
// db.DeviceTrigger = require('./deviceTrigger')(sequelize, DataTypes);
// db.Condition = require('./condition')(sequelize, DataTypes);
// db.Actuator = require('./actuator')(sequelize, DataTypes);
// db.Sensor = require('./sensor')(sequelize, DataTypes);
// db.Schedule = require('./schedule')(sequelize, DataTypes);



module.exports = db;
