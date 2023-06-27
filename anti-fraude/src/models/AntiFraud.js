import mongoose from 'mongoose';

const AntiFraudSchema = new mongoose.Schema(
  {
    idCliente: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    idTransação: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    status: {type: String, enum: ["Em análise", "Aprovada", "Rejeitada"]}
  },
);

const AntiFraud = mongoose.model('anti-fraude', AntiFraudSchema);

export default AntiFraud;
