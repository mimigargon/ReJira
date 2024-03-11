/* eslint-disable react-hooks/exhaustive-deps */
import './App.css'
import { Outlet, Link, redirect } from 'react-router-dom';
import Context from './Context';
import { useEffect, useState } from 'react';
const API_URL = 'http://localhost:3000/api';

function App() {

  const logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setLogin(false);
    window.location.href = "/login";
  }

  const [register, setRegister] = useState(false);
  const [login, setLogin] = useState(false);

  useEffect(() => {
    if (document.cookie.includes('token')) {
      fetch(API_URL + '/refresh', { credentials: "include" })
        .then(e => e.json())
        .then(data => {
          if (data.error) {
            redirect('/login');
            logout();
          } else {
            setLogin(data)
          }
        })
    }
  }, []);

  useEffect(() => {
    if (!login) {
      redirect('/login')
    }
  }, [login])


  const dades = { login, setLogin, register, setRegister, logout, API_URL }

  return (
    <Context.Provider value={dades}>
      <div className='p-[50px]'>
        {login && <Link className="border px-4 py-2 bg-blue-700 text-white" to="/project">Projectes</Link>}
        {!login && <Link className="border px-4 py-2 bg-blue-700 text-white" to="/login" >Login</Link>}
        {login && <button className="border px-4 py-2 bg-blue-700 text-white" onClick={logout}>Logout {login.name}</button>}
        {!register && <Link className="border px-4 py-2 bg-blue-700 text-white" to="/register" >Register</Link>}
      </div>

      <div className='P-10'>
        <Outlet />
      </div>

    </Context.Provider>
  )
}

export default App
