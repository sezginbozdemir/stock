// Sidebar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import clients from "../assets/sidebar-icons/clients.png";
import home from "../assets/sidebar-icons/home-128.png";
import sales from "../assets/sidebar-icons/sales.png";
import toggle from "../assets/sidebar-icons/toggle.png";
import products from "../assets/sidebar-icons/products.png";

function Sidebar({
  sidebarOpen, toggleSidebar 
}) { 

  return (
    <div className={`${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <ul className="toggle-sidebar">
        <li onClick={toggleSidebar}>
          <a className="sidebar-link">
            <img src={toggle} alt="Toggle" className="sidebar-icon" />
            {sidebarOpen ? "Toggle" : ""}
          </a>
        </li>
      </ul>
      <ul className="sidebar-links">
        <li>
          <Link to="/" className="sidebar-link">
            <img src={home} alt="Home" className="sidebar-icon" />
            {sidebarOpen ? "Home" : ""}
          </Link>
        </li>
        <li>
          <Link to="/stocks" className="sidebar-link">
            <img src={products} alt="Stock" className="sidebar-icon" />
            {sidebarOpen ? "Stock" : ""}
          </Link>
        </li>
        <li>
          <Link to="/purchases" className="sidebar-link">
            <img src={sales} alt="Sales" className="sidebar-icon" />
            {sidebarOpen ? "Sales" : ""}
          </Link>
        </li>
        <li>
          <Link to="/clients" className="sidebar-link">
            <img src={clients} alt="Clients" className="sidebar-icon" />
            {sidebarOpen ? "Clients" : ""}
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
