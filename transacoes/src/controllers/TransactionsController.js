import bcryptjs from 'bcryptjs';
import Account from '../models/Account.js';
import MongoService from '../services/MongoService.mjs';
import Transaction from '../models/transaction.js';
import TransactionService from '../services/TransactionService.js';

class TransactionsController {
  // Método que busca todas as transações na base mongo
  static findTransactions = async (_req, res) => {
    console.log('Procurando transações');
    try {
      const docs = await MongoService.findMany(Transaction, {});
      console.log(docs);
      return res.status(200).json(docs);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  };

  // Método que busca uma transação por id
  static findTransactionById = async (req, res) => {
    console.log('Procurando transações por id');
    const { idDoc } = req.params;
    try {
      const doc = await MongoService.findOne(Transaction, { id: idDoc });

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

  static updateTransactionStatus = async (req, res) => {
    const { id } = req.params;
    const status = req.query.status;
    /* try {
      const doc = await MongoService.updateOne(Account, id, req.body);
      console.log(doc);
      return res.status(204).set('Location', `/admin/accounts/${doc.id}`).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    } */

    try {
      await TransactionService.processUpdateStatus(id, status);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).send({ message: error.message });
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
    console.log('Iniciando createTransaction');
    const transaction = await TransactionService.processTransaction(req.body);
    console.log(transaction);
    if (!transaction.statusResponse) {
      return res.status(500).send({ message: 'Erro interno no servidor, os dados não foram enviados!', error: transaction.error });
    }
    if (transaction.statusResponse === 500) {
      return res.status(500).send({ message: 'Erro interno no servidor, os dados não foram enviados!', error: transaction.error });
    }
    if (transaction.statusResponse === 400) {
      return res.status(400).send({ message: 'Os dados fornecidos estão inválidos!' });
    }
    if (transaction.statusResponse === 201) {
      return res.status(201).send(transaction);
    }
    if (transaction.statusResponse === 303) {
      if (transaction.error) {
        console.log('Retorna 500');
        return res.status(500).set().json(transaction);
      }
    }
    console.log('Retorna 303');
    return res.status(303).set('Location', `http://localhost:3002/api/admin/transactions/${transaction.id}`).json(transaction);
  };
}

export default TransactionsController;
