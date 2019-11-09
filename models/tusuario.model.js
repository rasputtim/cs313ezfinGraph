var bcrypt = require('bcrypt');
// create a sequelize instance with our local postgres database information.
module.exports = (sequelize, Sequelize) => {

    const User = sequelize.define('ezfin_tusuario', {
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

    User.prototype.validPassword = function(password) {
      //console.log(password);
      //console.log(this.password);
       //https://stackoverflow.com/questions/26643587/comparing-bcrypt-hash-between-php-and-nodejs/26643637
      var hash = this.password.replace('$2y$','$2a$');
      //console.log(hash);
      return bcrypt.compareSync(password, hash);
    };
    return User;
}


