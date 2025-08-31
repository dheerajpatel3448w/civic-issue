import mongoose from "mongoose";


const complaintSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'

    },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  media: { type: String }, 
  description: { type: String, required: true },
  address: { type: String, required: true },
  location:{
    lat:{
        type:Number,
        require:true
    },
    lon:{
        type:Number,
        require:true
    }

},

  officer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Officer", 
    default: null 
  },
  assignedWorker: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Worker", 
    default: null 
  },
  department:{
    type:String

  },
  problem_type:{
    type:String
  },
  severity_level:{
    type:String
  },
  skills:[
    {type:String}
  ],
  status: {
    type: String,
    enum: ["Pending", "Approved", "Assigned", "Resolved"],
    default: "Pending"
  },
  
},{
    timestamps:true
});

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
