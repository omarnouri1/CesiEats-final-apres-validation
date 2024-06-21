import express from 'express';
import { createDiscount } from '../controllers/discountController.js';
import authMiddleware from '../middleware/auth.js';

const discountRouter = express.Router();

discountRouter.post("/create",createDiscount);

export default discountRouter;