const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CartItem extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Cart, {foreignKey: 'cartId'});
            this.belongsTo(models.Product, {foreignKey: 'productId'});
        }
    }
    CartItem.init({
        productId: DataTypes.INTEGER,
        cartId: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
        price: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    {
        sequelize,
        modelName: 'CartItem',
    })
    return CartItem;
}