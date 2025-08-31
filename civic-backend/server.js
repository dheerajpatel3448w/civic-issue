import { connectdb } from "./db/connectdb.js";
import app from "./index.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { intializeSocket } from "./socket.js";

const server = createServer(app);

intializeSocket(server);

connectdb().then(()=>{
server.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})


})
