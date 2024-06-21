import React from 'react'
import  './Sidebar.css'
import { assets } from '../../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/add' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Profile</p>
        </NavLink>
        <NavLink to='/log' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Logs de Connection</p>
        </NavLink>
        <NavLink to='/composant' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Composant</p>
        </NavLink>        
        <NavLink to='/statistiques' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Statistiques</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Deployeax nouveaux services</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
