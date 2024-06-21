import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
    email: { type: String, required: false },
    porcentage: { type: String, required: false }
})

const discountModel = mongoose.models.discount || mongoose.model("discount", discountSchema);
export default discountModel;