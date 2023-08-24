const db = require('../../models');
const Cart = db.Cart;
const CartItem = db.CartItem;
const Product = db.Product;
const Transaction = db.Transaction;
const TransactionItem = db.TransactionItem;

const cartController = {
    createCart: async (req, res) => {
        const { id } = req.user;
      
        try {
          let cart = await Cart.findOne({ where: { userId: id } });
          if (!cart) {
            cart = await Cart.create({ userId: id });
          }
      
          const { productId, quantity } = req.body;
          const product = await Product.findByPk(productId);
          if (!product) {
            return res.status(400).json({ message: "Product not found" });
          }
      
          let cartItem = await CartItem.findOne({
            where: {
              cartId: cart.id,
              productId: productId,
            },
          });
      
          if (!cartItem) {
            cartItem = await CartItem.create({
              cartId: cart.id,
              productId: productId,
              quantity: quantity,
              price: product.harga_produk * quantity,
            });
          } else {
            cartItem.quantity += quantity;
            cartItem.price = product.harga_produk * cartItem.quantity;
            await cartItem.save();
          }
      
          const cartItems = await CartItem.findAll({
            where: {
              cartId: cart.id,
            },
          });
      
          let totalHarga = 0;
          cartItems.forEach((item) => {
            totalHarga += item.price;
          });
      
          cart.totalHarga = totalHarga;
          await cart.save();
      
          return res.status(200).json({ message: "Product added to cart", cartItem, cart });
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
      },  
    removeCartItem: async (req, res) => {
        const { id } = req.user;
        const { productId, quantity} = req.body;

        try{
            let cart = await Cart.findOne({where: {userId: id}});
            if(!cart){
                return res.status(400).json({message: "Cart not found"})
            }
            let cartItem = await CartItem.findOne({
                where: {
                    cartId: cart.id,
                    productId: productId
                }
            })
            if(!cartItem){
                return res.satus(400).json({message: "Product not found"})
            }
            if (quantity <= 0){
                await cartItem.destroy();
            } else {
                const product = await Product.findByPk(productId);
                if(!product){
                    return res.status(400).json({message: "Product not found"})
                }
                cartItem.quantity = +quantity;
                cartItem.price = product.harga_produk * cartItem.quantity
                await cartItem.save()
            }
            const cartIteme = await CartItem.findAll({
                where: {
                    cartId: cart.id
                }
            })
            let totalHarga = 0;
            cartIteme.forEach(item => {
                totalHarga += item.price
            })
            cart.totalHarga = +totalHarga;
            await cart.save();
            return res.status(200).json({message: "Product removed from cart", cartItem, cart});

        }catch(error){
            return res.status(400).json({message: error.message})
        }
    },

    getAllCartItems: async (req, res) => {
        const { id } = req.user;

        try {
            const cart = await Cart.findOne({ where: { userId: id } });
            if (!cart) {
                return res.status(400).json({ message: "Cart not found" });
            }

            const cartItems = await CartItem.findAll({
                where: {
                    cartId: cart.id,
                },
                include: [Product], 
            });

            return res.status(200).json({ cartItems });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },

    checkout: async (req, res) => {
        const { id } = req.user;
        console.log("sjhdfd",id)

        try {
            let cart = await Cart.findOne({ where: { userId: id } });
            if (!cart) {
                return res.status(400).json({ message: "Cart not found" });
            }
            const cartItems = await CartItem.findAll({ where: { cartId: cart.id } });
            let totalPrice = 0;
            
            for (const cartItem of cartItems) {
                totalPrice += cartItem.price;
            }
            
            const transaction = await Transaction.create({
              userId: id,
                totalPrice: totalPrice,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            for (const cartItem of cartItems) {
                await TransactionItem.create({
                    transactionId: transaction.id,
                    productId: cartItem.productId,
                    quantity: cartItem.quantity,
                    price: cartItem.price
                });
            }

            await CartItem.destroy({ where: { cartId: cart.id } });
            cart.totalHarga = 0;
            await cart.save();

            return res.status(200).json({ message: "Checkout successful", transaction });
        } catch (error) {
          console.log(error)
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = cartController