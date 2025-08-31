// models/Officer.js
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const officerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    required: true,
    
  },
  password:{
type:String,
required:true
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true, 
  },
 city:{
  type:String
 },
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
socketId:{
  type:String
}



},{
    new:true
});
officerSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})
officerSchema.methods.generateAuthToken = function() {

    const token = jwt.sign({ _id: this._id,email:this.email,role:this.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
}
officerSchema.methods.comparePassword = async function(candidatePassword) {
    const user = this;
    const isMatch = await bcrypt.compare(candidatePassword, user.password);
    return isMatch;
}

export const Officer =  mongoose.model("Officer", officerSchema);
