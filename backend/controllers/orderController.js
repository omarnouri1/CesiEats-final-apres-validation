import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import discountModel from "../models/discountModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
    try {
        // Verificar si hay un descuento para el userId
        const userId = req.body.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const userEmail = user.email;

        // Verificar si hay un descuento para el userEmail en discountModel
        const existingDiscount = await discountModel.findOne({ email: userEmail });

        // Crear el nuevo pedido
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });

									   
									   
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {userId} });

        let line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "eur",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        // Calcular el subtotal antes del cargo por entrega
        let subtotalAmount = line_items.reduce((total, item) => total + (item.price_data.unit_amount * item.quantity), 0);

        // Agregar el cargo por entrega
        const deliveryCharge = 5 * 100;

        // Aplicar el descuento si existe
        if (existingDiscount && existingDiscount.email === userEmail) {
            const discountAmount = subtotalAmount * 0.25;
            subtotalAmount -= discountAmount;
            await discountModel.deleteOne({ email: userEmail });
        }

        // Calcular el monto final
        const totalAmount = subtotalAmount + deliveryCharge;

        // Crear una nueva lista de line_items basada en el subtotal después del descuento y el cargo por entrega
        line_items = [{
            price_data: {
                currency: "eur",
                product_data: {
                    name: "Total"
                },
                unit_amount: totalAmount
            },
            quantity: 1
        }];

        const session = await stripe.checkout.sessions.create({
            success_url: `http://localhost:5174/myorders`,
            cancel_url: `http://localhost:5174/myorders`,
            line_items: line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const restaurantName = req.query.restaurantname;
        let orders;

        if (restaurantName) {
            orders = await orderModel.find({ 'items.restaurant': restaurantName });
        } else {
            orders = await orderModel.find({});
        }

        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const listOrders2 = async (req, res) => {
    try {
        const restaurantName = req.query.restaurantname;
        let orders;

        if (restaurantName) {
            orders = await orderModel.find({ status: "Waiting Accept", 'items.restaurant': restaurantName });
        } else {
            orders = await orderModel.find({ status: "Waiting Accept" });
        }

        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const listOrders3 = async (req, res) => {
    try {
        const orders = await orderModel.find({ $or: [{ status: "Waiting for Livreur" }, { status: "Food Processing2" }, { status: "On our way" }] });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const updateStatus = async (req, res) => {
    //console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        res.json({ success: false, message: "Not Verified" });
    }
};

const listOrderStates = async (req, res) => {
    try {
        const orderStates = await orderModel.distinct("address.state");
        res.json({ success: true, data: orderStates });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const receiveOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        // Actualiza el estado del pedido
        await orderModel.findByIdAndUpdate(orderId, { status: 'In process to the client destination' });
        res.json({ success: true, message: 'Order received successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error receiving order' });
    }
};

// Function to update livreurid
const updateLivreurId = async (req, res) => {
    try {
        const { orderId, livreurid } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { livreurid: livreurid });
        res.json({ success: true, message: "Livreur ID Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating livreurid" });
    }
};

const listorders2 = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error occurred in listOrders:", error.message);
        res.status(500).json({ success: false, message: `Error: ${error.message}` });
    }
};

export { 
    placeOrder, 
    listOrders, 
    listOrders2, 
    listOrders3, 
    userOrders, 
    updateStatus, 
    verifyOrder, 
    listOrderStates, 
    receiveOrder, 
    updateLivreurId,
    listorders2 
};
