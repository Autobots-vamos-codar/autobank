/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import Client from '../models/Client.js';

class ClienteService {
  static getUserDataWithoutAccount = async (id) => {
    try {
      const isUserExistent = await Client.findById(id);
      if (isUserExistent === null) {
        throw new Error();
      }
      const clientData = {
        dadosPessoais: isUserExistent.dadosPessoais,
        Endereco: isUserExistent.endereco,
      };
      return { status: 200, message: clientData };
    } catch (erro) {
      return { status: 404, message: 'Cliente não encontrado!' };
    }
  };
}
export default ClienteService;
