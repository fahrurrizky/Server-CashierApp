const db = require('../../models');
const { Op } = require('sequelize');
const Transaction = db.Transaction;
const TransactionItem = db.TransactionItem;
const Product = db.Product;

const createReport = {
  getDaily: async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
      const dailySales = await Transaction.findAll({
        where: {
          createdAt: {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          },
        },
        attributes: [
          [db.Sequelize.fn('date', db.Sequelize.col('createdAt')), 'transactionDate'],
          [db.Sequelize.fn('sum', db.Sequelize.col('totalPrice')), 'totalPrice'],
        ],
        group: [db.Sequelize.fn('date', db.Sequelize.col('createdAt'))],
      });

      return res.status(200).json({ data: dailySales });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  getProductSold: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const productSold = await TransactionItem.findAll({
        include: [
          {
            model: Transaction,
            where: {
              createdAt: {
                [db.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)],
              },
            },
          },
          { model: Product },
        ],
        attributes: [
          'productId',
          [db.Sequelize.fn('sum', db.Sequelize.col('transactionitem.quantity')), 'totalQuantity'],
        ],
        group: ['productId', 'Transaction.id'], // Menambahkan 'Transaction.id' ke dalam klausa GROUP BY
      });
  
      return res.status(200).json({ productSold });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  getDailySalesAggregate: async (req, res) => {
    try {
      const dailySales = await Transaction.findAll({
        attributes: [
          [db.Sequelize.fn('date', db.Sequelize.col('createdAt')), 'transactionDate'],
          [db.Sequelize.fn('sum', db.Sequelize.col('totalPrice')), 'totalSales'],
        ],
        group: [db.Sequelize.fn('date', db.Sequelize.col('createdAt'))],
      });
  
      return res.status(200).json({ data: dailySales });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

module.exports = createReport;
