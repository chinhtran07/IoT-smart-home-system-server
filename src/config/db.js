const mongoose = require('mongoose');
const config = require('.');

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongo_url);
        console.log('Connected to MongoDB');
      } catch (err) {
        console.error('Could not connect to MongoDB', err);
        process.exit(1); 
      }
};

module.exports = connectDB;