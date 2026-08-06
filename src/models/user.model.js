import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
  email:{
    type:String,
    required:[true,"Email is required for creating a User"],
    trim:true,
    lowercase:true,
    match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Invalid Email Address"],
    unique:[true,"Email already exists"]
  },
  name:{
    type:String,
    required:[true,"name is required for creating account"],
    trim:true
  },
  password:{
    type:String,
    required:[true,"Password is required for creating account"],
    minlength:[6,"password should contain more than 6 characters"],
    select:false
  }
},
{timestamps:true})

userSchema.pre("save",async function (next){
  if(!this.isModified(password)) return

  this.password = await bcrypt.hash(this.password,10)
  return next()
})

userSchema.methods.comparePassword = async function (password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = async function()
{
  return jwt.sign(
    {
      _id:this._id,
      email:this.email,
      name:this.name
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES
    }
  )
}

userSchema.methods.generateRefreshToken = async function ()
{
  return jwt.sign(
    {
      _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES
    }
  )
}

export const User = mongoose.model("User",userSchema)