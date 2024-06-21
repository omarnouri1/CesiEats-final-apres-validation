import express from 'express';
import { getAllLogs, getAllLogDownloads } from '../controllers/logController.js';
import authMiddleware from '../middleware/auth.js';

const logRouter = express.Router();

logRouter.get("/logs",getAllLogs);
logRouter.get("/downloads", getAllLogDownloads);

export default logRouter;