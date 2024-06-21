import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    localisation: { type: String, required: false },
    image: { type: String, required: false },
    phone:{type:String,default:"3746379"}
}, { minimize: false })

const restaurantModel = mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema);
export default restaurantModel;