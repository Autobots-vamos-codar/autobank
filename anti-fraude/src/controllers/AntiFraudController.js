/* eslint-disable max-len */
import fetch from "node-fetch";
import AntiFraud from "../models/AntiFraud.js";
import amqp from "amqplib";

let channel;

async function connectQueue() {
  try {
    const connection = await amqp.connect(
      `amqp://adm:adm@${process.env.RABBIT_HOST || "127.0.0.1"}:5672`
    );
    const channel1 = await connection.createChannel();

    await channel1.assertQueue("analisesAntiFraude", { durable: true });
    console.log("Conexão estabelecida com sucesso.");
    return channel1;
  } catch (err) {
    console.error("Erro ao conectar ao RabbitMQ:", err);
    throw err;
  }
}

channel = await connectQueue();

async function sendQueue(analiseAntiFraude) {
  channel.sendToQueue(
    "analisesAntiFraude",
    Buffer.from(JSON.stringify(analiseAntiFraude)),
    {
      persistent: true,
    }
  );

  console.log("Análise recebida com sucesso.");
}

async function consumeQueue(findAntiFraud, status) {
  await channel.consume(
    "analisesAntiFraude",
    async (message) => {
      try {
        const options = {
          method: "PUT",
        };

        await fetch(
          `http://${
            process.env.TRANSACOES_HOST || "127.0.0.1"
          }:3002/api/admin/transactions/${
            findAntiFraud.transactionId
          }?status=${status.toLowerCase()}`,
          options
        );

        await AntiFraud.findByIdAndUpdate(
          findAntiFraud._id,
          { $set: { status } },
          { new: true }
        );

        console.log("Análise processada com sucesso.");
      } catch (err) {
        channel.nack(message);
        throw new Error("Erro ao processar a análise.");
      }
    },
    { noAck: true }
  );
}

async function validarTransactionId(idTrasacao) {
  const responseTransacao = await fetch(
    `http://${
      process.env.TRANSACOES_HOST || "127.0.0.1"
    }:3002/api/admin/transactions/${idTrasacao}`
  );

  if (responseTransacao.status === 404) {
    throw new Error("Transação não encontrada.");
  }
}

async function validarClientId(idCliente) {
  const responseClient = await fetch(
    `http://${
      process.env.CLIENTS_HOST || "127.0.0.1"
    }:3001/api/admin/clients/${idCliente}`
  );

  if (responseClient.status === 404) {
    throw new Error("Cliente não encontrado.");
  }
}

async function validarStatus(antiFraud, novoStatus) {
  const statusAtual = antiFraud.status;

  if (!antiFraud) {
    throw new Error("Análise anti-fraude não encontrada.");
  }
  if (
    statusAtual.toLowerCase() === "aprovada" ||
    statusAtual.toLowerCase() === "rejeitada"
  ) {
    throw new Error("Status não pode ser alterado.");
  }
  if (novoStatus !== "aprovada" && novoStatus !== "rejeitada") {
    throw new Error("Status inválido.");
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
      const antiFraudePorStatus = await AntiFraud.find({
        status: "em análise",
      });
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

      if (!findById) {
        res.status(400).send({ message: "Anti fraude nao encontrada" });
      } else {
        const responseClient = await fetch(
          `http://${
            process.env.CLIENTS_HOST || "127.0.0.1"
          }:3001/api/admin/clients/${clientId}`
        );
        const accounts = await responseClient.json();

        const responseTransacao = await fetch(
          `http://${
            process.env.TRANSACOES_HOST || "127.0.0.1"
          }:3002/api/admin/transactions/${transactionId}`
        );
        const transacoes = await responseTransacao.json();

        const retorno = {
          _id: findById.id,
          status: findById.status,
          dadosPessoais: {
            nome: accounts.dadosPessoais.nome,
            cpf: accounts.dadosPessoais.cpf,
            telefone: accounts.dadosPessoais.telefone,
            rendaMensal: accounts.dadosPessoais.rendaMensal,
          },
          Endereco: accounts.Endereco,
          vencimentoDaFatura: accounts.vencimentoDaFatura,
          // eslint-disable-next-line no-underscore-dangle
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
      const infoAntiFraude = {
        clientId: req.body.clientId,
        transactionId: req.body.transactionId,
        status: "em análise",
      };

      await validarClientId(req.body.clientId);
      await validarTransactionId(req.body.transactionId);

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

      await validarStatus(findAntiFraud, status.toLowerCase());

      await sendQueue(findAntiFraud);
      await consumeQueue(findAntiFraud, status);

      res.status(200).json("Status da análise atualizado com sucesso!");
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

  static deleteAntiFraud = async (req, res) => {
    try {
      const { id } = req.params;
      const deletaAntifraude = await AntiFraud.findByIdAndDelete(id);
      if (!deletaAntifraude) {
        res.status(404).send({ message: "anti fraude nao encontrada" });
      } else {
        res.status(204).send({ message: "anti fraude nao encontrada" });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };
}

export default AntiFraudController;
