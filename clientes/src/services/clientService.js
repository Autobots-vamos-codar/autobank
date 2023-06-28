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
  const validityDate = new Date(`${yearString}-${monthString}`);
  const cardExpiryYear = validityDate.getFullYear();
  const cardExpiryMonth = validityDate.getMonth() + 2;

  const getActualDate = new Date();
  const actualYear = getActualDate.getFullYear();
  const actualMonth = getActualDate.getMonth() + 2;

  if (cardExpiryMonth < actualMonth && cardExpiryYear <= actualYear) {
    return { status: 400, message: 'Cartão expirado' };
  }
  return true;
}

function validUserData(cardName, cvc, validity, user) {
  if (cardName !== user.dadosCartao.nomeCartao || cvc !== user.dadosCartao.cvc || validity !== user.dadosCartao.validade) {
    return { status: 400, message: 'Dados Inválidos' };
  }
  return { id: user._id };
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
      };
      return { status: 200, message: clientData };
    } catch (error) {
      return { status: 400, message: error.message };
    }
  };

  static validDataAtDatabase = async (user) => {
    try {
      const userData = user;
      const isUserDataValid = await Client.findOne({ 'dadosCartao.numeroCartao': userData.numeroCartao });
      if (isUserDataValid === null) {
        return { status: 404, message: 'cliente não encontrado' };
      }
      validExpirationDate(userData.validade);
      const validData = validUserData(userData.nomeCartao, userData.cvc, userData.validade, isUserDataValid);
      return { status: 200, message: validData };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  };
}
export default ClienteService;
