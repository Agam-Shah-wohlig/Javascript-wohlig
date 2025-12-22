const Address = require("../models/address");
const Cart = require("../models/cart");

// ---------------------
// view CHECKOUT
// ---------------------

// Display checkout page
async function HandleGetCheckout(req, res) {
    try {
        if (!req.user) return res.redirect('/auth/login');

        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product')
            .lean();

        if (!cart || cart.items.length === 0) return res.redirect('/cart/view');

        const addresses = await Address.find({ user: req.user._id }).lean();

        const cartItems = cart.items.map(item => ({
            title: item.titleSnapshot || item.product.title,
            image: item.variantSnapshot?.image || item.product.images?.[0] || '/images/default-product.png',
            price: item.variantSnapshot?.discountPrice || item.discountPrice || item.price || 0,
            quantity: item.quantity,
            variant: item.variantSnapshot?.attributes || {}
        }));

        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 500 ? 0 : 50;
        const total = subtotal + shipping;

        res.render("checkout", {
            addresses,
            cartItems,
            subtotal,
            shipping,
            total,
            hasAddresses: addresses.length > 0,
            paymentMethods: [
                { value: 'cod', label: 'Cash on Delivery' },
                { value: 'card', label: 'Credit/Debit Card' },
                { value: 'upi', label: 'UPI' },
                { value: 'wallet', label: 'Wallet' }
            ]
        });

    } catch (error) {
        console.error("Error loading checkout:", error);
        res.status(500).send("Error loading checkout page");
    }
}


// ---------------------
// PROCESS CHECKOUT
// ---------------------

async function HandleProcessCheckout(req, res) {
    try {
        if (!req.user) return res.status(401).json({ error: "Not authenticated" });

        const { shippingAddress, paymentMethod } = req.body;

        if (!shippingAddress) return res.status(400).json({ error: "Please select a shipping address" });

        const address = await Address.findOne({ _id: shippingAddress, user: req.user._id });
        if (!address) return res.status(404).json({ error: "Invalid shipping address" });

        const validPaymentMethods = ['cod', 'card', 'upi', 'wallet'];
        if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({ error: "Please select a valid payment method" });
        }

        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: "Your cart is empty" });
        }

        // Everything validated → redirect frontend to order creation
        res.json({
            success: true,
            redirectUrl: '/order/create'
        });

    } catch (error) {
        console.error("Error processing checkout:", error);
        res.status(500).json({ error: "Error processing checkout" });
    }
}



module.exports = {
    HandleGetCheckout,
    HandleProcessCheckout
};
