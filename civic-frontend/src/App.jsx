
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { UserContextProvider } from './context/user.context'
import './App.css'
import Register from './pages/register'
import Login from './pages/Login'
import ComplaintForm from './pages/complaint'
import OfficerForm from './pages/officer'
import WorkerForm from './pages/worker'
import { Usesocket } from './context/socket'
import OfficerLogin from './pages/officerlogin'
import { OfficerContextProvider } from './context/officer.context'
import { Complaintpage } from './pages/officercomplain'
import Officerprotectroute from './components/officerprotectedroute'
import Userprotectroute from './components/userprotectroute'
import WorkerTaskPage from './pages/workerpage'
import { Applayout } from './pages/Applayout'
import HomePage from './pages/Home'
import { UserComplaintpage } from './pages/usercomplaint'
function App() {
 const router = createBrowserRouter([
  {
    path:"/register",
    element:<Register/>
  },{
    path:"/login",
    element:<Login/>
  },
  {
    path:"/",
    element:<Applayout/>,
    children:[
      {
        path:"/",
        element:<HomePage/>

      },
 {
    path:'/complaint',
    element:<Userprotectroute><ComplaintForm/></Userprotectroute>
  },
  {
    path:"/worker",
    element:<WorkerForm/>
  },
  {
    path:'/complaintpage',
    element:<Officerprotectroute><Complaintpage/></Officerprotectroute>
  },{
    path:'/usercomplaint',
    element:<Userprotectroute><UserComplaintpage/></Userprotectroute>
  }
    ]
  }
 ,{
    path:'/officer',
    element:<OfficerForm/>
  },{
    path:"/officerlogin",
    element:<OfficerLogin/>
  },{
    path:"/worker/task",
    element:<WorkerTaskPage/>
  }

 ])
  return (
    <>
       <Usesocket>
        <OfficerContextProvider>
     <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
    </OfficerContextProvider>
     </Usesocket>
     
    </>
  )
}

export default App
