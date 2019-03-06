const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product' // refer to ProductSchema's id
      },
      quantity: { 
        type: Number,
        required: true
      }
    }] // [String] is also possible
  },
});

userSchema.methods.addToCart = function(product) {
  const cartProductIdx = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
  let = newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIdx >= 0) {
    newQuantity = this.cart.items[cartProductIdx].quantity + 1;
    updatedCartItems[cartProductIdx].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    })
  }
  const updatedCart = {
    items: updatedCartItems
  }
  console.log(updatedCart.items);
  this.cart = updatedCart;
  return this.save();
}

userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
}

module.exports = mongoose.model('User', userSchema);