/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import Client from '../models/Client.js';

class ClienteService {
  static getUserDataWithoutAccount = async (id) => {
    const isUserExistent = await Client.findById(id);
    if (isUserExistent === null) {
      return { status: 400, message: 'Cliente não encontrado!' };
    }
    const clientData = {
      dadosPessoais: isUserExistent.dadosPessoais,
      Endereco: isUserExistent.endereco,
    };
    return { status: 200, message: clientData };
  };
}
export default ClienteService;
