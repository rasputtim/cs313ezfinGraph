const env = require('./env.js');
 
const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
  protocol: 'postgres',
  dialectOptions: {
      ssl: true
  },
  define: {
    underscored: false,
    freezeTableName: true,
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci'
    },
    timestamps: false
  },
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});
 
const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
//Models/tables
db.category = require('../models/category.model.js')(sequelize, Sequelize);
db.tusuario = require('../models/tusuario.model.js')(sequelize, Sequelize); 
db.transaction = require('../models/transaction.model.js')(sequelize, Sequelize); 
db.balview = require('../models/balview.model.js')(sequelize, Sequelize); 
 
module.exports = db;