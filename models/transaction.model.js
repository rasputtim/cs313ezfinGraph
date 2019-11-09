// create a sequelize instance with our local postgres database information.
module.exports = (sequelize, Sequelize) => {

    const Transaction = sequelize.define('ezfin_transactions', {
      idtransaction: {
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
    duedate: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    idcategory: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    amount: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    paymentdate: {
      type: Sequelize.DATEONLY,
      allowNull: true
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    modificationdatetime: {
      type: Sequelize.DATE,
      allowNull: true
    }
    });

   
    return Transaction;
}


