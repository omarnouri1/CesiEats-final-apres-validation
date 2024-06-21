import discountModel from '../models/discountModel.js';
import fs from 'fs';
// Controlador para crear un nuevo descuento

const createDiscount = async (req, res) => {
    try {
        const { email, percentage } = req.body;


        // Crear una nueva instancia de descuento
        console.log(email);
        console.log(percentage);
        const newDiscount = new discountModel({
            email,
            percentage
        });

        // Guardar el descuento en la base de datos
        const savedDiscount = await newDiscount.save();

        // Devolver respuesta de éxito
        res.status(201).json({ success: true, discount: savedDiscount });
    } catch (error) {
        console.error('Error creating discount:', error);
        res.status(500).json({ success: false, error: 'Failed to create discount' });
    }
};

export { createDiscount };