// ProfileDevelop.js
import React, { useState, useEffect } from 'react';
import './Profile.css';
import axios from 'axios';
import { url } from '../../../assets/assets';
import { toast } from 'react-toastify';
import defaultImage from './defaultImage.png';

const ProfileService = () => {
    const [data, setData] = useState({
        id: "",
        name: "",
        email: "",
        password: "",
        address: "",
        phone: "",
        newName: "",
        newPassword: "",
        newEmail: "",
        newAddress: "",
        image: "" // Store the image URL here
    });

    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchDevelopData = async () => {
            try {
                const userEmail = localStorage.getItem('email');
                const response = await axios.post(`${url}/api/servicetechnique/findByName`, { email: userEmail });
                if (response.data.success) {
                    const servicetechniqueData = response.data.data;
                    setData({
                        id: servicetechniqueData._id,
                        name: servicetechniqueData.name,
                        email: servicetechniqueData.email,
                        password: servicetechniqueData.password,
                        address: servicetechniqueData.localisation,
                        phone: servicetechniqueData.phone,
                        image: servicetechniqueData.image // Set the image URL received from backend
                    });
                    localStorage.setItem("servicetechniqueid", servicetechniqueData._id);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error fetching servicetechnique data:", error);
                toast.error("Error fetching servicetechnique data");
            }
        };
        fetchDevelopData();
    }, []);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleUpdateClick = async () => {
        const formData = new FormData();
        formData.append("name", data.newName || data.name);
        formData.append("password", data.newPassword || data.password);
        formData.append("email", data.newEmail || data.email);
        formData.append("localisation", data.newAddress || data.address);
        formData.append("phone", data.phone);
        formData.append("image", image); // Append the image file here

        try {
            const response = await axios.put(`${url}/api/servicetechnique/upgrade/${data.id}`, formData);
            if (response.data.success) {
                toast.success("Develop Updated Successfully!");
                setData(prevData => ({
                    ...prevData,
                    name: data.newName || prevData.name,
                    password: data.newPassword || prevData.password,
                    email: data.newEmail || prevData.email,
                    address: data.newAddress || prevData.address,
                    newName: "",
                    newPassword: "",
                    newEmail: "",
                    newAddress: ""
                }));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating servicetechnique data:", error.response?.data || error.message);
            toast.error("Error updating servicetechnique data");
        }
    };

    return (
        <div className='profile'>
            <form className='flex-col' onSubmit={(e) => e.preventDefault()}>
                <div className='profile-img-upload flex-col'>
                    <p>Profile Picture</p>
                    <label htmlFor="image">
                        {data.image ? (
                            <img src={`http://localhost:4000/images/${data.image}`} alt="Profile" />
                        ) : (
                            <img src={defaultImage} alt="Default Profile" />
                        )}
                    </label>
                    <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
                </div>
                <div className='profile-product-name flex-col'>
                    <p>Name</p>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Develop Name' required disabled />
                    <input name='newName' onChange={onChangeHandler} value={data.newName} type="text" placeholder='Enter new name' />
                </div>
                <div className='profile-product-name flex-col'>
                    <p>Email</p>
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='example@example.com' required disabled />
                    <input name='newEmail' onChange={onChangeHandler} value={data.newEmail} type="email" placeholder='Enter new email' />
                </div>
                <div className='profile-product-name flex-col'>
                    <p>Password</p>
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='*********' required disabled />
                    <input name='newPassword' onChange={onChangeHandler} value={data.newPassword} type="password" placeholder='Enter new password' />
                </div>
                <div className='profile-product-name flex-col'>
                    <p>Address</p>
                    <input name='address' onChange={onChangeHandler} value={data.address} type="text" placeholder='123 Main St, City, Country' required disabled />
                    <input name='newAddress' onChange={onChangeHandler} value={data.newAddress} type="text" placeholder='Enter new address' />
                </div>
                <div className='profile-product-name flex-col'>
                    <p>Phone</p>
                    <input name='phone' onChange={onChangeHandler} value={data.phone} type="tel" placeholder='+1234567890' required disabled />
                </div>

                <div className="button-container">
                    <button type="button" className="btn btn-secondary profile-btn" onClick={handleUpdateClick}>UPDATE</button>
                </div>
            </form>
        </div>
    );
};

export default ProfileService;
