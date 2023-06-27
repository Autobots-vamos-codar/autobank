import { ObjectID } from 'bson';
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    nome_titular: { type: String, required: true },
    valor: { type: Number, required: true },
    status: { type: String, required: true },
    clientId: { type: ObjectID, required: true },
  },
);

const Transaction = mongoose.model('accounts', transactionSchema);

export default Transaction;
