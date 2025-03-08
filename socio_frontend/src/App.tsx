import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar';
import { IUSer } from './interfaces';
import Loginpage from './pages/login/Loginpage';
import { endpoints } from './endpoints';
import Signuppage from './pages/signup/Signuppage';
import { UserContext } from "./ctx/UserContext"; // 
import Homepage from './pages/home/Homepage';

function App() {
  const [user, setUser] = useState<IUSer | null>(null)
  return (
    <>
    <UserContext.Provider value={{user,setUser}}> 
      <Navbar/>
        <Routes>
          <Route path={endpoints.login} element={<Loginpage/>} />
          <Route path={endpoints.signup} element={<Signuppage/>} />
          <Route path={endpoints.home} element={<Homepage/>} />
          {/* <Homepage /> */}
        </Routes>
    </UserContext.Provider>
    </>
  )
}

export default App
