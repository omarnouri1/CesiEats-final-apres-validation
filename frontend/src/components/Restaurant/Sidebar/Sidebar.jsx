import React from 'react'
import  './Sidebar.css'
import { assets } from '../../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/profile' className="sidebar-option">
            <img src={assets.profile_icon} alt="" />
            <p>Profile</p>
        </NavLink>
        <NavLink to='/add' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Add Items</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
            <img src={assets.order_list} alt="" />
            <p>List Items</p>
        </NavLink>
        <NavLink to='/accept' className="sidebar-option">
            <img src={assets.accept} alt="" />
            <p>Accept Delivery</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Orders</p>
        </NavLink>
        <NavLink to='/historique' className="sidebar-option">
            <img src={assets.historique} alt="" />
            <p>Historique</p>
        </NavLink>
        <NavLink to='/parrainer' className="sidebar-option">
            <img src={assets.refer} alt="" />
            <p>Parrainer</p>
        </NavLink>
        <NavLink to='/statistiques' className="sidebar-option">
            <img src={assets.refer} alt="" />
            <p>Statistiques</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
