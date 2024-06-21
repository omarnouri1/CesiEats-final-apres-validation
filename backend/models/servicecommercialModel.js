import mongoose from "mongoose";

const servicecomercialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    localisation: { type: String, required: false },
    image: { type: String, required: false },
    phone:{type:Object,default:"3746379"}
}, { minimize: false })

const servicecomercialModel = mongoose.models.servicecomercial || mongoose.model("servicecomercial", servicecomercialSchema);
export default servicecomercialModel;