import React from 'react'
import  './Sidebar.css'
import { assets } from '../../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
      <NavLink to='/profile' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Profile</p>
      </NavLink>
        <NavLink to='/orders' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>List Orders</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>List User</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
