import React, { useState, useEffect } from 'react';
import './Profile.css';
import { url } from '../../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
    const [data, setData] = useState({
        id: "",
        name: "",
        email: "",
        password: "",
        localisation: "",
        phone: "",
        newName: "",
        newPassword: "",
        newEmail: "",
        newAddress: ""
    });

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const useremail = localStorage.getItem('email');
                const response = await axios.post(`${url}/api/restaurant/findByName`, { email: useremail });
                if (response.data.success) {
                    const restaurantData = response.data.data;
                    setData(prevData => ({
                        ...prevData,
                        id: restaurantData._id,
                        name: restaurantData.name,
                        email: restaurantData.email,
                        password: restaurantData.password,
                        localisation: restaurantData.localisation,
                        phone: restaurantData.phone
                    }));
                    localStorage.setItem("restaurantname", restaurantData.name);
                } else {
                    toast.error(response.data.message);
                }
                
            } catch (error) {
                console.error("Error fetching restaurant data:", error);
                toast.error("Error fetching restaurant data");
            }
        };
        fetchRestaurantData();
    }, []);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleDeleteClick = () => {
        const confirmation = window.confirm("Are you sure?");
        if (confirmation) {
            alert("Deleted!");
        } else {
            alert("Not deleted!");
        }
    };

    const handleUpdateClick = async () => {
        const { id, newName, newPassword, newEmail, newAddress, phone } = data;
    
        const updatePayload = {
            id,
            name: newName || data.name,
            password: newPassword || data.password,
            email: newEmail || data.email,
            localisation: newAddress || data.localisation,
            phone: phone
        };
    
        try {
            console.log("Sending update request with payload:", updatePayload);
    
            const response = await axios.put(`${url}/api/restaurant/upgrade/${id}`, updatePayload);
    
            console.log("Response from server:", response.data);
    
            if (response.data.success) {
                toast.success("Restaurant Updated Successfully!");
                setData(prevData => ({
                    ...prevData,
                    name: newName || prevData.name,
                    password: newPassword || prevData.password,
                    email: newEmail || prevData.email,
                    localisation: newAddress || prevData.localisation,
                    newName: "",
                    newPassword: "",
                    newEmail: "",
                    newAddress: ""
                }));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating restaurant data:", error.response?.data || error.message);
            toast.error(error.message);
        }
    };
    

    return (
        <div className='profile'>
            <form className='flex-col' onSubmit={(e) => e.preventDefault()}>
                <div className='profile-img-upload flex-col'>
                    <p>Logo</p>
                    <label htmlFor="image">
                        <img src="/src/assets/Bembos.png" alt="" />
                    </label>    
                </div>
                <div className='profile-product-name flex-col'>
                    <p>Restaurant Name</p>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Bembos' required disabled />
                </div>

                <div className="d-flex justify-content-between">
                    <div className="profile-section">
                        <div className='profile-product-name flex-col'>
                            <p>Name</p>
                            <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Bembos' required disabled />
                            <input name='newName' onChange={onChangeHandler} value={data.newName} type="text" placeholder='Enter new name' />
                        </div>
                    </div>
                    <div className="profile-section">
                        <div className='profile-product-name flex-col text-center'>
                            <p>Password</p>
                            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Enter current password' required />
                            <input name='newPassword' onChange={onChangeHandler} value={data.newPassword} type="password" placeholder='Enter new password' />
                        </div>
                    </div>
                    <div className="profile-section text-right">
                        <div className='profile-product-name flex-col'>
                            <p>Email</p>
                            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='bruno@viacesi.fr' required disabled />
                            <input name='newEmail' onChange={onChangeHandler} value={data.newEmail} type="email" placeholder='Enter new email' />
                        </div>
                    </div>
                    <div className="profile-section text-right">
                        <div className='profile-product-name flex-col'>
                            <p>Address</p>
                            <input name='localisation' onChange={onChangeHandler} value={data.localisation} type="text" placeholder='1 Av Jacques Chirac' required disabled />
                            <input name='newAddress' onChange={onChangeHandler} value={data.newAddress} type="text" placeholder='Enter new address' />
                        </div>
                    </div>
                </div>

                <div className="button-container">
                    <button type="submit" className="btn btn-primary profile-btn">PROFILE</button>
                    <button type="button" className="btn btn-secondary profile-btn" onClick={handleUpdateClick}>UPDATE</button>
                    <button type="button" className="btn btn-danger profile-btn" onClick={handleDeleteClick}>DELETE</button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
