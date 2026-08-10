import express from "express"
import cookieParser from "cookie-parser"
const app = express()

app.use(express.json())
app.use(cookieParser())

//routes
import authRouter from './routes/auth.routes.js'
import accountRouter from './routes/account.routes.js'
import transactionRouter from './routes/transaction.routes.js'
//secured routes
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/accounts",accountRouter)
app.use("/api/v1/transactions",transationRouter)


export default app