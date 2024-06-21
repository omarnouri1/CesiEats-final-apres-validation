import express from 'express';
import { addlivreur, listlivreur, removelivreur, updatelivreur, findlivreurByName, getTotalOrders, getTotalEarnings, getOrdersPerDay, getOrdersPerProduct, getTotalItems, getOrdersPerState, upgradeLivreur } from '../controllers/livreurController.js';
import multer from 'multer';

const livreurRouter = express.Router();

// Image Storage Engine (Saving Image to uploads folder & rename it)
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

livreurRouter.get("/list", listlivreur);
livreurRouter.post("/add", addlivreur);
livreurRouter.post("/remove", removelivreur);
livreurRouter.post("/update", updatelivreur);
livreurRouter.post("/findByName", findlivreurByName);

// Ruta para obtener las estadísticas de pedidos
livreurRouter.get("/statsOrder", async (req, res) => {
    try {
        const { startDate, endDate, product } = req.query;
        const totalOrders = await getTotalOrders(startDate, endDate, product);
        res.json({ success: true, totalOrders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error al obtener las estadísticas de pedidos" });
    }
});

// Ruta para obtener las estadísticas de ingresos filtrados por fecha y producto
livreurRouter.get("/statsEarning", async (req, res) => {
    try {
        const { startDate, endDate, product } = req.query;
        const totalEarnings = await getTotalEarnings(startDate, endDate, product);
        res.json({ success: true, totalEarnings });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error al obtener las estadísticas de ingresos" });
    }
});

// Ruta para obtener las estadísticas de ítems totales filtrados por fecha y producto
livreurRouter.get("/statsTotalItems", async (req, res) => {
    try {
        const { startDate, endDate, product } = req.query;
        const totalItems = await getTotalItems(startDate, endDate, product);
        res.json({ success: true, totalItems });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error al obtener las estadísticas de ítems totales" });
    }
});

livreurRouter.get("/ordersPerDay", getOrdersPerDay);
livreurRouter.get("/ordersPerProduct", getOrdersPerProduct);
livreurRouter.get("/ordersPerState", getOrdersPerState);

// Ruta para actualizar el livreur por ID
livreurRouter.put('/upgrade/:id', upload.single('image'), async (req, res) => {
    const id = req.params.id;
    const newData = req.body;

    // Agregar el campo de la imagen si se está subiendo una nueva
    if (req.file) {
        newData.image = req.file.filename;
    }

    try {
        const result = await upgradeLivreur(id, newData);
        res.json(result);
    } catch (error) {
        console.error("Error updating livreur:", error);
        res.status(500).json({ success: false, message: "Error updating livreur" });
    }
});

export default livreurRouter;
