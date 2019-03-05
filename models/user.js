const mongodb = require('mongodb');
const { ObjectId } = mongodb;
const { getDb } = require('../util/database');

module.exports = class User {
  constructor(username, email, cart, id) {
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
    let cartProductIdx = -1;
    cartProductIdx = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString()
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIdx >= 0) {
      newQuantity = this.cart.items[cartProductIdx].quantity + 1;
      updatedCartItems[cartProductIdx].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
    }
    const updatedCart = { items: updatedCartItems };
    getDb().collection('users').updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: updatedCart } }
    );
  }

  async getCart() {
    const productIds = this.cart.items.map(i => i.productId);
    const products = await getDb().collection('products')
      .find( { _id: { $in: productIds } })
      .toArray();
    return products.map(p => ({ ...p, quantity: this.cart.items.find(i => i.productId.toString() === p._id.toString()).quantity }));
  }

  async deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(i => {
      return i.productId.toString() !== productId.toString()
    });
    return await getDb().collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }
}