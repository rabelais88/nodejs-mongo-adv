const mongodb = require('mongodb');
const { getDb } = require('../util/database');
const cloneDeep = require('lodash/cloneDeep');

class MongoModel {
  constructor(collection, id) {
    if (id) this._id = new mongodb.ObjectId(id);
    this.collection = collection;
  }
  async save() {
    if (!this.collection) throw 'collection not designated';
    const newData = cloneDeep(this);
    delete newData.collection;
    if (this._id) {
      return await getDb().collection(this.collection).updateOne(
        { _id: this._id },
        { $set: newData }
      );
    }
    return await getDb().collection(this.collection).insertOne(newData);
  }
  async fetchAll() {
    return await getDb().collection(this.collection)
      .find()
      .toArray();
  }
  async findById(targetId) {
    return await getDb().collection(this.collection)
      .find({ _id: new mongodb.ObjectId(targetId) }).next();
  }
  async deleteById(targetId) {
    return await getDb().collection(this.collection)
      .deleteOne({ _id: new mongodb.ObjectId(targetId) });
  }
}

module.exports = MongoModel;