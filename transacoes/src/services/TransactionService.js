// eslint-disable-next-line import/no-relative-packages
// import MongoService from '../../../services/MongoService.mjs';
import fetch from 'node-fetch';
import Transaction from '../models/transaction.js';

class TransactionService {
  // eslint-disable-next-line no-unused-vars

  static async validateIncome(datasTransaction) {
    const idUser = '649c32ed0e82d35a39dcc5d0';
    const responseUser = await fetch(`http://${process.env.CLIENTS_HOST || '127.0.0.1'}:3001/api/admin/clients/${idUser}`);
    const user = await responseUser.json();

    const income = user.dadosPessoais.renda_mensal;
    const transactionValue = datasTransaction.valorTransacao;

    if (income / 2 < transactionValue) {
      return this.processUnderReviewTransaction(datasTransaction, idUser);
    }
    return this.processApprovedTransaction(idUser);
  }

  static hasTheRequiredTransactionData(datasTransaction) {
    const transactionDataRequired = ['valorTransacao', 'nome_titular', 'validade', 'numero', 'cvc'];
    const dataTransaction = Object.keys(datasTransaction);
    const hasTheDatas = transactionDataRequired.every((data) => dataTransaction.includes(data));

    if (!hasTheDatas) {
      return { statusResponse: 400 };
    }

    return this.validateIncome(datasTransaction);
  }

  static async requireID(datasOfTransaction) {
    try {
      const reqIDToServiceClient = await fetch(`http://${process.env.CLIENTS_HOST || '127.0.0.1'}:3001/api/admin/clients`, {
        method: 'POST',
        body: JSON.stringify(datasOfTransaction),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const idUser = await reqIDToServiceClient.json();

      return idUser;
    } catch (error) {
      return { error: error.message, statusResponse: 500 };
    }
  }

  static async sendDataToServiceAntFraude(datasOfTransaction) {
    try {
      const { clientId, _id } = datasOfTransaction;
      await fetch(`http://${process.env.CLIENTS_HOST || '127.0.0.1'}:3000/api/antiFraud`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientId, transactionId: _id }),
      });

      return 'Sucesso';
    } catch (error) {
      return { error: error.message, statusResponse: 500 };
    }
  }

  static async validateDataOfTransaction(datasOfTransaction) {
    const datasValid = this.hasTheRequiredTransactionData(datasOfTransaction);

    return datasValid;
  }

  static async processApprovedTransaction(idUser) {
    await this.saveTransaction({ status: 'Aprovado', idUser });

    return { status: 'Aprovado', idUser, statusResponse: 201 };
  }

  static async processUnderReviewTransaction(datasOfTrasaction, idUser) {
    const dataTransaction = {
      status: 'Em análise',
      valor: datasOfTrasaction.valorTransacao,
      nome_titular: datasOfTrasaction.nome_titular,
      clientId: idUser,
    };
    const saved = await this.saveTransaction(dataTransaction);
    const submitToAntiFraudService = await this.sendDataToServiceAntFraude(saved);

    if (typeof(submitToAntiFraudService) !== 'object') {
      return {
        status: 'Em análise', idUser, statusResponse: 303, message: 'Transação executada com sucesso!',
      };
    }

    return submitToAntiFraudService;
  }

  static async saveTransaction(transactionDoc) {
    try {
      const newDoc = await Transaction({ ...transactionDoc, createdDate: Date() });
      await newDoc.save();
      return newDoc;
    } catch (error) {
      return { error: error.message, statusResponse: 500 };
    }
  }

  static async processTransaction(transactionBody) {
    const transaction = await this.validateDataOfTransaction(transactionBody);
    return transaction;
  }
}

export default TransactionService;
