import express from "express"

const app = express()

//routes
import authRouter from './routes/auth.routes.js'


//secured routes
app.use("/api/auth",authRouter)



export default app