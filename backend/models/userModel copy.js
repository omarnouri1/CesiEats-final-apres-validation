import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: true, 
        enum: ['user', 'manager', 'livreur', 'restaurateur', 'servicetechnique', 'serviceCommercial','developtiers'], 
        default: 'user' 
    },
    cartData: { type: Object, default: {} },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
