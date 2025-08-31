import { Officer } from "../models/officer.model.js";

export const createofficer = async (req, res) => {
  try {
    const { name, department, email, phone, address, lat, lon ,city,password} = req.body;
 console.log(name)
    // Validate required fields
    if (!name || !department || !email || !phone || !address || !lat || !lon) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, department, email, phone, address, lat, lon"
      });
    }

    // Check if officer with email already exists
    const existingOfficer = await Officer.findOne({ email });
    if (existingOfficer) {
      return res.status(409).json({
        success: false,
        message: "Officer with this email already exists"
      });
    }

    // Create new officer
    const newOfficer = await Officer.create({
      name,
      department,
      email,
      phone,
      address,
      password,
      location: {
        lat: parseFloat(lat),
        lon: parseFloat(lon)
      },
      city
    });

    console.log(newOfficer);
  

    res.status(201).json({
      success: true,
      message: "Officer created successfully",
      officer: {
        id: newOfficer._id,
        name: newOfficer.name,
        department: newOfficer.department,
        email: newOfficer.email,
        phone: newOfficer.phone,
        address: newOfficer.address,
        location: newOfficer.location
      }
    });

  } catch (error) {
    console.error("Error creating officer:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}
export const officerlogin = async(req,res) => {
    try {
        const { email, password } = req.body;
        console.log(email)
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const user = await Officer.findOne({email})
      
        
        console.log(user)
        
        // Check if user exists
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
        console.log(token)
        res.cookie("token2", token, { 
            httpOnly: true,
            secure: true,
            
        });
        res.status(200).json({ officer:user, token, message: "officer logged in successfully", success: true });
    } catch (error) {
        console.error("Error in officer login:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error", 
            error: error.message 
        });
    }
}
  

export const profile2 = async (req, res) => {
    const userId = req.user._id;
    console.log(userId)
    const user = await Officer.findById(userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ officer:user, message: "User profile fetched successfully", success: true });
}

