import ClienteService from '../services/clientService.js';

class ClienteController {
  static getUserDataWithoutAccount = async (req, res) => {
    const { id } = req.params;
    const userData = await ClienteService.getUserDataWithoutAccount(id);
    res.status(userData.status).send(userData.message);
  };

  static validDataAtDatabase = async (req, res) => {
    const clienteData = req.body;
    const verifyUser = await ClienteService.validDataAtDatabase(clienteData);
    res.status(verifyUser.status).send(verifyUser.message);
  };
}

export default ClienteController;
