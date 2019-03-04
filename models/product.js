const mongodb = require('mongodb');
const { getDb } = require('../util/database');

class Product {
  constructor({title, price, description, imageUrl}) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._db = db;
  }
  async save() {
    return await getDb().collection('products').insertOne(this);
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