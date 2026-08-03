import app from './app.js'
import dotenv from "dotenv"
import connectToDb from './config/db.js'
dotenv.config({
  path:"./.env"
})

connectToDb()
.then(()=>{
  app.listen(process.env.PORT || 3500,(req,res)=>{
    console.log(`App listening on port ${process.env.PORT}`)
  })
})
.catch((err)=>
{
  console.log("Error Connecting DB : ",err)
})


