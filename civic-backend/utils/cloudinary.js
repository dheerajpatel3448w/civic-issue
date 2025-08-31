import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
cloudinary.config({ 
    cloud_name: `${process.env.N}`, 
    api_key: `${process.env.K}`, 
    api_secret: `${process.env.S}` // Click 'View API Keys' above to copy your API secret
});
 export const uploadoncloudinary = async(localpath) => {
    try {
        if (!localpath) {
        throw "No file path provided";
        }
        const url = await cloudinary.uploader.upload(localpath,{
            resource_type:"auto",
        })
        if(!url){
            throw "erron on cloudnary side"
        }
        console.log("Uploading",url.url);
        fs.unlinkSync(localpath);
        console.log("File deleted successfully");
        return url.url;
    } catch (error) {
        console.log(error)
        fs.unlinkSync(localpath)
        return null

        
    }
   
 }
 
