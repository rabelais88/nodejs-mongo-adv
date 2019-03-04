const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const { user, pw } = require('../settings');

let _db;
let _client;
module.exports = class mongoConnect {
  constructor() {
    return (async () => {
      _client = await MongoClient.connect(`mongodb+srv://${user}:${pw}@cluster0-xuqfn.mongodb.net/shop?retryWrites=true`);
      console.log('db connected');
      _db = await _client.db('shop');
      return _db;
    })();
  }
  static getDb () {
    if (_db) return _db;
    throw 'No database found';
  }
};