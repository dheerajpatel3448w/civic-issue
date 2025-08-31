/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext,  useEffect } from "react";
import {io} from 'socket.io-client';
export const Socketcontext = createContext();

const socket = io(`http://localhost:5000`);

export const  Usesocket = ({children}) => {

useEffect(()=>{
    socket.on('connect', () =>{
        console.log('connected to server');
    })
    socket.on("disconnect",()=>{
        console.log('disconnected from server');
    })
},[]);

const sendmessage = (eventname,message) => {
    socket.emit(eventname,message);
  
}
const  getmessage = (eventname,callback) =>{
    socket.on(eventname,callback)
}

  return (
    <>
    <Socketcontext.Provider value={{sendmessage,getmessage}}>
        {children}
    </Socketcontext.Provider>
    </>
  )
}
