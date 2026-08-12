import { asyncHandler } from "../utils/asyncHandler.js";
import { Account } from "../models/account.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createAccount = asyncHandler(async(req,res)=>{

  const user = req?.user

  const userAccountExists = await Account.findOne({user:req.user._id})

  if(userAccountExists)
  {
    throw new ApiError(409,"User Account exists already")
  }

  const account = await Account.create({
    user:user._id,
    username:req.user.name
  })

  res.status(201)
     .json(new ApiResponse(201,account,"account created succesfully"))
})

export {createAccount}
