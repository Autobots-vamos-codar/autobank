// eslint-disable-next-line import/no-relative-packages
// import MongoService from '../../../services/MongoService.mjs';
import Transaction from '../models/transaction.js';
import accountMock from '../mocks/accountMock.js';

class TransactionService {
  // eslint-disable-next-line no-unused-vars

  static validateIncome(income, transactionValue) {
    if (income / 2 < transactionValue) {
      return false;
    }
    return true;
  }

  static validateCardData(dataCard) {
    // verificar o model que o pessoal vai criar para cliente, importar ele aqui para a consulta
    // const cardFromMongo = MongoService.findOne(Transaction, {"card.number": data.number});
    // const valueOfTransaction
    const { cartao } = accountMock;
    // const income = data.renda;
    // const valueOfTransaction =
    const cardFromTransaction = {
      numero: '11546468744236',
      nome: 'ff',
      validade: '09/2023',
    };

    function verifyDateCard(dateCard) {
      const stringDateCard = dateCard.split('/');
      const cardExpirationDate = new Date(`${stringDateCard[1]}-${stringDateCard[0]}`);
      const cardExpiryYear = cardExpirationDate.getFullYear();
      const cardExpiryMonth = cardExpirationDate.getMonth() + 2;

      const currentDate = Date.now();
      const today = new Date(currentDate);
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;

      if (cardExpiryYear <= currentYear) {
        if (cardExpiryMonth <= currentMonth) {
          return false;
        }
      }

      return true;
    }

    function hasEmptyValues(card) {
      const datasToCheck = { ...card };
      const propriertiesDatas = Object.values(datasToCheck);

      if (propriertiesDatas.includes(undefined) || propriertiesDatas.includes(null) || propriertiesDatas.includes('')) return false;

      return true;
    }

    function checksIfTheDataIsCompatible(card, cardDB) {
      const valuesCard = Object.values(card);
      const valuesCardDB = Object.values(cardDB);

      // eslint-disable-next-line max-len
      const isDataCompatible = valuesCard.every((value) => valuesCardDB.includes(value));

      return isDataCompatible;
    }

    if (
      !verifyDateCard(cardFromTransaction.validade)
      && !checksIfTheDataIsCompatible(cardFromTransaction, cartao)
      && !hasEmptyValues(cardFromTransaction)
    ) {
      return { statusResponse: 400, message: 'Dados inválidos!' };
    }

    return this.validateIncome();
  }

  static hasTheRequiredTransactionData(datasTransaction) {
    const transactionDataRequired = ['valor', 'nome', 'validade', 'numero', 'cvc'];
    const dataTransaction = Object.keys(datasTransaction);
    const hasTheDatas = transactionDataRequired.every((data) => dataTransaction.includes(data));

    if (!hasTheDatas) {
      return { statusResponse: 400, message: 'Dados inválidos!' };
    }

    return this.validateCardData(datasTransaction);
  }

  static async validateDataOfTransaction(datasOfTransaction) {
    const datasValid = this.hasTheRequiredTransactionData(datasOfTransaction);

    if (datasValid) return this.processApprovedTransaction();
    if (!datasValid) return this.processUnderReviewTransaction(datasOfTransaction);

    return datasValid;
  }

  static async processApprovedTransaction() {
    const responseBdTransaction = await this.saveTransaction({ status: 'Aprovado' });
    return responseBdTransaction;
  }

  static async processUnderReviewTransaction(datasOfTrasaction) {
    // const submitToAntiFraudService = fetch('servicoAntFraude') //envia os dados da transação
    const responseBdTransaction = await this.saveTransaction({ status: 'Em análise' });
    return responseBdTransaction;
  }

  static async saveTransaction(transactionDoc) {
    const newDoc = await Transaction({ ...transactionDoc, createdDate: Date() });
    return newDoc;
  }

  static async processTransaction(transactionBody) {
    const allUsers = await fetch('http://localhost:3001/api/admin/accounts');

    console.log(allUsers);

    // const transaction = this.validateDataOfTransaction(transactionBody, dataUser);
    // return transaction;
  }
}

export default TransactionService;
