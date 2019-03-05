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
    console.log(this.cart);
    let cartProductIdx = -1;
    if (this.cart) cartProductIdx = this.cart.items.findIndex(cp => cp._id === product._id);
    else this.cart = { items: [] };
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIdx >= 0) {
      newQuantity = this.cart.items[cartProductIdx].quantity + 1;
      updateCartItems[cartProductIdx].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
    }
    const updatedCart = { items: updatedCartItems };
    getDb().collection('users').updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: updatedCart } }
    );
  }
}