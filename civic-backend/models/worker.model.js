// models/Worker.js
import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    
  },
  email: {
    type: String,
    
  },
  address: {
    type: String,
    required: true
  },
  department:{
type:String,
require:true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lon: {
      type: Number,
      required: true
    }
  },
   skills:[
    {
      type:String,
    }
  ],
  role: {
    type: String,
    default: "worker"
  },
  status:{
    type:String,
    enum:["busy","available"],
    default:"available"
  }
}, { timestamps: true });

export default mongoose.model("Worker", workerSchema);
