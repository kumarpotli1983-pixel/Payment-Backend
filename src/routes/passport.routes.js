import { Router } from "express"
import passport from "../config/passport.js"

const router = Router()

router.get("/google",passport.authenticate("google",{scope:['profile','email']}))

router.get("/google/callback",passport.authenticate("google",{failureRedirect : "/login"}),(req,res)=>{
  console.log("Authenticated")
  return res.status(200)
             .json({
              message:"User LoggedIn Successfully",
              user:req.user
             })
})

export default router