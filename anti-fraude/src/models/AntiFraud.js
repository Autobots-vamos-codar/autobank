import mongoose from 'mongoose';

const AntiFraudSchema = new mongoose.Schema(

  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
    },
    status: { type: String, required: true },
  },
  {
    versionKey: false,
  },
);

const AntiFraud = mongoose.model('anti-fraude', AntiFraudSchema);

export default AntiFraud;
