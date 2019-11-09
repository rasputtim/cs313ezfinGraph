// create a sequelize instance with our local postgres database information.
module.exports = (sequelize, Sequelize) => {

    const Balanceview = sequelize.define('ezfin_balanceview', {
      idbalview: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    iduser: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    initialdate: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    finaldate: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    keydate: {
      type: Sequelize.DATEONLY,
      allowNull: true
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    fibalbalance: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    iscurrent: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
    });

   
    return Balanceview;
}


