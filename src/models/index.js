const {Sequelize, DataTypes} = require('sequelize');
const fs = require('fs');
const path = require('path');

const config = require('../config/database.json')['development'];

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false,
});

const db = {};

fs.readdirSync(__dirname)
    .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, DataTypes);
        db[model.name] = model;
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;