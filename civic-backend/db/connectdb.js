import mongoose from "mongoose"
export const connectdb = async () => {


    try {
        const connect = await mongoose.connect(process.env.MONGO);
        console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
    }
    




}

