const mongodb = require('mongodb');
const { getDb } = require('../util/database');
const MongoModel = require('./model-mongo');
const cloneDeep = require('lodash/cloneDeep');

class User extends MongoModel {
  constructor(username, email) {
    super('user', null);
    this.username = username;
    this.email = email;
  }
  async save() {
    const user = await getDb().collection(this.collection).find({ email: this.email }).next();
    const newUser = cloneDeep(this);
    delete newUser.collection;
    if (user) {
      return await getDb().collection(this.collection).updateOne(
        { email: this.email },
        { $set: newUser }
      );
    } else {
      return await getDb().collection(this.collection).insertOne(newUser);
    }
  }
  static async findByEmail(email) {
    return await getDb().collection('user').find({ email }).next();
  }
}

// class User {
//   constructor(username, email) {
//     this.name = username;
//     this.email = email;
//   }
//   async save() {
//     if (this.email) {
//       return await getDb().collection('users').updateOne(
//         { email },
//         { $set: this }
//       );
//     } else {
//       return await getDb().collection('users').insertOne(this);
//     }
//   }
//   static async findById(userId) {
//     const user = await getDb()
//       .collection('users')
//       .find({ _id: new mongodb.ObjectId(userId) })
//       .next();
//     console.log(user);
//     return user;
//   }
// }

module.exports = User;