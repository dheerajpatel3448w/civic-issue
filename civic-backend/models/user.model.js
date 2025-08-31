import mongoose from "mongoose"; 
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
   
    phone: {
        type:String,
        max:10,
        min:10,
        
        required: true

    },
    socketId:{
  type:String
}

},{
    timestamps: true

})
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})
userSchema.methods.generateAuthToken = function() {

    const token = jwt.sign({ _id: this._id,email:this.email,role:this.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
}
userSchema.methods.comparePassword = async function(candidatePassword) {
    const user = this;
    const isMatch = await bcrypt.compare(candidatePassword, user.password);
    return isMatch;
}

const User = mongoose.model("User", userSchema);
export default User;