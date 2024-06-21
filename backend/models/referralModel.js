import mongoose from "mongoose";

const referralSchema = new mongoose.Schema({
    referrerEmail: { type: String, required: true },
    referredEmail: { type: String, required: true },
    token: { type: String, required: true },
    used: { type: Boolean, default: false }
});

const Referral = mongoose.model("Referral", referralSchema);
export default Referral;