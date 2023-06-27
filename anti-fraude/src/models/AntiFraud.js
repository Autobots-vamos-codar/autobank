import mongoose from 'mongoose';

const AntiFraudSchema = new mongoose.Schema(
  //TO DO
  {
    idCliente: {
      type: Number,
      required: true
    },
    idTransação: {
      type: Number,
      required: true
    },
    status: {type: String, enum: ['Em análise', 'Aprovada', 'Rejeitada']}
  },
);

const AntiFraud = mongoose.model('anti-fraude', AntiFraudSchema);

export default AntiFraud;
