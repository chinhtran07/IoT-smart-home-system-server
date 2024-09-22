import mongoose from 'mongoose';
import config from './index.js'; 

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongo_url);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Could not connect to MongoDB', err);
        process.exit(1);
    }
};

export default connectDB;
