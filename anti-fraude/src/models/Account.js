import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true },
    senha: { type: String, required: true },
  },
);

const Account = mongoose.model('accounts', accountSchema);

export default Account;
