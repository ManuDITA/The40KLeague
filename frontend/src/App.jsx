import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import NavBar from './components/NavBar/NavBar'
import './App.css'
import Home from './components/Routes/Public routes/Home/Home'
import Footer from './components/Footer/Footer'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Contacts from './components/Routes/Public routes/Contacts/Contacts'
import SessionPage from './components/Routes/Public routes/Session/SessionPage'
import LoginSignup from './components/Routes/Public routes/LoginSignup/LoginSignup'
import NotFound from './components/Routes/Public routes/NotFound/NotFound'
import Season from './components/Routes/Public routes/Season/Season'

function App() {

  return (
    <>
      
      <BrowserRouter>
      <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path='/season/:idSeason/sessions' element={<Season />}></Route>
          <Route path="/season/:idSeason/session/:idSessions" element={<SessionPage />}></Route>
          <Route path="/contacts" element={<Contacts />}></Route>
          <Route path="/loginsignup" element={<LoginSignup />}></Route>
          <Route path="/*" element={<NotFound/>}></Route>
        </Routes>
      </BrowserRouter>
      <Footer></Footer>
    </>
  )
}

export default App
