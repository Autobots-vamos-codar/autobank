/* eslint-disable eqeqeq */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable no-unreachable */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import Client from '../models/Client.js';

function validExpirationDate(validity) {
  const separateValidity = validity.split('/');
  const monthString = separateValidity[0];
  const yearString = separateValidity[1];
  const validityDate = new Date(yearString, monthString);
  const cardExpiryYear = validityDate.getFullYear() + 100;
  const cardExpiryMonth = validityDate.getMonth();

  const getActualDate = new Date();
  const actualYear = getActualDate.getFullYear();
  const actualMonth = getActualDate.getMonth() + 1;
  if (cardExpiryYear <= actualYear) {
    if (cardExpiryMonth < actualMonth) {
      return false;
    }

    return false;
  }

  return true;
}

function validUserData(cardName, cvc, validity, user) {
  try {
    if (cvc != user.dadosCartao.cvc) {
      return false;
    }
    if (validity != user.dadosCartao.validade) {
      return false;
    }
    if (cardName != user.dadosCartao.nomeTitular) {
      return false;
    }
  } catch (error) {
    return { status: 500, message: error.message };
  }
}

function validateTransectionValue(transactionValue, income) {
  try {
    if (transactionValue < (income / 2)) {
      return { status: 'aprovada' };
    }
    if (transactionValue >= (income / 2)) {
      return { status: 'em análise' };
    }
  } catch (error) {
    return { status: 500, message: error.message };
  }
}

async function validateUserCardBody(userData) {
  try {
    const isUserDataValid = await Client.findOne({ 'dadosCartao.numeroCartao': userData.numeroCartao });
    if (isUserDataValid === null) {
      return { status: 404, message: 'cliente não encontrado' };
    }
    const validateData = validExpirationDate(userData.validade);
    if (validateData === false) {
      return { status: 401, message: 'Cartão expirado' };
    }
    const validData = validUserData(userData.nomeTitular, userData.cvc, userData.validade, isUserDataValid);
    if (validData === false) {
      return { status: 400, message: 'rejeitado' };
    }
    const isTransectionValueValid = validateTransectionValue(userData.valorTransacao, isUserDataValid.dadosPessoais.rendaMensal);
    const response = {
      clientId: isUserDataValid._id,
      status: isTransectionValueValid.status,
      rendaMensal: isUserDataValid.dadosPessoais.rendaMensal,
    };
    return { status: 200, message: response };
  } catch (error) {
    return { status: 500, message: error.message };
  }
}
class ClienteService {
  static getUserDataWithoutAccount = async (id) => {
    try {
      const isUserExistent = await Client.findById(id);
      if (isUserExistent === null) {
        return { status: 404, message: 'cliente não encontrado' };
      }
      const clientData = {
        dadosPessoais: isUserExistent.dadosPessoais,
        Endereco: isUserExistent.endereco,
        vencimentoDaFatura: isUserExistent.dadosCartao.diaVencimentoFatura,
      };
      return { status: 200, message: clientData };
    } catch (error) {
      return { status: 400, message: error.message };
    }
  };

  static validDataAtDatabase = async (user) => {
    try {
      const userData = user;
      const validateBody = await validateUserCardBody(userData);
      return { status: validateBody.status, message: validateBody.message };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  };
}
export default ClienteService;
