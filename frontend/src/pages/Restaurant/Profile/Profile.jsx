import React, { useState, useEffect } from 'react';
import './Profile.css';
import axios from 'axios';
import { assets, url } from '../../../assets/assets';
import { toast } from 'react-toastify';
import defaultImage from './defaultImage.png'; // Importa una imagen por defecto

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
        newAddress: "",
        image: "" // Agrega el estado para la imagen
    });

    const [image, setImage] = useState(null);

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
                        phone: restaurantData.phone,
                        image: restaurantData.image // Actualiza el estado de la imagen
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

    useEffect(() => {
        // Si la imagen ya está cargada, muéstrala
        if (data.image) {
            setImage(data.image);
        }
    }, [data.image]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
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
        formData.append("localisation", data.newAddress || data.localisation);
        formData.append("phone", data.phone);
        formData.append("image", image);
        
        try {
            const response = await axios.put(`${url}/api/restaurant/upgrade/${data.id}`, formData);
            if (response.data.success) {
                toast.success("Restaurant Updated Successfully!");
                setData(prevData => ({
                    ...prevData,
                    name: data.newName || prevData.name,
                    password: data.newPassword || prevData.password,
                    email: data.newEmail || prevData.email,
                    localisation: data.newAddress || prevData.localisation,
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
                        {/* Verifica si hay una imagen en los datos */}
                        {image ? (
                            // Muestra la imagen del restaurante si está disponible
                            <img src={`http://localhost:4000/images/${image}`} alt="Restaurant Logo" />
                        ) : (
                            // Si no hay imagen, muestra una imagen por defecto
                            <img src={defaultImage} alt="Default Logo" />
                        )}
                    </label>
                    <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
                </div>
                <div className='profile-product-name flex-col'>
                    <p>Restaurant Name</p>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Bembos' required disabled />
                </div>

                <div className="d-flex justify-content-between">
                    <div className="profile-section">
                        <div className='profile-product-name flex-col'>
                            <p>Name</p>
                            <input name='newName' onChange={onChangeHandler} value={data.newName} type="text" placeholder='Enter new name' />
                        </div>
                    </div>
                    <div className="profile-section">
                        <div className='profile-product-name flex-col text-center'>
                            <p>Password</p>
                            <input name='newPassword' onChange={onChangeHandler} value={data.newPassword} type="password" placeholder='Enter new password' />
                        </div>
                    </div>
                    <div className="profile-section text-right">
                        <div className='profile-product-name flex-col'>
                            <p>Email</p>
                            <input name='newEmail' onChange={onChangeHandler} value={data.newEmail} type="email" placeholder='Enter new email' />
                        </div>
                    </div>
                    <div className="profile-section text-right">
                        <div className='profile-product-name flex-col'>
                            <p>Address</p>
                            <input name='newAddress' onChange={onChangeHandler} value={data.newAddress} type="text" placeholder='Enter new address' />
                        </div>
                    </div>
                </div>

                <div className="button-container">
                    <button type="button" className="btn btn-secondary profile-btn" onClick={handleUpdateClick}>UPDATE</button>
                </div>
            </form>
        </div>
    );
};

export default Profile;