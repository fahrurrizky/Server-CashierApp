const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Transaction extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.TransactionItem, {foreignKey: 'transactionId'});
            this.belongsTo(models.User, {foreignKey: 'userId'});
        }
    }
    Transaction.init(
        {
        userId: DataTypes.INTEGER,
        totalPrice: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    {
        sequelize,
        modelName: 'Transaction',
});
    return Transaction;
}