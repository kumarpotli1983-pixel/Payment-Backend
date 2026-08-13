import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { sendRegistrationEmail } from "../services/email.service.js"
import { TokenBlacklist } from "../models/blackList.model.js"

const generateAccessAndRefreshTokens = async(userId)=>{
  try {
    const user = await User.findById(userId)

    if (!user) {
    throw new ApiError(404, "User not found")
    }

    const accessToken = await  user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken 
    await user.save({validateBeforeSave : false})

    return {accessToken,refreshToken}
    
  } catch (error) {
    throw new ApiError(500,"Something went wrong!");
  }
}

const registerUser = asyncHandler(async(req,res)=>{
  const { email, password, name } = req.body

  if([email,password,name].some((field)=>!field || field.trim()===""))
  {
    throw new ApiError(400,"All fields are required")
  }

  const existingUser = await User.findOne({email})

  if(existingUser) {
    throw new ApiError(409,"Email registered already")
  }

  const user = await User.create({
    email,
    password,
    name
  })

  const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

  const options={
    httpOnly : true,
    secure : true
  }

  res.status(201)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
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
    
  await sendRegistrationEmail(email,name);
})

const loginUser = asyncHandler(async(req,res)=>{
  const { email,password } = req.body

  if ([email, password].some(field => !field || field.trim() === "")) 
  {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({email}).select("+password")

  if(!user)
  {
    throw new ApiError(404,"User not registered")
  }

  const isPasswordCorrect = await user.comparePassword(password)

  if(!isPasswordCorrect)
  {
    throw new ApiError(401,"Incorrect Password")
  }

  const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

  const options={
    httpOnly:true,
    secure:true
  }

  return res.status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",refreshToken,options)
            .json(new ApiResponse(200,{user:{
              _id:user._id,
              email:user.email,
              name:user.name
            }},"Logged in Successfully"))
})

const logoutUser = asyncHandler(async(req,res)=>{
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

  if(!token)
  {
    return res.status(200)
              .json(new ApiResponse(200,{},"user logged out already"))
  }

  await TokenBlacklist.create({
    token:token
  })
  
  res.clearCookie("token")
  
  return res.status(200)
            .json(new ApiResponse(200,{},"User LoggedOut successfully"))

})

export {
  registerUser,
  loginUser,
  logoutUser
}