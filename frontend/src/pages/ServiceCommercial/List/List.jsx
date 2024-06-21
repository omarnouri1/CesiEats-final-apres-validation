import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './List.css';  // Asegúrate de tener tu archivo CSS adecuadamente

const UserList = () => {
  const [users, setUsers] = useState([]);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/user/list');
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        toast.error("Error fetching users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
    }
  };

  const removeUser = async (user) => {
    const { _id: userId, role, email } = user;
    try {
      const response = await axios.post('http://localhost:4000/api/user/remove', {
        id: userId,
        email: email,
        role: role
      });
      if (response.data.success) {
        setUsers(users.filter(u => u._id !== userId));
        toast.success(`User ${email} with role ${role} deleted successfully`);
      } else {
        toast.error("Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="user-list-container">
      <h3>User List</h3>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className='delete-button' onClick={() => removeUser(user)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
