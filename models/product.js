const mongodb = require('mongodb');
const { getDb } = require('../util/database');

class Product {
  constructor({title, price, description, imageUrl, id}) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
  }
  async save() {
    if (this._id) {
      // Update product
      console.log(this);
      return await getDb().collection('products').updateOne(
        { _id: new mongodb.ObjectId(this._id) }, /* filter */
        { $set: this } /* actual op */
      );
    } else {
      return await getDb().collection('products').insertOne(this);
    }
  }
  static async fetchAll() {
    return await getDb().collection('products')
      .find()
      .toArray();
  }
  static async findById(prodId) {
    const product = await getDb().collection('products').find({ _id: new mongodb.ObjectId(prodId) }).next()
    console.log(product);
    return product;
  }

  static async deleteById(prodId) {
    return await getDb().collection('products').deleteOne({ _id: new mongodb.ObjectId(prodId) });
  }
}
// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Product = sequelize.define('product', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
// });

module.exports = Product;