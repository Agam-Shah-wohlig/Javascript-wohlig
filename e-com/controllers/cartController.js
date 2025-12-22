const Cart = require("../models/cart");
const Product = require("../models/product");

async function HandleAddToCart(req, res) {
  try {
    const { productId, variantId, quantity } = req.body;
    const userId = req.user?._id;

    if (!productId || !variantId || quantity < 1) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ error: "Variant not found" });

    // check Out-Of-Stock 
    if (quantity > variant.stock) {
      return res.status(400).json({
        error: `Only ${variant.stock} items available`
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.variantId.equals(variant._id)
    );

    // const finalPrice = variant.discountPrice || variant.price;

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > variant.stock) {
        return res.status(400).json({
          error: `Only ${variant.stock} items available`
        });
      }

      existingItem.quantity = newQty;
    } else {
      cart.items.push({
        product: product._id,
        variantId: variant._id,
        sku: variant.sku,
        titleSnapshot: product.title,
        variantSnapshot: Object.fromEntries(variant.attributes), // convert Map/entries to plain object
        quantity,
        price: variant.price,
        discountPrice: variant.discountPrice || 0,
        finalPrice: variant.discountPrice || variant.price
    });
    }

    // 🔢 Recalculate totals
    cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, i) => sum + i.finalPrice * i.quantity, 0);

    await cart.save();
    res.json({ success: true, cart });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}


async function HandleViewCart(req, res) {
    try {
        const userId = req.user?._id;
        if (!userId) {
          return res.redirect("/auth/login") ;
        }
        const cart = await Cart.findOne({ user: userId }) || { items: [] };

        // Compute total using finalPrice
        cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.finalPrice || 0) * item.quantity, 0);

        res.render('viewCart', { cart });
    } catch (err) {
        console.error('Error loading cart:', err);
        res.status(500).send('Error loading cart');
    }
}


async function HandleUpdateCartItem(req, res) {
  try {
    const { itemId, quantity } = req.body;
    const userId = req.user?._id;

    if (quantity < 1) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    const product = await Product.findById(item.product);
    const variant = product?.variants.id(item.variantId);

    if (!variant || quantity > variant.stock) {
      return res.status(400).json({
        error: `Only ${variant?.stock || 0} items available`
      });
    }

    item.quantity = quantity;

    cart.totalItems = cart.items.reduce((s, i) => s + i.quantity, 0);
    cart.totalPrice = cart.items.reduce(
      (s, i) => s + i.finalPrice * i.quantity,
      0
    );

    await cart.save();
    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}


async function HandleDeleteCartItem(req, res) {
  try {
    const { itemId } = req.body;
    const userId = req.user?._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(i => i._id.toString() !== itemId);

    cart.totalItems = cart.items.reduce((s, i) => s + i.quantity, 0);
    cart.totalPrice = cart.items.reduce(
      (s, i) => s + i.finalPrice * i.quantity,
      0
    );

    await cart.save();
    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}


module.exports = {
    HandleAddToCart,
    HandleViewCart,
    HandleUpdateCartItem,
    HandleDeleteCartItem
};
