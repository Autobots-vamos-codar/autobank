// eslint-disable-next-line import/no-relative-packages
import fetch from 'node-fetch';
import MongoService from './MongoService.js';
import Transaction from '../models/transaction.js';

function isValidStatusToUpdate(oldStatus, newStatus) {
  console.log(`${oldStatus} - ${newStatus}`);
  if (oldStatus.toLowerCase() === 'em análise') {
    if (newStatus.toLowerCase() === 'aprovada' || newStatus.toLowerCase() === 'rejeitada') {
      return true;
    }
  }
  return false;
}

class TransactionService {
  // eslint-disable-next-line no-unused-vars

  static async requireIDAndIncome(datasOfTransaction) {
    console.log(datasOfTransaction);
    try {
      const url = `http://${process.env.CLIENTS_HOST || '127.0.0.1'}:3001/api/admin/clients`;
      // console.log(url);
      const reqIDToServiceClient = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(datasOfTransaction),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const responseServiceClient = await reqIDToServiceClient.json();

      if (reqIDToServiceClient.status >= 400) {
        console.log(`Causa do erro: ${responseServiceClient}`);
        console.log(`Erro status: ${reqIDToServiceClient.status}`);
        throw new Error(reqIDToServiceClient.status);
      }

      const { clientId, status, rendaMensal } = responseServiceClient;

      return { clientId, statusIncome: status, income: rendaMensal };
    } catch (error) {
      console.log(error);
      return { error: error.message };
    }
  }

  static async sendDataToServiceAntFraude(datasOfTransaction) {
    try {
      const { clientId, _id } = datasOfTransaction;
      const url = `http://${process.env.ANTI_FRAUDE_HOST || '127.0.0.1'}:3000/api/antiFraud`;
      console.log(url);
      await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientId, transactionId: _id }),
      });

      return { statusResponse: 303, id: _id };
    } catch (error) {
      console.log(error);
      return { error: error.message, statusResponse: 500 };
    }
  }

  static async processApprovedTransaction(datasTransaction, idUser) {
    const dataTransaction = {
      status: 'Aprovada',
      valor: datasTransaction.valorTransacao,
      nomeTitular: datasTransaction.nomeTitular,
      clientId: idUser,
    };
    await this.saveTransaction(dataTransaction);
    return { status: 'Aprovada', idUser, statusResponse: 201 };
  }

  static async processUnderReviewTransaction(datasOfTrasaction, idUser) {
    const dataTransaction = {
      status: 'Em análise',
      valor: datasOfTrasaction.valorTransacao,
      nomeTitular: datasOfTrasaction.nomeTitular,
      clientId: idUser,
    };
    const saved = await this.saveTransaction(dataTransaction);
    const submitToAntiFraudService = await this.sendDataToServiceAntFraude(saved);

    if (!submitToAntiFraudService.error) {
      submitToAntiFraudService.status = 'Em análise';
      submitToAntiFraudService.message = 'Transação executada com sucesso!';
    }

    return submitToAntiFraudService;
  }

  static async saveTransaction(transactionDoc) {
    try {
      const newDoc = await Transaction({ ...transactionDoc, createdDate: Date() });
      console.log(`Transação salva, novo arquivo = ${newDoc}`);
      await newDoc.save();
      return newDoc;
    } catch (error) {
      console.log(error);
      return { error: error.message, statusResponse: 500 };
    }
  }

  static async validateDataOfTransaction(datasOfTransaction) {
    console.log('Validando dados da transação');
    const transactionDataRequired = ['valorTransacao', 'nomeTitular', 'validade', 'numeroCartao', 'cvc'];
    const dataTransaction = Object.keys(datasOfTransaction);
    const hasTheDatas = transactionDataRequired.every((data) => dataTransaction.includes(data));

    console.log(`Antes de validar dados - ${hasTheDatas}`);
    if (!hasTheDatas) {
      console.log('Erro na validação de dados do cartão');
      return false;
    }
    console.log('Objeto valido até aqui');

    return true;
  }

  static async validateIncome(datasTransaction) {
    try {
      // Esperar time de clientes fazer rota de validação de dados
      console.log('Buscando dados de usuário');
      const idUserAndDataIncome = await this.requireIDAndIncome(datasTransaction);
      console.log(idUserAndDataIncome);

      if (!idUserAndDataIncome.error) {
        const { clientId, statusIncome, income } = idUserAndDataIncome;

        const url = `http://${process.env.CLIENTS_HOST || '127.0.0.1'}:3001/api/admin/clients/${clientId}`;
        console.log(url);

        const responseUser = await fetch(url);
        const user = await responseUser.json();

        console.log(user);

        console.log(`Renda mensal = ${income.$numberDecimal} valor transação ${datasTransaction.valorTransacao}`);
        return { isValid: statusIncome === 'aprovada', id: clientId };
      }

      throw new Error(idUserAndDataIncome.error);
    } catch (error) {
      return { error: error.message };
    }
  }

  static async processTransaction(transactionBody) {
    console.log('Processando transação');
    const transaction = await this.validateDataOfTransaction(transactionBody);
    if (transaction) {
      const income = await this.validateIncome(transactionBody);
      if (income.error) {
        return { statusResponse: Number(income.error) };
      }
      if (income.isValid) {
        return await this.processApprovedTransaction(transactionBody, income.id);
      } else {
        return await this.processUnderReviewTransaction(transactionBody, income.id);
      }
    } else {
      return { statusResponse: 400 };
    }
  }

  static async processUpdateStatus(id, newStatus) {
    const transaction = await MongoService.findOne(Transaction, { _id: id });
    if (!transaction) {
      throw new Error('NotFound');
    }
    console.log(transaction);
    if (isValidStatusToUpdate(transaction.status, newStatus)) {
      const doc = await MongoService.updateOne(Transaction, id, { status: newStatus });
      console.log(doc);
      return;
    }

    throw new Error('Status inválido para atualização. O status atual não permite '
    + 'atualizações ou o status enviado é inválido.');
  }
}

export default TransactionService;
