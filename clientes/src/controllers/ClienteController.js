import ClienteService from '../services/clientService.js';

class ClienteController {
  static createClient = async (req, res) => {
    const novaCliente = await ClienteService.processCliente(req);
    res.status(novaCliente.status).send(novaCliente.message);
  };

  static getUserDataWithoutAccount = async (req, res) => {
    const { id } = req.params;
    const userData = await ClienteService.getUserDataWithoutAccount(id);
    res.status(userData.status).send(userData.message);
  };

  static validDataAtDatabase = async (req, res) => {
    const clienteData = req.body;
    const verifyUser = await ClienteService.validDataAtDatabase(clienteData);
    res.status(verifyUser.status).json(verifyUser.message);
  };
}

export default ClienteController;
