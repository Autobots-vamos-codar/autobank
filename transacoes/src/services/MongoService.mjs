class MongoService {
  static async findOne(schema, filter) {
    const doc = await schema.findById(filter);
    console.log(doc);
    return doc;
  }

  static async findMany(schema, filter) {
    const doc = await schema.find(filter);
    console.log(doc);
    return doc;
  }

  static async updateOne(schema, id, update) {
    const doc = await schema.findByIdAndUpdate(id, { $set: update });
    return doc;
  }

  static async updateMany(schema, filter, update) {
    return await schema.updateMany(filter, { $set: update });
  }

  static async deleteOne(schema, id) {
    await schema.findByIdAndDelete(id);
  }

  static async createOne(schema, body) {
    const doc = new schema({
      ...body,
      createdDate: Date(),
    });
    return await doc.save();
  }

  static async deleteMany(schema, filter) {
    await schema.deleteMany(filter);
  }

  static async findById(id) {
    // return await schema.findById(id);
    const doc = {
      id: '1',
      contaPessoal: {
        cpf: '133.333.333-09',
        email: 'email@email.com',
        telefone: '98727-9980',
        renda_mensal: 10.000,
      },
      Endereco: {
        rua: 'x',
        numero: 123,
        complemento: 'f(x)',
        cep: '3140-090',
        cidade: 'xexein',
        estado: 'mato grosso do sul',
      },
      cartão: {
        numero_cartão: '2334455546669777',
        nome_cartão: 'lilica repilica',
        validade_cartão: '03/09',
        cvc_cartão: 334,
        vencimento_fatura: '30/10',
      },
    };
    return doc;
  }
}

export default MongoService;
