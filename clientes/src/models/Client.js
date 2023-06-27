import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    dadosPessoais: {
      nome: {
        type: String,
        match: /^[A-Za-zÀ-ÖØ-öø-ÿ -]{5,}.*$/,
        required: true,
      },
      cpf: {
        type: String,
        match: /^\d{11}$/,
        required: true,
      },
      email: {
        type: String,
        match: /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/,
        required: true,
      },
      telefone: {
        type: String,
        match: /^[0-9]{10,}$/,
        required: true,
      },
      rendaMensal: {
        type: mongoose.Decimal128,
        validate: {
          validator(v) {
            return v > 0;
          },
          message: 'Renda deve ser maior que zero',
        },
        required: true,
      },
    },
    endereco: {
      rua: { type: String, required: true },
      numero: {
        type: String,
        match: /^(\d+|S\/N)$/,
        required: true,
      },
      complemento: {
        type: String,
      },
      cep: {
        type: String,
        match: /^[0-9]{8}$/,
        required: true,
      },
      cidade: {
        type: String,
        match: /^[A-Za-zÀ-ÖØ-öø-ÿ -]{3,}$/,
        required: true,
      },
      estado: {
        type: String,
        enum: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'],
        required: true,
      },
    },
    dadosCartao: {
      numeroCartao: {
        type: String,
        minLenght: 13,
        maxLenght: 16,
        required: true,
      },
      nomeCartao: {
        type: String,
        match: /^[A-Za-z ]{5,}$/,
        required: true,
      },
      validade: {
        type: String,
        match: /^\d{2}\/\d{2}$/,
        required: true,
      },
      cvc: {
        type: Number,
        match: /^\d{3}$/,
        required: true,
      },
      diaVencimentoFatura: {
        type: Number,
        min: 1,
        max: 31,
        required: true,
      },
    },
  },
  {
    versionKey: false,
  },
);

const Client = mongoose.model('clients', clientSchema);

export default Client;
