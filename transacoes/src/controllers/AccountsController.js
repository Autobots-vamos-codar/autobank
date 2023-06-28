import bcryptjs from 'bcryptjs';
import Account from '../models/Account.js';
import MongoService from '../services/MongoService.mjs';
import TransactionService from '../services/TransactionService.js';

class AccountController {
  static findAccounts = async (_req, res) => {
    try {
      const docs = await MongoService.findMany(Account, {});
      return res.status(200).json(docs);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  };

  static findAccountById = async (req, res) => {
    const { idDoc } = req.params;
    try {
      const doc = await MongoService.findOne(Account, { id: idDoc });

      if (!doc) {
        return res.status(404).json();
      }
      return res.status(200).json(doc);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  };

  static createAccount = async (req, res) => {
    const { senha } = req.body;
    const custo = 12;
    const passwordEncrypted = await bcryptjs.hash(senha, custo);
    req.body.senha = passwordEncrypted;
    try {
      const accountCreated = await MongoService.createOne(Account, req.body);
      return res.status(201).set('Location', `/admin/accounts/${accountCreated.id}`).json(accountCreated);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  };

  static updateAccount = async (req, res) => {
    const { id } = req.params;
    try {
      const doc = await MongoService.updateOne(Account, id, req.body);
      console.log(doc);
      return res.status(204).set('Location', `/admin/accounts/${doc.id}`).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  };

  static deleteAccount = async (req, res) => {
    const { id } = req.params;
    try {
      await MongoService.deleteOne(Account, id);
      return res.status(204).send({ message: 'Account successfully deleted' });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  };

  static createTransaction = async (req, res) => {
    const transaction = await TransactionService.processTransaction(req.body);

    if (transaction.statusResponse === 500) {
      return res.status(500).send({ message: 'Erro interno no servidor, os dados não foram enviados!', error: transaction.error });
    }
    if (transaction.statusResponse === 400) {
      return res.status(400).send({ message: 'Os dados fornecidos estão inválidos!' });
    }
    if (transaction.statusResponse === 201) {
      return res.status(201).send(transaction);
    }
    // desenvolver retorno para o caso de Em análise
    return res.status(303).set('Location', 'http://localhost:3001').json(transaction);
  };
}

export default AccountController;
