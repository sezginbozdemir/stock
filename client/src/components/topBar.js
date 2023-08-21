import React from 'react';
import logo from "../assets/logo.png";

const TopBar = () => {
  return (
    <div className="topBar">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
      <div className='name-container'>
        <h1>Stock App</h1>
      </div>
    </div>
  );
};

export default TopBar;
