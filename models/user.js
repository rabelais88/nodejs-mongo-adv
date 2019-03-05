const mongodb = require('mongodb');
const { ObjectId } = mongodb;
const { getDb } = require('../util/database');

module.exports = class User {
  constructor(username, email, id) {
    this.name = username,
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  async save() {
    return await getDb().collection('users').insertOne(this);
  }

  static async findById(userId) {
    return await getDb().collection('users')
      .find({ _id: new ObjectId(userId) })
      .next();
  }

  static async findByEmail(email) {
    return await getDb().collection('users')
      .find({ email })
      .next();
  }

  async addToCart(product) {
    const cartProduct = this.cart.items.findIndex(cp => cp._id === product._id);
    const updatedCart = { items: [{ ...product, quantity: 1 }] };
    getDb().collection('users').updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: updatedCart } }
    );
  }
}