import { Sequelize, DataTypes } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { readFile } from 'fs/promises';

const config = JSON.parse(await readFile(new URL('../../config/config.json', import.meta.url)));
const env = process.env.NODE_ENV || 'development';
const configEnv = config[env];
const basename = path.basename(new URL(import.meta.url).pathname);


const sequelize = new Sequelize(configEnv.database, configEnv.username, configEnv.password, {
  host: configEnv.host,
  dialect: configEnv.dialect,
});

const db = {};

const modelsPath = path.dirname(new URL(import.meta.url).pathname);


const modelFiles = fs.readdirSync(modelsPath)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  });

for (const file of modelFiles) {
  const model = await import(path.join(modelsPath, file));
  const modelInstance = model.default(sequelize, DataTypes);
  db[modelInstance.name] = modelInstance;
}



Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;
