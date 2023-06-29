import { ObjectID } from 'bson';
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    nomeTitular: { type: String, required: true },
    valor: { type: Number, required: true },
    status: { type: String, required: true },
    clientId: { type: ObjectID, required: true },
  },
);

const Transaction = mongoose.model('transactions', transactionSchema);

export default Transaction;
