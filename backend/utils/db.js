import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const result = await mongoose.connect(process.env.MONGO_URL);
    console.log("mongodb connection is established=>",result.connection.host);
  } catch (error) {
    console.log("database error==>", error);
  }
};
export default connectDb;