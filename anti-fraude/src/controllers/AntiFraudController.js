/* eslint-disable max-len */
import fetch from 'node-fetch';
import AntiFraud from '../models/AntiFraud.js';

async function validarStatus(antiFraud, novoStatus) {

  if (!antiFraud) {
    throw new Error('Análise anti-fraude não encontrada.');
  }
  if (antiFraud.status === 'aprovada' || antiFraud.status === 'rejeitada') {
    throw new Error('Status não pode ser alterado.');
  }
  if (novoStatus !== 'aprovada' && novoStatus !== 'rejeitada') {
    throw new Error('Status inválido.');
  }
  
}

class AntiFraudController {
  static findAllAntiFraud = async (_req, res) => {
    try {
      const allFraud = await AntiFraud.find();
      res.status(200).json(allFraud);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

  static findAntiFraudUnderReview = async (_req, res) => {
    try {
      const antiFraudePorStatus = await AntiFraud.find({ status: 'Em análise' });
      const data = antiFraudePorStatus.map((item) => ({
        id: item.id,
        clientId: item.clientId,
        transactionId: item.transactionId,
        status: item.status,
      }));
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err.message });
    }
  };

  static findAntiFraudById = async (req, res) => {
    try {
      const { id } = req.params;
      const findById = await AntiFraud.findById(id);

      const clientId = findById.clientId.toString();
      const transactionId = findById.transactionId.toString();
      console.log(transactionId);

      if (!findById) {
        res.status(400).send({ message: 'Anti fraude nao encontrada' });
      } else {
        const responseClient = await fetch(`http://localhost:3001/api/admin/clients/${clientId}`);
        const accounts = await responseClient.json();

        const responseTransacao = await fetch(`http://localhost:3002/api/admin/transactions/${findById.transactionId}`);
        const transacoes = await responseTransacao.json();

        const retorno = {
          _id: findById._id,
          status: findById.status,
          dadosPessoais: {
            id: accounts.dadosPessoais.id, nome: accounts.dadosPessoais.nome, cpf: accounts.dadosPessoais.cpf, telefone: accounts.dadosPessoais.telefone, renda_mensal: accounts.dadosPessoais.renda_mensal, vencimento_fatura: accounts.cartão.vencimento_fatura,
          },
          endereco: accounts.endereco,
          transacao: { _id: transacoes._id, valor: transacoes.valor },
        };

        res.status(200).json(retorno);
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

  static createAntiFraud = async (req, res) => {
    try {
      const infoAntiFraude = { ...req.body, status: 'em análise' };
      const novaAntifraude = new AntiFraud(infoAntiFraude);

      await novaAntifraude.save();
      res.status(201).json(novaAntifraude);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

  static updateAntiFraud = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const findAntiFraud = await AntiFraud.findById(id);

      await validarStatus(findAntiFraud, status);

      const options = {
        method: 'PUT'
      };

      await fetch(`http://localhost:3002/api/admin/transactions/${findAntiFraud.transactionId}?status=${status.toLowerCase()}`, options);

      const atualizaAntifraude = await AntiFraud.findByIdAndUpdate(id, { $set: { status } }, { new: true });

      res.status(200).json(atualizaAntifraude);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

  static deleteAntiFraud = async (req, res) => {
    try {
      const { id } = req.params;
      const deletaAntifraude = await AntiFraud.findByIdAndDelete(id);
      if (!deletaAntifraude) {
        res.status(404).send({ message: 'anti fraude nao encontrada' });
      } else {
        res.status(204).send({ message: 'anti fraude nao encontrada' });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };
}

export default AntiFraudController;
