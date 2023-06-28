import fetch from 'node-fetch';
import AntiFraud from '../models/AntiFraud.js';

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
      console.log(findById.id)

      if (!findById) {
        res.status(400).send({ message: 'Anti fraude nao encontrada' });
      } else {
        const response = await fetch(`http://localhost:3001/api/admin/accounts/${findById.clientId}`);
        const accounts = await response.json();
        console.log(accounts);
        res.status(200).json(findById);
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

  static createAntiFraud = async (req, res) => {
    try {
      const infoAntiFraude = { ...req.body, status: 'Em análise' };
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
      const atualizaAntifraude = await AntiFraud.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true },
      );
      if (!atualizaAntifraude) {
        res.status(404).send({ message: 'anti fraude nao encontrada' });
      } else {
        res.status(200).json(atualizaAntifraude);
      }
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
