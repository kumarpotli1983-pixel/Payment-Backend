import mongoose from "mongoose"

const connectToDb = async()=>{
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)

    console.log(`MongoDB connected!.DB Host ${connectionInstance.connection.host}`)

    // console.log(`\nConnectionInstance-FullBody : `,connectionInstance)

  } catch (error) {
    console.log("\nError Connecting MONGO_DB : ",error)

    process.exit(1)
  }
}

export default connectToDb