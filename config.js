import mongoose from "mongoose";


export const connect = async()=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/chatApp", {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
      } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        // Optionally, you can throw the error to let the calling code handle it
        throw error;
      }
}