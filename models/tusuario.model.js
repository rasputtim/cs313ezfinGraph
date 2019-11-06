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
      },
      instanceMethods: {
        validPassword: function(password) {
          return bcrypt.compareSync(password, this.password);
        }
      }    
  });

  return User;
}