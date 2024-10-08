import { Sequelize, DataTypes } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { readFile } from 'fs/promises';
import { fileURLToPath, pathToFileURL } from 'url';

// Convert import.meta.url to a valid file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read config file (using valid URL scheme)
const config = JSON.parse(await readFile(new URL('../../config/config.json', import.meta.url)));
const env = process.env.NODE_ENV || 'development';
const configEnv = config[env];
const basename = path.basename(__filename);

// Initialize Sequelize
const sequelize = new Sequelize(configEnv.database, configEnv.username, configEnv.password, {
  host: configEnv.host,
  dialect: configEnv.dialect,
});

const db = {};

// Use the current directory for modelsPath
const modelsPath = __dirname;  // No need to append 'mysql' again

// Read and filter model files
const modelFiles = fs.readdirSync(modelsPath)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  });

// Import each model dynamically
for (const file of modelFiles) {
  const modelPath = path.join(modelsPath, file);
  const model = await import(pathToFileURL(modelPath).href);  // Convert path to valid URL
  const modelInstance = model.default(sequelize, DataTypes);
  db[modelInstance.name] = modelInstance;
}

// Run associations if defined
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;
