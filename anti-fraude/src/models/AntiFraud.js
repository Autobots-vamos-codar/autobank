import mongoose from 'mongoose';

const AntiFraudSchema = new mongoose.Schema(
  
  {
    idCliente: {
      type: Number,//TODO mudar type para mongoose.Schema.Types.ObjectId
      required: true
    },
    idTransação: {
      type: Number,//TODO mudar type para mongoose.Schema.Types.ObjectId
      required: true
    },
    status: {type: String, enum: ['Em análise', 'Aprovada', 'Rejeitada']}
  },
);

const AntiFraud = mongoose.model('anti-fraude', AntiFraudSchema);

export default AntiFraud;
