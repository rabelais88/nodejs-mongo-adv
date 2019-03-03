const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const { user, pw } = require('../settings');

module.exports = async function () {
  try {
    const client = await MongoClient.connect(`mongodb+srv://${user}:${pw}@cluster0-xuqfn.mongodb.net/test?retryWrites=true`);
    console.log('db connected');
    return client;
  } catch(e) {
    console.log('db connection error');
  }
};