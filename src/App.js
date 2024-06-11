import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Aimotors from './Components/Aimotors';
import Header from './Components/Header';
import Footer from './Components/Footer';

function App() {
  const [calculatedPrice, setCalculatedPrice] = useState(null);

  return (
    <Router>
      <Header calculatedPrice={calculatedPrice} />
      <Routes>
        <Route path="/" element={<Aimotors setCalculatedPrice={setCalculatedPrice} />} />
        <Route path="/home" element={<Aimotors setCalculatedPrice={setCalculatedPrice} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
