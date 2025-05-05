import React, { useContext, useRef, useState } from 'react';
import cart_icon from '../Assets/cart_icon.png';
import logo from '../Assets/logo.png';
import './navbar.css';
import {Link} from 'react-router-dom'
import {ShopContext} from '../../Context/ShopContext';
import nav_dropdown from '../Assets/nav_dropdown.png'
  

const Navbar = () => {
  const [menu,setMenu]=useState("shop")
  const {getTotalCartItems}= useContext(ShopContext);
  const menuRef=useRef();
  const dropdown_toggle=(e)=>{
    menuRef.current.classList.toggle('nav-menu-visible')
    e.target.classList.toggle('open')
  }
  return (
    <div className='navbar'>
      <div className="nav-logo">
        <img src={logo} alt=""/>
        <p>REVIA</p>
      </div>
      <img className='dd' src={nav_dropdown} onClick={dropdown_toggle}></img>
      <ul ref={menuRef} className="nav-menu">
  <li onClick={() => setMenu("shop")} style={{ listStyle: 'none', display: 'inline-block', margin: '0 20px', cursor: 'pointer', fontWeight: '500' }}>
    <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
      Shop
    </Link>
    {menu === "shop" ? <hr /> : null}
  </li>

  <li onClick={() => setMenu("mens")} style={{ listStyle: 'none', display: 'inline-block', margin: '0 20px', cursor: 'pointer', fontWeight: '500' }}>
    <Link to="/mens" style={{ textDecoration: 'none', color: 'black' }}>
      Men
    </Link>
    {menu === "mens" ? <hr /> : null}
  </li>

  <li onClick={() => setMenu("womens")} style={{ listStyle: 'none', display: 'inline-block', margin: '0 20px', cursor: 'pointer', fontWeight: '500' }}>
    <Link to="/womens" style={{ textDecoration: 'none', color: 'black' }}>
      Women
    </Link>
    {menu === "womens" ? <hr /> : null}
  </li>

  <li onClick={() => setMenu("kids")} style={{ listStyle: 'none', display: 'inline-block', margin: '0 20px', cursor: 'pointer', fontWeight: '500' }}>
    <Link to="/kids" style={{ textDecoration: 'none', color: 'black' }}>
      Kids
    </Link>
    {menu === "kids" ? <hr /> : null}
  </li>
</ul>

      <div className="nav-login-cart">
        {localStorage.getItem('auth token')?<button onClick={()=>{localStorage.removeItem('auth token'); window.location.replace('/')}}>Logout</button>:<button><Link to ='/login'>Login</Link></button>}

       <Link to='/cart'><img src={cart_icon}/></Link> 
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};
export default Navbar;


