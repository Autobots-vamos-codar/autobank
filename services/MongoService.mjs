class MongoService {
  static async findOne(schema, filter) {
    const doc = await schema.findOne(filter);
    console.log(doc);
    return doc;
  }

  static async findMany(schema, filter) {
    const doc = await schema.find(filter);
    console.log(doc);
    return doc;
  }

  static async updateOne(schema, id, update) {
    const doc = await schema.findByIdAndUpdate(id, {$set: update});
    return doc;
  }

  static async updateMany(schema, filter, update) {
    return await schema.updateMany(filter, { $set: update });
  }

  static async deleteOne(schema, id) {
    await schema.findByIdAndDelete(id);
  }

  static async createOne(schema, body ) {
    const doc = new schema({
        ...body,
        createdDate: Date(),
      });
    return await doc.save();
  }

  static async deleteMany(schema, filter) {
    await schema.deleteMany(filter);
  }

  static async findById(id,schema) {
    return await schema.findById(id);
  }
}

export default MongoService;
