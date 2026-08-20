import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const resetPassword = asyncHandler( async(req,res)=>{
  const { token } = req.params
  const { newPassword, confirmPassword } = req.body

  if(!newPassword || !confirmPassword)
  {
    throw new ApiError(400,'newPassword, confirmPassword both are required')
  }

  if(newPassword!==confirmPassword)
  {
    throw new ApiError(400,'newPassword and confirmPassword are not matching')
  }

  try {
      const decodedToken = jwt.verify(token,process.env.PASSWORD_TOKEN_SECRET)
  
      const user = await User.findById(decodedToken._id)
  
      if(!user)
      {
        throw new ApiError(404,"Token expired or invalid Token")
      }
  
      user.password = newPassword
      await user.save()
  
      return res.status(200)
                .json(new ApiResponse(200,{},"Password changed successfully"))

  } catch (error) {
      throw new ApiError(404,"Token expired or invalid Token")
    }
})

export {resetPassword}