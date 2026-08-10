import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
  fromAccount:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: [true,"From Account is required in Transaction"],
    index: true
  },
  toAccount:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: [true,"To Account is required in Transaction"],
    index:true
  },
  amount:{
    type:Number,
    required:[true,"Amount should be greater than Zero"],
  },
  status:{
    type:String,
    enum:{
      values:['Failed','Completed','Pending','Reversed'],
      message:"Payment status have can be Pending, Completed, Failed"},
    default:'Pending'
  },
  idempotencyKey:{
    type:String,
    required:true,
    unique:true
  }
},{timestamps:true})

export const Transaction = mongoose.model("Transaction",transactionSchema)