import MongoService from '../../../services/MongoService.mjs';

class ClienteService {
  static getUserDataWithoutAccount = async (id) => {
    const isUserExistent = await MongoService.findById(id);
    if (isUserExistent.id !== id) {
      return { status: 404, message: 'cliente não encontrado' };
    }
    const clientData = {
      contaPessoal: isUserExistent.contaPessoal,
      Endereco: isUserExistent.Endereco,
    };
    return { status: 200, message: clientData };
  };
}
export default ClienteService;
