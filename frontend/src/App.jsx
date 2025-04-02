import React from 'react'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import { useMediaQuery } from "react-responsive";
import Signup from './Signup'
import Login from './Login'
import Profile from './Profile'
import VerifyOTP from './VerifyOTP'
import VerifyOtpMiddle from './VerifyOtpMiddle'
import {ToastContainer} from 'react-toastify'
import Chat from './Chat'
import Settings from './Settings'
import SubjectSettings from './subjectSettings'
import FilePreviewPage from './FilePreviewPage'
import LandingPage from './LandingPage'




function App() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/verify-otp' element={<VerifyOTP/>}></Route>
        <Route path='/verify-otp-middle' element={<VerifyOtpMiddle/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path="/chat" element={isMobile ? <MobileChat /> : <Chat />} />
        <Route path="/subjectSettings" element={<SubjectSettings/>}></Route>        
        <Route path='/settings' element={<Settings/>}></Route>
        <Route path='/preview' element={<FilePreviewPage/>}></Route>
        <Route path='/' element={<LandingPage/>}/>



      </Routes>
    </div>  
  )
}

export default App
