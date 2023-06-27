import AntiFraud from '../models/AntiFraud.js';

class AntiFraudController {
  static findAntiFraud = (_req, res) => {
    AntiFraud.find((err, allAntiFrauds) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(200).json(allAntiFrauds);
    });
  };

  static findAntiFraudById = (req, res) => {
    const { id } = req.params;
    AntiFraud.findById(id, (err, AntiFraud) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (!AntiFraud) {
        return res.status(404).json();
      }
      return res.status(200).json(AntiFraud);
    });
  };

  static createAntiFraud = async (req, res) => {
    const myAntiFraud = new AntiFraud({
      ...req.body,
      createdDate: Date(),
    });
    myAntiFraud.save((err, newAntiFraud) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(201).set('Location', `/antiFraud/${AntiFraud.id}`).json(newAntiFraud);
    });
  };

  static updateAntiFraud = (req, res) => {
    const { id } = req.params;

    AntiFraud.findByIdAndUpdate(id, { $set: req.body }, { new: true }, (err, AntiFraud) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(204).set('Location', `/antiFraud/${AntiFraud.id}`).send();
    });
  };

  static deleteAntiFraud = (req, res) => {
    const { id } = req.params;

    AntiFraud.findByIdAndDelete(id, (err) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(204).send({ message: 'AntiFraud successfully deleted' });
    });
  };
}

export default AntiFraudController;
