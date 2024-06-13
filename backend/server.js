import  express from "express"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.routes.js"
import connectToMongoDB from "./db/connectToMongoDB.js"

const app=express()
const PORT=process.env.PORT||5000

app.use(express.json())
dotenv.config()
app.use("/api/auth",authRoutes)

app.listen(PORT,()=>{
    connectToMongoDB()
    console.log(`Server Running on port ${PORT}`)


})