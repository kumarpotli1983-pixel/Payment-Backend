import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshTokens = (async(user_id)=>{
  try {
    const user = await User.findById(user_id)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    return {accessToken,refreshToken}
    
  } catch (error) {
    throw new ApiError(500,"Something went wrong!");
  }
})

const registerUser = asyncHandler(async(req,res)=>{
  const { email, password, name } = req.body

  const isExists = await User.findOne({email:email})

  if(isExists) {
    throw new ApiError(400,"Email registered already")
  }

  const user = await User.create({
    email,
    password,
    name
  })

  const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

  return res.status(201)
            .cookie("accessToken",accessToken,{
                httpOnly:true,
                secure:true
              })
            .cookie("refershToken",refreshToken,{
              httpOnly:true,
              secure:true
            })
            .json(new ApiResponse(201,{
              user:{
                _id:user._id,
                email:user.email,
                name:user.name
              },
              accessToken,
              refreshToken
            },
            "User registered Successfully"
            ))
})

export {registerUser}