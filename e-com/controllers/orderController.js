// const Order = require("../models/order");
// const Cart = require("../models/cart");
// const Address = require("../models/address"); // assumes you have an address model


// ----------------------
// CREATE ORDER
// ----------------------
// async function HandleCreateOrder(req, res) {
//     try {
//         const userId = req.user?._id || "64f123456789abcdef000001"; // replace TEMP id in production
//         const { shippingAddressId, paymentMethod } = req.body;

//         // 1️⃣ Validate required fields
//         if (!shippingAddressId || !paymentMethod) {
//             return res.status(400).json({ error: "Shipping address and payment method are required" });
//         }

//         // 2️⃣ Validate address exists
//         const address = await Address.findById(shippingAddressId);
//         if (!address) return res.status(404).json({ error: "Shipping address not found" });

//         // 3️⃣ Fetch cart
//         const cart = await Cart.findOne({ user: userId });
//         if (!cart || cart.items.length === 0) {
//             return res.status(400).json({ error: "Cart is empty" });
//         }

//         // 4️⃣ Map cart items to order items
//         const orderItems = cart.items.map(cartItem => ({
//             product: cartItem.product,
//             variantId: cartItem.variantId,
//             sku: cartItem.sku || "N/A",
//             titleSnapshot: cartItem.titleSnapshot || "Product Name",
//             variantSnapshot: cartItem.variantSnapshot || {},
//             quantity: cartItem.quantity || 1,
//             price: cartItem.price || 0,
//             discountPrice: cartItem.discountPrice || 0,
//             finalPrice: cartItem.finalPrice || (cartItem.discountPrice || cartItem.price || 0),
//         }));

//         // 5️⃣ Compute totals safely
//         const totalAmount = orderItems.reduce((sum, item) => sum + (item.finalPrice || 0) * (item.quantity || 0), 0);
//         const totalDiscount = orderItems.reduce((sum, item) => 
//             sum + ((item.price || 0) - (item.discountPrice || item.price || 0)) * (item.quantity || 0),
//             0
//         );

//         // 6️⃣ Create order
//         const order = new Order({
//             user: userId,
//             items: orderItems,
//             totalAmount,
//             totalDiscount,
//             shippingAddress: shippingAddressId,
//             paymentMethod,
//         });

//         await order.save();

//         // 7️⃣ Clear the cart
//         cart.items = [];
//         await cart.save();

//         res.status(201).json({ success: true, order });

//     } catch (err) {
//         console.error("Error creating order:", err);
//         res.status(500).json({ error: "Server error" });
//     }
// }

const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Address = require("../models/address");

// ----------------------
// CREATE ORDER WITHOUT TRANSACTIONS
// ----------------------
async function HandleCreateOrder(req, res) {
    try {
        const userId = req.user?._id || "64f123456789abcdef000001"; // TEMP
        const { shippingAddressId, paymentMethod } = req.body;

        // 1️⃣ Validate required fields
        if (!shippingAddressId || !paymentMethod) {
            return res.status(400).json({ error: "Shipping address and payment method are required" });
        }

        // 2️⃣ Validate address
        const address = await Address.findById(shippingAddressId);
        if (!address) {
            return res.status(404).json({ error: "Shipping address not found" });
        }

        // 3️⃣ Fetch cart
        const cart = await Cart.findOne({ user: userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        // 4️⃣ Check stock and prepare order items
        const orderItems = [];

        for (const cartItem of cart.items) {
            const product = await Product.findById(cartItem.product);
            if (!product) {
                return res.status(404).json({ error: `Product ${cartItem.titleSnapshot} not found` });
            }

            const variant = product.variants.id(cartItem.variantId);
            if (!variant) {
                return res.status(404).json({ error: `Variant not found for ${cartItem.titleSnapshot}` });
            }

            if (cartItem.quantity > variant.stock) {
                return res.status(400).json({ 
                    error: `Only ${variant.stock} items available for ${cartItem.titleSnapshot}` 
                });
            }

            // Deduct stock
            variant.stock -= cartItem.quantity;
            await product.save(); // Save updated stock

            // Prepare order item
            orderItems.push({
                product: cartItem.product,
                variantId: cartItem.variantId,
                sku: cartItem.sku || "N/A",
                titleSnapshot: cartItem.titleSnapshot || "Product Name",
                variantSnapshot: cartItem.variantSnapshot || {},
                quantity: cartItem.quantity || 1,
                price: cartItem.price || 0,
                discountPrice: cartItem.discountPrice || 0,
                finalPrice: cartItem.finalPrice || (cartItem.discountPrice || cartItem.price || 0),
            });
        }

        // 5️⃣ Compute totals
        const totalAmount = orderItems.reduce((sum, item) => sum + (item.finalPrice || 0) * (item.quantity || 0), 0);
        const totalDiscount = orderItems.reduce((sum, item) =>
            sum + ((item.price || 0) - (item.discountPrice || item.price || 0)) * (item.quantity || 0),
            0
        );

        // 6️⃣ Create order
        const order = new Order({
            user: userId,
            items: orderItems,
            totalAmount,
            totalDiscount,
            shippingAddress: shippingAddressId,
            paymentMethod,
            status: "pending",
        });

        await order.save();

        // 7️⃣ Clear cart
        cart.items = [];
        cart.totalItems = 0;
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({ success: true, order });

    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = {
    HandleCreateOrder
};



// ----------------------
// VIEW USER ORDERS
// ----------------------
async function HandleViewOrders(req, res) {
    try {
        const userId = "64f123456789abcdef000001"; // TEMP

        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("shippingAddress"); // populate shipping address details

        res.render("ordersList", { orders }); // create ordersList.ejs
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).send("Error fetching orders");
    }
}

// ----------------------
// VIEW ORDER DETAILS
// ----------------------
async function HandleViewOrderDetails(req, res) {
    try {
        const { orderId } = req.params;
        const userId = "64f123456789abcdef000001"; // TEMP

        const order = await Order.findOne({ _id: orderId, user: userId })
            .populate("shippingAddress");

        if (!order) return res.status(404).send("Order not found");

        res.render("orderDetails", { order }); // create orderDetails.ejs
    } catch (err) {
        console.error("Error fetching order details:", err);
        res.status(500).send("Error fetching order details");
    }
}

// ----------------------
// UPDATE ORDER STATUS (Admin)
// ----------------------
async function HandleUpdateOrderStatus(req, res) {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!["pending","confirmed","shipped","delivered","cancelled"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });

        order.status = status;
        await order.save();

        res.json({ success: true, order });
    } catch (err) {
        console.error("Error updating order status:", err);
        res.status(500).json({ error: "Server error" });
    }
}

async function HandleCancelOrder(req, res) {
    try {
        const { orderId } = req.params;

        // 1. Fetch order
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });

        // 2. Check if already shipped or delivered
        if (["shipped", "delivered"].includes(order.status)) {
            return res.status(400).json({ error: `Cannot cancel an order that is ${order.status}` });
        }

        // 3. Check if already cancelled
        if (order.status === "cancelled") {
            return res.status(400).json({ error: "Order is already cancelled" });
        }

        // 4. Cancel the order
        order.status = "cancelled";
        await order.save();

        // 5. TODO: trigger side effects like refund, inventory restock, notifications
        // Example: await refundService.processRefund(order);

        res.json({ success: true, order, message: "Order cancelled successfully" });

    } catch (err) {
        console.error("Error cancelling order:", err);
        res.status(500).json({ error: "Server error" });
    }
}



module.exports = {
    HandleCreateOrder,
    HandleViewOrders,
    HandleViewOrderDetails,
    HandleUpdateOrderStatus,
    HandleCancelOrder
};
