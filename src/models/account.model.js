import mongoose from "mongoose"
import { Ledger } from "./ledger.model"

const accountSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:[true,'Account must be associated with a user'],
    index:true
  },
  status:{
    type:String,
    enum:{
      values:["ACTIVE","FROZEN","CLOSED"],
      message:"Status can be either ACTIVE, FROZEN or CLOSED"
    },
    default:"ACTIVE"
  },
  currency:{
    type:String,
    required:[true,'Currenc is required for creating an account'],
    default:"INR"
  }
},{timestamps:true})

accountSchema.methods.getBalance = async function(){
  const balanceData = await Ledger.aggregate([
    {
      $match:{
      _id
      }
    },
    {
      $group:{
        _id:null,
        totalDebit:{
          $sum:{
            $cond:[
              { $eq: ["$type","Debit"]},
              "$amount",
              0
            ]
          }
        },
        totalCredit:{
          $sum:{
            $cond:[
              {$eq:["$type","Credit"]},
              "$amount",
              0
            ]
          }
        }
    }
    },
    {
      $project:{
        _id:0,
        balance:{$subtract:["$totalCredit","$totalDebit"]}
      }
    }
    ])

  if(balanceData.length===0)
  {
    return 0;
  }
}

accountSchema.index({ user:1, status:1 })

export const Account = mongoose.model("Account",accountSchema);
