import { Outlet } from "react-router-dom"
import Navbar from "../components/navbar"
import Footer from "../components/footer"

export const Applayout = () => {

    return(
        <>
        <div className="pb-[80px]">
        <Navbar/>
        </div>
        <Outlet/>
        <Footer/>
        </>

    )



  
}
