import express from 'express';
import { adddevelop, listdevelop, removedevelop, updatedevelop, finddevelopByName, getTotalOrders, getTotalEarnings, getOrdersPerDay, getOrdersPerProduct, getTotalItems, getOrdersPerState, upgradedevelop } from '../controllers/developController.js';
import multer from 'multer';

const developRouter = express.Router();

// Image Storage Engine (Saving Image to uploads folder & rename it)
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

developRouter.get("/list", listdevelop);
developRouter.post("/add", adddevelop);
developRouter.post("/remove", removedevelop);
developRouter.post("/update", updatedevelop);
developRouter.post("/findByName", finddevelopByName);

// Ruta para obtener las estadísticas de pedidos
developRouter.get("/statsOrder", async (req, res) => {
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
developRouter.get("/statsEarning", async (req, res) => {
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
developRouter.get("/statsTotalItems", async (req, res) => {
    try {
        const { startDate, endDate, product } = req.query;
        const totalItems = await getTotalItems(startDate, endDate, product);
        res.json({ success: true, totalItems });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error al obtener las estadísticas de ítems totales" });
    }
});

developRouter.get("/ordersPerDay", getOrdersPerDay);
developRouter.get("/ordersPerProduct", getOrdersPerProduct);
developRouter.get("/ordersPerState", getOrdersPerState);

// Ruta para actualizar el develop por ID
developRouter.put('/upgrade/:id', upload.single('image'), async (req, res) => {
    const id = req.params.id;
    const newData = req.body;

    // Agregar el campo de la imagen si se está subiendo una nueva
    if (req.file) {
        newData.image = req.file.filename;
    }

    try {
        const result = await upgradedevelop(id, newData);
        res.json(result);
    } catch (error) {
        console.error("Error updating develop:", error);
        res.status(500).json({ success: false, message: "Error updating develop" });
    }
});

export default developRouter;
