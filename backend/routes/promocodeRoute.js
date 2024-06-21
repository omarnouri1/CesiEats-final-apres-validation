import express from 'express';
import PromoCode from '../models/promocodeModel.js';

const router = express.Router();

router.post('/validate', async (req, res) => {
    const { code } = req.body;

    try {
        const promo = await PromoCode.findOne({ code: code });

        if (promo) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Invalid promo code' });
        }
    } catch (error) {
        console.error('Error validating promo code:', error);
        res.json({ success: false, message: 'Error validating promo code' });
    }
});

export default router;