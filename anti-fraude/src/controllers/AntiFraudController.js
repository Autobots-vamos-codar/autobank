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
  static findAnalysisUnderReview = async (_req, res) => {
    try {
      const antiFraudePorStatus = await AntiFraud.find({ status: 'Em análise' });
      res.status(200).json(antiFraudePorStatus);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
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
      status: 'Under review', // todo change para em analise
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
