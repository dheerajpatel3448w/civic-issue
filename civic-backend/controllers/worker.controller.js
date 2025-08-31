import workerModel from "../models/worker.model.js";
export const createworker =async(req,res) => {
    const {name,department,lat,lon,address,phone,email,skills}= req.body;
    if(!name,!department){
        return res.status(400).json({
            message:"error"
        })
    }
    console.log(skills);
    const worker = await workerModel.create({
        name,
        department,
        location:{
            lat,lon
        },
        address,
        phone,
        email,
        skills:JSON.parse(skills)

    })
    console.log(worker);
    if(!worker){
        res.status(400).json({
            message:"error in worker"
        })
    }

    res.status(201).json({
        worker,
        message:"create worker successfully"
    })
  
}
export const getallworker = async(req,res) => {
    const location = req.query;
    console.log(location.lat);
    const {lat,lon,department}=location;
    console.log(lat,lon);
  const worker = await workerModel.find({
    location: {
        $geoWithin:{
            $centerSphere:[[lat,lon],2000/6371]
        }
    },
    department
  })
  console.log(worker);
  if(!worker){
    res.status(400).json({message:"worker not found"});
  }

  res.status(200).json({worker,message:"all workers"});
  
}
