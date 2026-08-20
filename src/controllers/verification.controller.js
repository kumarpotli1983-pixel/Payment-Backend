import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

const verifyEmail = asyncHandler(async(req,res)=>{
  const {token} = req.params

  try {
    const decodedToken = await jwt.verify(token,process.env.EMAIL_TOKEN_SECRET)

    const user = await User.findById(decodedToken._id)

    if (!user) {
          throw new ApiError(404,"User not found")
      }

    user.verifiedUser = true;
    await user.save();

    await sendWelcomeEmail(
        user.email,
        user.name
    );

    return res.status(200)
              .json(new ApiResponse(200,{},"Email verification successful. Please login."))
               

  } catch (error) {
    throw new ApiError(401,"Invalid or expired verification link")
  }
})

export {verifyEmail}