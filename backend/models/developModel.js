import mongoose from "mongoose";

const developSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    localisation: { type: String, required: false },
    image: { type: String, required: false },
    phone:{type:Object,default:"3746379"}
}, { minimize: false })

const developModel = mongoose.models.develop || mongoose.model("develop", developSchema);
export default developModel;