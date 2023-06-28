import mongoose from 'mongoose';

mongoose.connect(`mongodb://admin:secret@${process.env.MONGO_HOST || '127.0.0.1'}:${process.env.MONGO_PORT || '27018'}/transacoes?authSource=admin`);

const db = mongoose.connection;

export default db;
