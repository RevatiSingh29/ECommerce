import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/nav-logo.svg'
import navprofile from '../../assets/nav-profile.svg'

const Navbar = () => {
  return (
    <div className='navbar'>
      <h1 className="nav-logo">REVIA</h1>
      <img src={navprofile} className='navprofile' alt="" />
    </div>
  )
}

export default Navbar