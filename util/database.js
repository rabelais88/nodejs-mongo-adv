// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'node-complete',
//   password: 'seaqueenlion',
// });

// module.exports = pool.promise();

const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'node-complete',
  'root',
  'seaqueenlion',
  {
    host: 'localhost',
    dialect: 'mysql',
  }
);

module.exports = sequelize;