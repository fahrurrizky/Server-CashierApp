const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.CartItem, {foreignKey: 'cartId'});
            this.belongsTo(models.User, {foreignKey: 'userId'});
        }
    }
    Cart.init({
        userId: DataTypes.INTEGER,
        totalHarga: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    {
        sequelize,
        modelName: 'Cart',
    })
    return Cart;
}