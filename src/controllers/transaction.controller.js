import { Transaction } from "../models/transaction.model.js";
import { Ledger } from "../models/ledger.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Account } from "../models/account.model.js";
import { sendTransactionEmail, sendTransactionFailedEmail } from "../services/email.service.js";
import mongoose from "mongoose"

/* 
 - create a new transaction
 10 step transfer flow:
    1. validate input data
    2. validate idempotency key
    3. check account status
    4. derive sender balance from ledger
    5. create transacion (pending)
    6. create debit ledger entry
    7. create credit ledger entry
    8. Mark transaction completed
    9. commit Mongodb session
    10. send email notification
*/
const createTransaction = asyncHandler(async(req,res)=>{

  const { fromAccount, toAccount, amount, idempotencyKey } = req.body

  if([fromAccount,toAccount,amount,idempotencyKey].some((field)=>!field || field.trim()===""))
  {
    throw new ApiError(400,"all fields are required to make transation")
  }

  const fromAccountExists = await Account.findById(fromAccount)
  const toAccountExists = await Account.findById(toAccount)

  if(!fromAccountExists || !toAccountExists)
  {
    throw new ApiError(400,"Invalid fromAccountId or toAccountId");
  }

  //idempotency

  const idempotencyKeyExists = await Transaction.findOne({idempotencyKey})

  if(idempotencyKeyExists)
  {
    if(idempotencyKeyExists.status==="Failed")
    {
      return res.status(200)
                .json(new ApiResponse(200,idempotencyKeyExists,"Transaction Failed, try again"))
    }
    if(idempotencyKeyExists.status==="Completed")
    {
      return res.status(200)
                .json(new ApiResponse(200,idempotencyKeyExists,"Transaction Completed"))
    }
    if(idempotencyKeyExists.status==="Pending")
    {
      return res.status(200)
                .json(new ApiResponse(200,idempotencyKeyExists,"Transaction is processing, please wait"))
    }
    if(idempotencyKeyExists.status==="Reversed")
    {
      return res.status(200)
                .json(new ApiResponse(200,idempotencyKeyExists,"Transaction Reversed, try again"))
    }
  }

  //account status

  if(fromAccountExists.status!=="ACTIVE" || toAccountExists.status!=="ACTIVE")
  {
    throw new ApiError(400,"Both fromAccount or toAccount must be Active")
  }
  
  //sender balance

  const senderBalance = await fromAccountExists.getBalance()

  if(senderBalance<amount)
  {
    throw new ApiError(403,`Insufficient Balance. Balance amount:${senderBalance}`)
  }


  // new transaction

  const session = await  mongoose.startSession()
  

  try {
    session.startTransaction()

    const newTransaction = new Transaction({
      fromAccount,
      toAccount,
      amount,
      status:"Pending",
      idempotencyKey,
    })

    const debitLedgerEntry = await Ledger.create([{
      account: fromAccount,
      amount: amount,
      transaction: newTransaction._id,
      type:"Debit"
    }],{ session })

    const creditLedgerEntry = await Ledger.create([{
      account: toAccount,
      amount: amount,
      transaction: newTransaction._id,
      type:"Credit"
    }],{ session })

    newTransaction.status = "Completed"
    await newTransaction.save({ session })

    await session.commitTransaction()

    await sendTransactionEmail(req.user.email, req.user.name, amount, toAccount, newTransaction._id)
    
  } catch (error) {
    newTransaction.status = "Failed"
    await newTransaction.save({ session })

    await session.abortTransaction()

    await sendTransactionFailedEmail(req.user.email, req.user.name, amount, toAccount, newTransaction._id)

    throw new ApiError(404,"Last transaction is failed")
  }
  finally{
    await session.endSession()
  }

  return res.status(201)
            .json(new ApiResponse(201,newTransaction,"Transaction Completed"))
})

const createInitialFundTransaction = asyncHandler(async(req,res)=>{

  const {toAccount, amount, idempotencyKey} = req.body

  if([toAccount,amount,idempotencyKey].some((field)=>!field))
  {
    throw new ApiError(400,"All fields are required for transaction")
  }

  if(amount===0)
  {
    throw new ApiError(400,"Amount Cannot be Zero")
  }

  const toUserAccountExists = await Account.findOne({_id:toAccount})

  if(!toUserAccountExists)
  {
    throw new ApiError(400,"Invalid Receiver Account")
  }

  const idempotencyKeyExists = await Transaction.findOne({idempotencyKey})

  if(idempotencyKeyExists)
  {
    if(idempotencyKeyExists.status==="Pending")
    {
      return res.status(200)
                .json(new ApiResponse(200,idempotencyKeyExists,"Transaction is processing, please wait"))
    }
    if(idempotencyKeyExists.status==="Completed")
    {
      return res.status(200)
                .json(new ApiResponse(200,idempotencyKeyExists,"Transaction Completed"))
    }
    if(idempotencyKeyExists.status==="Failed")
    {
      return res.status(200)
                .json(new ApiResponse(200,idempotencyKeyExists,"Transaction Failed, try again"))
    }
    if(idempotencyKeyExists.status==="Reversed")
    {
      return res.status(200)
                .json(new ApiResponse(200,idempotencyKeyExists,"Transaction Reversed, try again"))
    }
  }

  const fromUserAccountExists = await Account.findOne({
    user:req.user._id
  })

  if(!fromUserAccountExists)
  {
    throw new ApiError(404,"Sysytem User Account doesnt Exists")
  }

  // const fromUserBalance = await fromUserAccountExists.getbalance()

  // if(fromUserBalance<amount)
  // {
  //   throw new ApiError(403,`Insufficient funds, current balance ${fromUserBalance}`)
  // }

  const session = await mongoose.startSession()
  session.startTransaction()

  const newTransaction = new Transaction({
    fromAccount:fromUserAccountExists._id,
    toAccount,
    amount,
    idempotencyKey
  })

  const debitLedgerEntry = await Ledger.create([{
      account:fromUserAccountExists._id,
      amount,
      transaction:newTransaction._id,
      type:'Debit',

  }],{ session })

  const creditLedgerEntry = await Ledger.create([{
    account:toAccount,
    amount,
    transaction:newTransaction._id,
    type:"Credit"
  }],{ session })

  newTransaction.status="Completed"
  await newTransaction.save({ session })

  session.commitTransaction()
  session.endSession()

  await sendTransactionEmail(req.user.email, req.user.name, amount, toAccount, newTransaction._id)

  return res.status(201)
            .json(new ApiResponse(201,newTransaction,"Initial funds transaction completed"))

})
export {
  createTransaction,
  createInitialFundTransaction
}
