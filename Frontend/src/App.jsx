import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Start from './pages/Start.jsx'
import Home from './pages/Home.jsx'
import UserLogin from './pages/UserLogin.jsx'
import UserSignup from './pages/UserSignup.jsx'
import CaptainLogin from './pages/CaptainLogin.jsx'
import CaptainSignup from './pages/CaptainSignup.jsx'
import CaptainHome from './pages/CaptainHome.jsx'
import UserProtectWrapper from './pages/UserProtectWrapper.jsx'
import UserLogout from './pages/UserLogout.jsx'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper.jsx'

const App = () => {
  return (
    <div>
      <Routes>
        <Route  path="/" element={<Start/>} />
        <Route  path="/login" element={<UserLogin/>} />
        <Route  path="/signup" element={<UserSignup/>} />
        <Route  path="/captain-login" element={<CaptainLogin/>} />
        <Route  path="/captain-signup" element={<CaptainSignup/>} />
        <Route  path="/Home" element={

          <UserProtectWrapper>
            <Home/>
          </UserProtectWrapper>
          
          } />
        <Route  path="/user/logout" element={
          
          <UserProtectWrapper>
            <UserLogout/>
          </UserProtectWrapper>
          
          } />
        <Route  path="/captain-home" element={

          <CaptainProtectWrapper>
            <CaptainHome/>
          </CaptainProtectWrapper>
          
          } />
      </Routes>
    </div>
  )
}

export default App
