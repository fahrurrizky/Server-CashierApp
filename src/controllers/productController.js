const db = require('../../models');
const Product = db.Product;
const Category = db.Category;
const { Op } = require('sequelize')
const fs = require('fs').promises
const productController = {
  getProductList: async (req, res) => {
    const { name, harga_produk, categoryId, orderBy, orderByName, page = 1, limit = 12 } = req.query;
    const orderName = orderByName === 'name_asc' ? 'ASC' : 'DESC';
    const orderPrice =  orderBy === 'harga_produk_asc' ? 'ASC' : 'DESC';
    console.log('orderPrice', orderPrice)
    console.log('orderName', orderName)
    const offset = (page - 1) * limit;
  
    try {
      const whereClause = {};
      if (name) {
        whereClause.name = { [Op.like]: `%${name}%` };
      }
      if (categoryId) {
        whereClause.categoryId = categoryId;
      }
      if (harga_produk) {
        // Assuming 'harga_produk' is stored as a numeric field in the database
        whereClause.harga_produk = { [Op.gte]: parseFloat(harga_produk) };
      }
  
      const order = [];
      if (orderByName === 'name_asc' || orderByName === 'name_desc') {
        order.push(['name', orderName]);
      }
      if (orderBy === 'harga_produk_asc' || orderBy === 'harga_produk_desc') {
        order.push(['harga_produk', orderPrice]);
      } else {
        // Default sorting when no valid orderBy parameter is provided
        order.push(['createdAt', 'DESC']);
      }
  
      const productList = await Product.findAll({
        where: whereClause,
        include: {
          model: Category,
          // as: 'Category',
        },
        order,
        limit,
        offset,
      });
  
      return res.status(200).json({ page, limit, productList });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
    

createdProduct: async (req, res) => {
    const { name, categoryId, harga_produk, quantity, description } = req.body;
  
    try {
      await db.sequelize.transaction(async (t) => {
        const productImg = req.file.path;
        const result = await Product.create({
          name,
          categoryId,
          productImg,
          harga_produk,
          quantity,
          description
        }, { transaction: t });
        return res.status(200).json({ message: "Product created", result });
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const {
        name,
        categoryId,
        harga_produk,
        quantity,
        description,
        isActive,
      } = req.body;
  
      const updatedFields = {
        name,
        categoryId,
        harga_produk,
        quantity,
        description,
        isActive,
      };
  
      // Handle the product image update separately, only if there's a new image
      if (req.file) {
        updatedFields.productImg = req.file.path;
      }
  
      const updatedProduct = await Product.update(updatedFields, {
        where: { id: productId },
      });
  
      if (updatedProduct[0] === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json({
        message: "Product updated successfully", updatedProduct
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update product", error: error.message });
    }
  },
  
  activateProduct: async (req, res) => {
    try {
      const productId = req.query.id;
      await db.sequelize.transaction(async (t) => {
        const product = await Product.update(
          { isActive: true },
          { where: { id: productId }, transaction: t }
        );
        res.status(200).json({ message: "Product activated" });
      })
    }catch (error) {
      return res.status(400).json({ message: error.message });
    }},

    deactiveProduct: async (req, res) => {
      try {
        const productId = req.query.id;
        await db.sequelize.transaction(async (t) => {
          const product = await Product.update(
            { isActive: false },
            { where: { id: productId }, transaction: t }
          );
          res.status(200).json({ message: "Product deactivated" });
        })
      }catch (error) {
        return res.status(400).json({ message: error.message });
      }},
    addProductCategory: async (req, res) => {
      const { name } = req.body; 
      try {
        const adaCategory = await Category.findOne({
          where: {
            name
          }
        });
        if (adaCategory) {
          return res.status(400).json({ message: "Product category already exists" });
        }
        const newCategory = await Category.create({ name });
        return res.status(200).json({ message: "Product category added", category: newCategory });
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    },

    editProductCategory: async (req, res) => {
      const { id } = req.params;
      const { name } = req.body;
    
      try {
        const existingCategory = await Category.findByPk(id);
        if (!existingCategory) {
          return res.status(404).json({ message: "Product category not found" });
        }
    
        await existingCategory.update({ name });
        return res.status(200).json({ message: "Product category updated", category: existingCategory });
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    },
    
    deleteProductCategory: async (req, res) => {
      const { id } = req.params;
    
      try {
        const existingCategory = await Category.findByPk(id);
        if (!existingCategory) {
          return res.status(404).json({ message: "Product category not found" });
        }
    
        await existingCategory.destroy();
        return res.status(200).json({ message: "Product category deleted" });
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    },
    getCategory: async (req, res) => {
      try {
        const result = await Category.findAll();
        return res.status(200).json({ message: "success", result });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    }
};

module.exports = productController;