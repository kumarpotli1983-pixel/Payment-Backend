import jwt from "jsonwebtoken"
import { asyncHandler } from "./asyncHandler.js"

const generateVerificationToken = ((userId, secret, expiresIn)=>{
  return jwt.sign(
    { _id:userId},
    secret,
    { expiresIn }
  )
})

export {generateVerificationToken}