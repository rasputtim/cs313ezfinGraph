//const { Client } = require('pg');

//const client = new Client ({
//  connectionString: process.env.DATABASE_URL, //HEROKU_POSTGRESQL_OLIVE_URL,
//  ssl: true,
//});

//var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

// create a sequelize instance with our local postgres database information.
const env = require('./env');
 
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

 
//Models/tables
// setup User model and its fields.
//db.tusuarios = require('./tusuario.model')(sequelize, Sequelize);
//module.exports = db;
var User = sequelize.define('ezfin_tusuario', {
  id_usuario: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    primaryKey: true
},
real_name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
},
password: {
    type: Sequelize.STRING,
    allowNull: false
}
}, {
    hooks: {
     beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    }  
});
//functions

User.prototype.validPassword = function(password) {
  //console.log(password);
  //console.log(this.password);
   //https://stackoverflow.com/questions/26643587/comparing-bcrypt-hash-between-php-and-nodejs/26643637
  var hash = this.password.replace('$2y$','$2a$');
  //console.log(hash);
  return bcrypt.compareSync(password, hash);
};
// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = User;

