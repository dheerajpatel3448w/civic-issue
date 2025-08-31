import { Server } from "socket.io";
import User from "./models/user.model.js";
import { Officer } from "./models/officer.model.js";

let io;
export const  intializeSocket = (server) => {
 io = new Server(server,{
    cors: {
        origin: [`http://localhost:5173`,`${process.env.frontend}`],
        methods: ["GET", "POST"],
        credentials:true

    }
  })
  io.on("connection",(socket)=>{
    console.log(" new client connected " + socket.id);

socket.on("join",async(data)=>{
    const {userId,userType}=data
    console.log(data);
    if(userType==="user"){
        const user = await User.findByIdAndUpdate(userId,{
            socketId:socket.id
        },{
            new:true
        })
    
    }
    else if(userType==="officer"){
        const officer = await Officer.findByIdAndUpdate(userId,{
            socketId :socket.id
        },{
            new:true
        })
        
    }
})


    socket.on("disconnect",()=>{
        console.log(" client disconnected " + socket.id );
    })

  })
}

export const sendmessagetosocket = (socektid,message) => {
    if(io){
        io.to(socektid).emit(`${message.event}`,message.data);
    }
    else{
        console.log("io is not defined");
    }
  
}


