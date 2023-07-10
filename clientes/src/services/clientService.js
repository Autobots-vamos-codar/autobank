/* eslint-disable eqeqeq */

/* eslint-disable max-len */

/* eslint-disable consistent-return */

/* eslint-disable no-unreachable */

/* eslint-disable no-undef */

/* eslint-disable no-underscore-dangle */

import Client from '../models/Client.js';
import { encrypt, decrypt } from '../cripto.js';

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
  if (cardExpiryYear === actualYear) {
    if (cardExpiryMonth < actualMonth) {
      return false;
    }

    return true;
  }

  if (cardExpiryYear < actualYear) {
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
      return { status: 401, message: 'rejeitado' };
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
  static processCliente = async (req) => {
    try {
      const dadosCartao = req.body.dadosCartao;

      const encryptedDataPromises = Object.keys(dadosCartao).map(async (key) => {
        const dadoCifrado = await encrypt(dadosCartao[key]);
        return [key, dadoCifrado];
      });

      const encryptedDataArray = await Promise.all(encryptedDataPromises);
      const encryptedData = Object.fromEntries(encryptedDataArray);
      req.body.dadosCartao = encryptedData;

      const cliente = new Client({
        dadosPessoais: req.body.dadosPessoais,
        endereco: req.body.endereco,
        dadosCartao: req.body.dadosCartao,
        createdDate: Date(),
      });

      await cliente.save();

      return { status: 201, message: cliente };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  };

  static getUserDataWithoutAccount = async (id) => {
    try {
      const isUserExistent = await Client.findById(id);
      if (isUserExistent === null) {
        return { status: 404, message: 'cliente não encontrado' };
      }

      const decryptedDataPromises = Object.keys(isUserExistent.dadosCartao).map(async (key) => {
        const dadoDeciifrado = await decrypt(isUserExistent.dadosCartao[key]);
        return [key, dadoDeciifrado];
      });

      const decryptedDataArray = await Promise.all(decryptedDataPromises);
      const decryptedData = Object.fromEntries(decryptedDataArray);
      isUserExistent.dadosCartao = decryptedData;

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
