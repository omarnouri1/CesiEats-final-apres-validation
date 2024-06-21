import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    action: { type: String, required: true }, // 'login' or 'register'
    role: { type: String, default: 'N/A' },
    email: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    success: { type: Boolean, required: true }
});


const logModel = mongoose.models.og || mongoose.model("log", logSchema);
export default logModel;
