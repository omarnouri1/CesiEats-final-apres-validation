import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css';
import { url, assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);

    // Cargar las notificaciones al montar el componente
    loadNotifications(userRole);
  }, []);

  const loadNotifications = async (userRole) => {
    try {
      const response = await axios.get(`${url}/api/notification/notifications`);
      let filteredNotifications = response.data;

      const userId = localStorage.getItem("userid");
      const restaurantName = localStorage.getItem("restaurantname");

      // Filtrar las notificaciones según el rol
      if (userRole) {
        filteredNotifications = filteredNotifications.filter(notification => notification.role === userRole);

        if (userRole === "user" && userId) {
          filteredNotifications = filteredNotifications.filter(notification => notification.userid === userId);
        } else if (userRole === "restaurant" && restaurantName) {
          filteredNotifications = filteredNotifications.filter(notification => notification.userid === restaurantName);
        } else if (userRole === "livreur") {
          // Aquí se pueden agregar filtros adicionales para livreur si es necesario
        } else if (userRole === "service technique") {
          // Aquí se pueden agregar filtros adicionales para service technique si es necesario
        }
      }

      setNotifications(filteredNotifications);
      setHasNewNotifications(filteredNotifications.some(notification => notification.status === "new"));
    } catch (error) {
      console.error("Error al cargar las notificaciones:", error);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await axios.post(`${url}/api/notification/markAsRead`);
      // Actualiza las notificaciones localmente después de marcarlas como leídas
      setNotifications(notifications.map(notification => ({ ...notification, status: "already read" })));
      setHasNewNotifications(false); // No hay notificaciones nuevas después de marcarlas como leídas
    } catch (error) {
      console.error("Error al marcar las notificaciones como leídas:", error);
    }
  };

  const handleMouseEnter = () => {
    setShowNotifications(true);
    markNotificationsAsRead();
  };

  const handleMouseLeave = () => {
    setShowNotifications(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken("");
    navigate('/');
    window.location.reload();
  };

  return (
    <div className='navbar'>
      <Link to='/' className='navbar-logo'><img className='logo' src={assets.logo} alt="" /></Link>
      <div className='navbar-middle'>
        <ul className="navbar-menu">
          {(!role || role === "user") && (
            <>
              <Link to="/" onClick={() => setMenu("home")} className={`${menu === "home" ? "active" : ""}`}>home</Link>
              <a href='#explore-menu' onClick={() => setMenu("menu")} className={`${menu === "menu" ? "active" : ""}`}>menu</a>
              <a href='#app-download' onClick={() => setMenu("mob-app")} className={`${menu === "mob-app" ? "active" : ""}`}>mobile app</a>
              <a href='#footer' onClick={() => setMenu("contact")} className={`${menu === "contact" ? "active" : ""}`}>contact us</a>
            </>
          )}
        </ul>
      </div>
      <div className="navbar-right">
        {(!role || role === "user") && (
          <>
            <img src={assets.search_icon} alt="" />
            <Link to='/cart' className='navbar-search-icon'>
              <img src={assets.basket_icon} alt="" />
              <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
            </Link>
          </>
        )}
        <div className='navbar-notification' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <img className="notification-icon" src={hasNewNotifications ? assets.bellring : assets.bell} alt="notification icon" />
          {showNotifications && token && (
            <div className='notifications-menu'>
              <ul>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <li key={index} className={notification.status === "already read" ? "read" : ""}>
                      {notification.message}
                    </li>
                  ))
                ) : (
                  <li>No notifications</li>
                )}
              </ul>
            </div>
          )}
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className='navbar-profile-dropdown'>
            {(!role || role === "user") && (
  <>
    <li onClick={() => navigate('/myorders')}>
      <img src={assets.bag_icon} alt="" /> 
      <p>Orders</p>
    </li>
    <li onClick={() => navigate('/api/user/details')}>
      <img src={assets.profile_icon} alt="" /> 
      <p>Profile</p>
    </li>
    <li onClick={() => navigate('/api/user/parrainer')}>
      <img src={assets.profile_icon} alt="" /> 
      <p>Parrainer</p>
    </li>
  </>
)}
              <hr />
              <li onClick={logout}> <img src={assets.logout_icon} alt="" /> <p>Logout</p></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
