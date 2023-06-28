import MongoService from './MongoService.js';
import Transaction from '../models/transaction.js';
import accountMock from '../mocks/accountMock.js';

class TransactionService {
  // eslint-disable-next-line no-unused-vars
  static validateCardData(data) {
    // verificar o model que o pessoal vai criar para cliente, importar ele aqui para a consulta
    // const cardFromMongo = MongoService.findOne(Transaction, {"card.number": data.number});
    const { cartao } = accountMock;
    const cardFromMongo = {
      numero: '11546468744236',
      nome: 'ff',
      validade: '09/2024',
      cvc: 1,
      vencimentoFatura: 10,
    };

    function verifyDateCard(dateCard) {
      const stringDateCard = dateCard.split('/');
      const cardExpirationDate = new Date(`${stringDateCard[1]}-${stringDateCard[0]}`);
      const cardExpiryYear = cardExpirationDate.getFullYear();
      const cardExpiryMonth = cardExpirationDate.getMonth() + 1;

      const currentDate = Date.now();
      const today = new Date(currentDate);
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;

      if (cardExpiryYear <= currentYear) {
        if (cardExpiryMonth < currentMonth) {
          return false;
        }

        return true;
      }

      return true;
    }

    function checksIfTheDataIsCompatible(card, cardDB) {
      const propertiesCard = Object.keys(card);

      // eslint-disable-next-line max-len
      const isDataCompatible = propertiesCard.every((propertie) => card[propertie] === cardDB[propertie]);

      return isDataCompatible;
    }

    function hasEmptyValues(card) {
      const datasToCheck = { ...card };
      const propriertiesDatas = Object.values(datasToCheck);

      if (!propriertiesDatas.includes(undefined) || !propriertiesDatas.includes(null) || !propriertiesDatas.includes('')) return false;

      return true;
    }

    function checkIfTheCardNumberIsValid(number) {
      if (number.length < 13 || number.length > 16) {
        return false;
      }

      return true;
    }

    return (
      verifyDateCard(cartao.validade),
      hasEmptyValues(cartao),
      checkIfTheCardNumberIsValid(cartao.numero),
      checksIfTheDataIsCompatible(cartao, cardFromMongo)
    );
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

  // static validateData() {}

  // static processApprovedTransaction(transaction) {}

  // static function processUnderReviewTransaction(){}

  // static processTransaction(req) {}
}

console.log(TransactionService.validateCardData('teste'));

export default TransactionService;
