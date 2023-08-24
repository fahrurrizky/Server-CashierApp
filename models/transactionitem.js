const {Model}=require('sequelize');
module.exports = (sequelize, DataTypes)=>{
    class TransactionItem extends Model{
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models){
            // define association here
            this.belongsTo(models.Transaction, {foreignKey: 'transactionId'});
            this.belongsTo(models.Product, {foreignKey: 'productId'});
        }
    }
    TransactionItem.init(
        {
            productId: DataTypes.INTEGER,
            transactionId: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER,
            price: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        },
        {
            sequelize,
            modelName: 'TransactionItem',
        }
    )
    return TransactionItem;
}