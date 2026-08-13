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

const getUserAccount = asyncHandler(async(req,res)=>{

  const userAccount = await Account.findOne({user:req.user._id})

  if(!userAccount)
  {
    throw new ApiError(403,"User dont have Account")
  }

  return res.status(200)
            .json(new ApiResponse(200,userAccount,"Account fetched successfully"))
})

const getUserAccountBalance = asyncHandler(async(req,res)=>{

  const { accountId } = req.params;

  const account = await Account.findById(accountId)

  if(!account)
  {
    throw new ApiError(400,"Account not found")
  }

  const balance = await account.getBalance()

  return res.status(200)
            .json(new ApiResponse(200,{
              accountId:accountId,
              balance:balance
            },"Balance fetched successfully"))
})
export {
  createAccount,
  getUserAccount,
  getUserAccountBalance
}
