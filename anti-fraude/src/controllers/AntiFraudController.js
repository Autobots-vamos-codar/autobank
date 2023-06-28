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

  // TODO finalizar busca por status
  static findAntiFraudByStatus = async (_req, res) => {
    AntiFraud.find({ status: 'Em análise' }, (err, foundAntifraud) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (!foundAntifraud) {
        return res.status(404).json();
      }
      return res.status(200).json(foundAntifraud);
    });
  };

  static findAntiFraudById = (req, res) => {
    const { id } = req.params;
    AntiFraud.findById(id, (err, foundAntifraud) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (!foundAntifraud) {
        return res.status(404).json();
      }
      return res.status(200).json(foundAntifraud);
    });
  };

  static createAntiFraud = async (req, res) => {

    const myAntiFraud = new AntiFraud({
      ...req.body,
      status: 'Em análise',
      createdDate: Date(),
    });

    myAntiFraud.save((err, newAntiFraud) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res
        .status(201)
        .set('Location', `/antiFraud/${AntiFraud.id}`)
        .json(newAntiFraud);
    });
  };

  static updateAntiFraud = (req, res) => {
    const { id } = req.params;

    AntiFraud.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true },
      (err, foundAntifraud) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
        return res
          .status(204)
          .set('Location', `/antiFraud/${foundAntifraud.id}`)
          .send();
      },
    );
  };

  static deleteAntiFraud = (req, res) => {
    const { id } = req.params;

    AntiFraud.findByIdAndDelete(id, (err) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res
        .status(204)
        .send({ message: 'AntiFraud successfully deleted' });
    });
  };
}

export default AntiFraudController;
