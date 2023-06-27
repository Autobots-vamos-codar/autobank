import MongoService from '../../../services/MongoService.mjs';
import Transaction from '../models/transaction.js';
import accountMock from '../mocks/accountMock.js';

class TransactionService {
  static validateCardData(data) {
    // verificar o model que o pessoal vai criar para cliente, importar ele aqui para a consulta
    // const cardFromMongo = MongoService.findOne(Transaction, {"card.number": data.number});
    const accountFromMongo = accountMock;
    const card = accountFromMongo.cartao;
    return (card.numero === data.numero && card.validade === data.validade && card.cvc === data.cvc);
  }

  static validateIncome(income, transactionValue) {
    if (income / 2 < transactionValue) {
      return 'Aprovado';
    }
    return 'Em análise';
  }

  static async saveTransaction(transactionDoc) {
    const newDoc = await MongoService.createOne(Transaction, transactionDoc);
    return newDoc;
  }

  // static function validateData(){} -> valida os dados do body,

  // static processApprovedTransaction(transaction) {}

  // static function processUnderReviewTransaction(){}

  // static processTransaction(req) {}
}

export default TransactionService;
