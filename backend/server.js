import express  from "express"
import cors from 'cors'
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import foodRouter from "./routes/foodRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import discountRouter from "./routes/discountRoute.js"
import restaurantRouter from "./routes/restaurantRoute.js"
import livreurRouter from "./routes/livreurRoute.js"
import promoCodeRoutes from "./routes/promocodeRoute.js"
import developRouter from "./routes/developRoute.js"
import apiRouter from "./routes/apiRoute.js"
import logRouter from "./routes/logRoute.js"
import notificationRouter from "./routes/notificationRoute.js"

import servicetechniqueRouter from "./routes/servicetechniqueRoute.js"
import servicecomercialRouter from "./routes/servicecomercialRoute.js"
import dotenv from 'dotenv';
dotenv.config();
// app config
const app = express()
const port = 4000


// middlewares
app.use(express.json())
app.use(cors())

// db connection
connectDB()

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/food", foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/cart", cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/restaurant",restaurantRouter)
app.use("/api/livreur",livreurRouter)
app.use("/api/develop",developRouter)
app.use("/api/servicetechnique",servicetechniqueRouter)
app.use("/api/servicecomercial",servicecomercialRouter)
app.use("/api/apis",apiRouter)
app.use("/api/log",logRouter)
app.use("/api/notification",notificationRouter)
app.use("/api/promocode", promoCodeRoutes)
app.use("/api/discount",discountRouter)

app.get("/", (req, res) => {
    res.send("API Working")
  });

app.listen(port, () => console.log(`Server started on http://localhost:${port}`))


