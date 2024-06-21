import foodModel from "../models/foodModel.js";
import fs from 'fs'

// all food list
// all food list
const listFood = async (req, res) => {
    const { name } = req.query; // obtener el email de la consulta

    try {
        const filter = name ? { restaurant: name } : {}; // si hay email, filtrar por restaurante
        const foods = await foodModel.find(filter);
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}


// add food
const addFood = async (req, res) => {

    let image_filename = `${req.file.filename}`

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category:req.body.category,
        restaurant: req.body.restaurant,
        image: image_filename,
    })
    try {
        await food.save();
        res.json({ success: true, message: "Food Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// delete food
const removeFood = async (req, res) => {
    try {

        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => { })

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Food Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

const updateFood = async (req, res) => {
    try {
        const { id, name, description, price, category, restaurant } = req.body;
        const food = await foodModel.findById(id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }

        // Actualizar los campos
        food.name = name || food.name;
        food.description = description || food.description;
        food.price = price || food.price;
        food.category = category || food.category;
        food.restaurant = restaurant || food.restaurant;
        
        // Si se proporciona una nueva imagen, actualizarla
        if (req.file) {
            // Eliminar la imagen antigua
            fs.unlink(`uploads/${food.image}`, () => {});
            food.image = req.file.filename;
        }

        await food.save();
        res.json({ success: true, message: "Food updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error updating food" });
    }
}

export { listFood, addFood, removeFood,updateFood }