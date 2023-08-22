import React from 'react';
import logo from "../assets/logo.png";
import menu from "../assets/menu.png";

function TopBar({
  toggleSidebar
}) {
  return (
    <div className="topBar">
      <div className="toggle-container">
      <img onClick={toggleSidebar} src={menu} alt="Toggle" className="topBar-toggle" />
      </div>
      <div className='name-container'>
        <h1>Stock App</h1>
      </div>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
    </div>
  );
};

export default TopBar;
