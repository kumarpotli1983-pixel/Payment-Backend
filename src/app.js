import express from "express"
import cookieParser from "cookie-parser"
const app = express()

app.use(express.json())
app.use(cookieParser())

//routes
import authRouter from './routes/auth.routes.js'


//secured routes
app.use("/api/auth",authRouter)



export default app