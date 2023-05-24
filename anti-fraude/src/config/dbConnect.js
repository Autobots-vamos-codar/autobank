import mongoose from 'mongoose';

mongoose.connect(`mongodb://admin:secret@${process.env.MONGO_HOST || '127.0.0.1'}:27017/anti-fraude?authSource=admin`);

const db = mongoose.connection;

export default db;
