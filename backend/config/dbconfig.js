const mongoose = require('mongoose');

let isConnected = false; 

const connectDB = async () => {
    if (isConnected) return;

    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = db.connections[0].readyState === 1;
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); 
    }
};

module.exports = connectDB;
