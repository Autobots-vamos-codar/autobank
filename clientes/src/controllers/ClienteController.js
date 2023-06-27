import ClienteService from '../services/clientService.js';

class ClienteController {
  static getUserDataWithoutAccount = async (req, res) => {
    const { id } = req.params;
    const userData = await ClienteService.getUserDataWithoutAccount(id);
    res.status(userData.status).send(userData.message);
  };
}

export default ClienteController;
