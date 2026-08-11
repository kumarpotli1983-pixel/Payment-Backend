import mongoose from "mongoose"

const ledgerSchema = new mongoose.Schema({
  account:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Account",
    required:[true,'Account is reqired in ledger'],
    index:true,
    immutable:true,
  },
  amount:{
    type:Number,
    required:[true,"Amount is required!"],
    min:[0,'Amount has to be more than Zero'],
    immutable:true
  },
  transaction:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Transaction',
    required:true,
    immutable:true,
  },
  type:{
    type:String,
    enum:{
      values:["Credit","Debit"],
      message:"Type of payment is required"
    },
    required:true,
    immutable:true
  }
},{timestamps:true})

const preventLedgerModification = ()=>{
  throw new Error("Ledger is immutable and cannot be modified")
}

ledgerSchema.pre('findOneAndDelete',preventLedgerModification)
ledgerSchema.pre('findOneAndUpdate',preventLedgerModification)
ledgerSchema.pre('deleteOne',preventLedgerModification)
ledgerSchema.pre('deleteMany',preventLedgerModification)
ledgerSchema.pre('findOneAndReplace',preventLedgerModification)
ledgerSchema.pre('updateOne',preventLedgerModification)
ledgerSchema.pre('replaceOne',preventLedgerModification)

export const Ledger = mongoose.model('Ledger',ledgerSchema)