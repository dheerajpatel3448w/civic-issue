/* eslint-disable no-unused-vars */
import React from 'react'
import { useContext } from 'react';
import { UserContext } from '../context/user.context';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Userprotectroute({children}) {
  
  const l = useContext(UserContext);
  const [loading, setloading] = useState(false);
  const navigate= useNavigate();
  useEffect(()=>{
    const token = JSON.parse(localStorage.getItem("token"))
    axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
        withCredentials: true,
        headers:{
            Authorization:`Bearer ${token}`
        }
    }).then((response) => {
      console.log(response.data)
        if(response.data.success){
            l.setUser(response.data.user);
            setloading(true);
        }else{
            navigate("/login");
        }
    })
  },[]);
  
    if(loading){
        return <div>{children}</div>
    }
  return (
    <div>
      Loading....
    </div>
  )
}

export default Userprotectroute
