import "dotenv/config";

console.log("SERVER EMAIL:", process.env.USER_EMAIL);

import app from './app.js'
import connectToDb from './config/db.js'


import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

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


