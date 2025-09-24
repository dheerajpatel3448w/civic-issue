import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import streamifier from "streamifier";
cloudinary.config({ 
    cloud_name: `${process.env.N}`, 
    api_key: `${process.env.K}`, 
    api_secret: `${process.env.S}` // Click 'View API Keys' above to copy your API secret
});



export const uploadoncloudinary = async (fileBuffer) => {
  try {
    if (!fileBuffer) throw "No file buffer provided";

    const url = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "your_folder_name" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(fileBuffer).pipe(stream);
    });

    console.log("Uploading", url.secure_url);
    return url.secure_url;

  } catch (error) {
    console.log(error);
    return null;
  }
};

 
