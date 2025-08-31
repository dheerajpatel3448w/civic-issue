import User from "../models/user.model.js";

export const register = async (req,res) => {
    const { name, email,phone, password } = req.body;
 console.log(name)
    if (!name || !email || !phone||!password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
    }
    const user = await User.create({ name, email, password,phone});
    if(!user) {
        return res.status(400).json({ error: "User registration failed" });
    }
    res.status(201).json({ user ,message:"User registered successfully",success:true });
}


export const login = async (req,res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = user.generateAuthToken();
    if (!token) {
        return res.status(500).json({ error: "Token generation failed" });
    }
    res.cookie("token", token, { 
        httpOnly: true,
        secure: true,
        
    });
    res.status(200).json({ user, token, message: "User logged in successfully", success: true });
}


export const profile = async (req, res) => {
    const userId = req.user._id;
    console.log(userId)
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user, message: "User profile fetched successfully", success: true });
}



export const logout = (req, res) => {
    
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully", success: true });
}

