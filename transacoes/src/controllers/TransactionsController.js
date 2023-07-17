import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import MongoService from "../services/MongoService.js";
import Transaction from "../models/transaction.js";
import TransactionService from "../services/TransactionService.js";
import Account from "../models/Account.js";

class TransactionsController {
  // Método que busca todas as transações na base mongo
  static findTransactions = async (_req, res) => {
    console.log("Procurando transações");
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
    console.log("Procurando transações por id");
    const idDoc = req.params.id;
    try {
      const doc = await MongoService.findOne(Transaction, {
        _id: mongoose.Types.ObjectId(idDoc),
      });
      const links = [];

      if (!doc) {
        return res.status(404).json({ message: "Transação não encontrada" });
      } else if (doc.status.toLowerCase() === "em análise") {
        links.push({
          rel: "self",
          href: `http://localhost:3002/api/admin/transactions/${doc.id}`,
          method: "GET",
        });
        links.push({
          rel: "vizualizar todas as transações",
          href: `http://localhost:3002/api/admin/transactions`,
          method: "GET",
          Authorization: req.headers.authorization,
        });
        links.push({
          rel: "aprovar",
          href: `http://localhost:3002/api/admin/transactions/${doc.id}?status=aprovada`,
          method: "PUT",
        });
        links.push({
          rel: "rejeitar",
          href: `http://localhost:3002/api/admin/transactions/${doc.id}?status=rejeitada`,
          method: "PUT",
        });
      } else if (
        doc.status.toLowerCase() === "aprovada" ||
        doc.status.toLowerCase() === "rejeitada"
      ) {
        links.push({
          rel: "self",
          href: `http://localhost:3002/api/admin/transactions/${doc.id}`,
          method: "GET",
        });
        links.push({
          rel: "vizualizar todas as transações",
          href: `http://localhost:3002/api/admin/transactions`,
          method: "GET",
          Authorization: req.headers.authorization,
        });
      }

      const transacao = {
        _id: doc._id,
        nomeTitular: doc.nomeTitular,
        valor: doc.valor,
        status: doc.status,
        clientId: doc.clientId,
        __v: doc.__v,
        links: links,
      };

      return res.status(200).json(transacao);
    } catch (error) {
      console.log(error.name);
      if (error.name === "BSONTypeError") {
        return res.status(400).send({
          message: "Id inválido, forneça um id válido para realizar a consulta",
        });
      }
      return res.status(500).send({ message: error.message });
    }
  };

  static createAccount = async (req, res) => {
    try {
      const { senha } = req.body;
      const custo = 12;
      const passwordEncrypted = await bcryptjs.hash(senha, custo);
      req.body.senha = passwordEncrypted;

      const accountCreated = await MongoService.createOne(Account, req.body);
      return res
        .status(201)
        .set("Location", `/admin/accounts/${accountCreated.id}`)
        .json(accountCreated);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  };

  static updateTransactionStatus = async (req, res) => {
    const { id } = req.params;
    const status = req.query.status;

    try {
      await TransactionService.processUpdateStatus(id, status);
      return res.status(204).send();
    } catch (error) {
      if (error.message === "NotFound") {
        return res.status(404).send({
          message:
            "O id informado não corresponde a nenhum valor na base" +
            ", verifique o id informado e tente novamente",
        });
      } else if (error.name === "CastError") {
        return res.status(400).send({
          message: "Id inválido, forneça um id válido para realizar a consulta",
        });
      }
      return res.status(400).send({ message: error.message });
    }
  };

  static deleteAccount = async (req, res) => {
    const { id } = req.params;
    try {
      await MongoService.deleteOne(Account, id);
      return res.status(204).send({ message: "Account successfully deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  };

  static createTransaction = async (req, res) => {
    console.log("Iniciando createTransaction");
    const transaction = await TransactionService.processTransaction(req.body);
    if (!transaction.statusResponse) {
      return res.status(500).send({
        message: "Erro interno no servidor, os dados não foram enviados!",
        error: transaction.error,
      });
    }
    if (transaction.statusResponse === 500) {
      return res.status(500).send({
        message: "Erro interno no servidor, os dados não foram enviados!",
        error: transaction.error,
      });
    }
    if (transaction.statusResponse === 400) {
      return res
        .status(400)
        .send({ message: "Os dados fornecidos estão inválidos!" });
    }
    if (transaction.statusResponse === 401) {
      return res.status(401).send({ message: "Cartão expirado!" });
    }
    if (transaction.statusResponse === 404) {
      return res.status(404).send({ message: "Cliente não encontrado!" });
    }
    if (transaction.statusResponse === 201) {
      const links = [];
      const dataTransaction = transaction.saved;
      const dataTransactionStatus = dataTransaction.status;

      if (dataTransactionStatus.toLowerCase() === "aprovada") {
        links.push({
          rel: "self",
          href: `http://localhost:3002/api/admin/transactions/${transaction.id}`,
          method: "GET",
        });
        links.push({
          rel: "vizualizar todas as transações",
          href: `http://localhost:3002/api/admin/transactions`,
          method: "GET",
          Authorization: req.headers.authorization,
        });
      }
      dataTransaction;

      const transacao = {
        _id: dataTransaction._id,
        nomeTitular: dataTransaction.nomeTitular,
        valor: dataTransaction.valor,
        status: dataTransaction.status,
        clientId: dataTransaction.clientId,
        __v: dataTransaction.__v,
        links: links,
      };

      return res.status(201).json(transacao);
    }

    return res
      .status(303)
      .set(
        "Location",
        `http://localhost:3002/api/admin/transactions/${transaction.id}`
      )
      .send(transaction);
  };
}

export default TransactionsController;
