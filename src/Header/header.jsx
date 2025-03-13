import './header_styles.css';
import React from 'react';


function Header() {
  return (

<nav class="navbar">
    <div class="navbar-left">
        <a href="#" class="navbar-logo">
            <span class="logo">LOGO</span>
        </a>
        <ul class="nav-links">
            <li><a href="#">Hjem</a></li>
            <li><a href="#">Ny Sak</a></li>
            <li><a href="#">Profil</a></li>
        </ul>
    </div>
  <div className="navbar-right">
    <button className="logoutButton">Logg ut</button>
  </div>
</nav>
);
};



export default Header;