/* eslint-disable react-hooks/exhaustive-deps */
import './App.css'
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Context from './Context';
import { useEffect, useState } from 'react';

function App() {

  const [register, setRegister] = useState(false);
  const [login, setLogin] = useState(false);
  const redirect = useNavigate();

  useEffect(() => {
    if (!login) {
      redirect('/login')
    }
  }, [login])

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  const data = { login, setLogin, register, setRegister }

  return (
    <Context.Provider value={data}>
      <div className='p-[50px]'>
        {login && <Link className="border px-4 py-2 bg-blue-700 text-white" to="/project">Projectes</Link>}
        {!login && <Link className="border px-4 py-2 bg-blue-700 text-white" to="/login" >Login</Link>}
        {login && <button className="border px-4 py-2 bg-blue-700 text-white" onClick={handleLogout}>Logout {login.name}</button>}
        {register && <Link className="border px-4 py-2 bg-blue-700 text-white" to="/projects">Projectes</Link>}
        {!register && <Link className="border px-4 py-2 bg-blue-700 text-white" to="/register" >Register</Link>}
      </div>

      <div className='P-10'>
        <Outlet />
      </div>

    </Context.Provider>
  )
}

export default App
