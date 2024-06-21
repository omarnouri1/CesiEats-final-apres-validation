import express from 'express';
import { addservicecomercial, listservicecomercial, removeservicecomercial, updateservicecomercial, findservicecomercialByName, getTotalOrders, getTotalEarnings, getOrdersPerDay, getOrdersPerProduct, getTotalItems, getOrdersPerState, upgradeservicecomercial } from '../controllers/servicecomercialController.js';
import multer from 'multer';

const servicecomercialRouter = express.Router();

// Image Storage Engine (Saving Image to uploads folder & rename it)
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

servicecomercialRouter.get("/list", listservicecomercial);
servicecomercialRouter.post("/add", addservicecomercial);
servicecomercialRouter.post("/remove", removeservicecomercial);
servicecomercialRouter.post("/update", updateservicecomercial);
servicecomercialRouter.post("/findByName", findservicecomercialByName);

// Ruta para obtener las estadísticas de pedidos
servicecomercialRouter.get("/statsOrder", async (req, res) => {
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
servicecomercialRouter.get("/statsEarning", async (req, res) => {
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
servicecomercialRouter.get("/statsTotalItems", async (req, res) => {
    try {
        const { startDate, endDate, product } = req.query;
        const totalItems = await getTotalItems(startDate, endDate, product);
        res.json({ success: true, totalItems });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error al obtener las estadísticas de ítems totales" });
    }
});

servicecomercialRouter.get("/ordersPerDay", getOrdersPerDay);
servicecomercialRouter.get("/ordersPerProduct", getOrdersPerProduct);
servicecomercialRouter.get("/ordersPerState", getOrdersPerState);

// Ruta para actualizar el servicecomercial por ID
servicecomercialRouter.put('/upgrade/:id', upload.single('image'), async (req, res) => {
    const id = req.params.id;
    const newData = req.body;

    // Agregar el campo de la imagen si se está subiendo una nueva
    if (req.file) {
        newData.image = req.file.filename;
    }

    try {
        const result = await upgradeservicecomercial(id, newData);
        res.json(result);
    } catch (error) {
        console.error("Error updating servicecomercial:", error);
        res.status(500).json({ success: false, message: "Error updating servicecomercial" });
    }
});

export default servicecomercialRouter;
