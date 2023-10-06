import { useState,useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import {Routes ,Route, BrowserRouter} from 'react-router-dom'
import ShowDownloads from './components/ShowDownloads';
import Canvas from './components/Canvas'
import HomePage from './components/HomePage';
import Register from './components/Register';
import Login from './components/Login'
import About from './components/About';

function App() {

  return (
    <div>
      <BrowserRouter>
      {/* <Navbar/> */}
      <Routes>
        <Route path='/' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/homepage' element={<HomePage/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/canvas' element={<Canvas/>}/>
        <Route path='/downloads' element={<ShowDownloads/>} />
      </Routes>
      
      </BrowserRouter>

      
    </div>

  );
}

export default App;
