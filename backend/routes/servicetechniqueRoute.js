import express from 'express';
import { addservicetechnique, listservicetechnique, removeservicetechnique, updateservicetechnique, findservicetechniqueByName, getTotalOrders, getTotalEarnings, getOrdersPerDay, getOrdersPerProduct, getTotalItems, getOrdersPerState, upgradeservicetechnique } from '../controllers/servicetechniqueController.js';
import multer from 'multer';

const servicetechniqueRouter = express.Router();

// Image Storage Engine (Saving Image to uploads folder & rename it)
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

servicetechniqueRouter.get("/list", listservicetechnique);
servicetechniqueRouter.post("/add", addservicetechnique);
servicetechniqueRouter.post("/remove", removeservicetechnique);
servicetechniqueRouter.post("/update", updateservicetechnique);
servicetechniqueRouter.post("/findByName", findservicetechniqueByName);

// Ruta para obtener las estadísticas de pedidos
servicetechniqueRouter.get("/statsOrder", async (req, res) => {
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
servicetechniqueRouter.get("/statsEarning", async (req, res) => {
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
servicetechniqueRouter.get("/statsTotalItems", async (req, res) => {
    try {
        const { startDate, endDate, product } = req.query;
        const totalItems = await getTotalItems(startDate, endDate, product);
        res.json({ success: true, totalItems });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error al obtener las estadísticas de ítems totales" });
    }
});

servicetechniqueRouter.get("/ordersPerDay", getOrdersPerDay);
servicetechniqueRouter.get("/ordersPerProduct", getOrdersPerProduct);
servicetechniqueRouter.get("/ordersPerState", getOrdersPerState);

// Ruta para actualizar el servicetechnique por ID
servicetechniqueRouter.put('/upgrade/:id', upload.single('image'), async (req, res) => {
    const id = req.params.id;
    const newData = req.body;

    // Agregar el campo de la imagen si se está subiendo una nueva
    if (req.file) {
        newData.image = req.file.filename;
    }

    try {
        const result = await upgradeservicetechnique(id, newData);
        res.json(result);
    } catch (error) {
        console.error("Error updating servicetechnique:", error);
        res.status(500).json({ success: false, message: "Error updating servicetechnique" });
    }
});

export default servicetechniqueRouter;
