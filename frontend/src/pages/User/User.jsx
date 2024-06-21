import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './User.css';

const User = () => {
    const [user, setUser] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:4000/api/user/details', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUser(response.data);
                setFormData({ name: response.data.name, email: response.data.email, password: '' });
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleEditProfile = () => {
        setModalIsOpen(true);
    };

    const handleDeleteProfile = async () => {
        if (confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.delete('http://localhost:4000/api/user/delete', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.data.success) {
                    alert('Profile deleted successfully');
                    localStorage.removeItem("token")
                    window.location.href = 'http://localhost:5174/'; // Rediriger vers la page spécifiée
                } else {
                    alert('Error: ' + response.data.message);
                }
            } catch (error) {
                console.error('Error deleting profile:', error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put('http://localhost:4000/api/user/update', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setModalIsOpen(false);
                alert('Profile updated successfully');
            } else {
                alert('Error: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    useEffect(() => {
        if (user) {
            setUser(prevUser => ({
                ...prevUser,
                name: formData.name,
                email: formData.email
            }));
        }
    }, [formData]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div id="user-details">
            <h2>User Profile</h2>
            <div id="user-info">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Password:</strong> ●●●●●●●●</p>
            </div>
            <div id="user-actions">
                <button onClick={handleEditProfile}>Edit Profile</button>
                <button onClick={handleDeleteProfile}>Delete Profile</button>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Edit Profile"
                className="modal"
                overlayClassName="overlay"
                id='modal'
            >
                <h2>Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input type="text" name="name" value={formData.name} onChange={handleChange} />
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </label>
                    <label>
                        New Password:
                        <input type="password" name="password" value={formData.password} onChange={handleChange} />
                    </label>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setModalIsOpen(false)}>Cancel</button>
                </form>
            </Modal>
        </div>
    );
};

export default User;
