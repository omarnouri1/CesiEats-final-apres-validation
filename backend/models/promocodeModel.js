import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
    email: { type: String, required: true },
    code: { type: String, required: true, unique: true }
});

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

export default PromoCode;