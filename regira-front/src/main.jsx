/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import App from './App.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import './index.css'
import Projects from './components/Projects.jsx'
import NewProject from './components/NewProject.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/project' element={<Projects />} />
        <Route path='/project/new' element={<NewProject />} />
        <Route path='*' element={<Navigate replace to={'/'} />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
