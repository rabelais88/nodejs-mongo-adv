const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  // _id is automatically added
  title: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  imageUrl: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Product', productSchema);

// const { getDb } = require('../util/database');

// class Product {
//   constructor({title, price, description, imageUrl, id}, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id;
//     this.userId = userId;
//   }
//   async save() {
//     if (this._id) {
//       // Update product
//       return await getDb().collection('products').updateOne(
//         { _id: new mongodb.ObjectId(this._id) }, /* filter */
//         { $set: this } /* actual op */
//       );
//     } else {
//       return await getDb().collection('products').insertOne(this);
//     }
//   }
//   static async fetchAll() {
//     return await getDb().collection('products')
//       .find()
//       .toArray();
//   }
//   static async findById(prodId) {
//     const product = await getDb().collection('products').find({ _id: new mongodb.ObjectId(prodId) }).next()
//     console.log(product);
//     return product;
//   }

//   static async deleteById(prodId) {
//     return await getDb().collection('products').deleteOne({ _id: new mongodb.ObjectId(prodId) });
//   }
// }

// module.exports = Product;