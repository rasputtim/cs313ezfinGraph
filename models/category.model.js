// create a sequelize instance with our local postgres database information.
module.exports = (sequelize, Sequelize) => {

    const Category = sequelize.define('ezfin_category', {
      idcat: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true
    },iduser: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    alias: {
        type: Sequelize.STRING,
        allowNull: false
    },
    icon: {
      type: Sequelize.STRING,
      allowNull: true
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    },
    operation: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
    });

   
    return Category;
}


