import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Converter from './views/Converter'
const NotFound = ()=> <h1>Route not found</h1>

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Converter />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
