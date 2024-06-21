import React, { useState, useEffect } from 'react';
import './Profile.css';
import axios from 'axios';
import { url } from '../../../assets/assets';
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
        const fetchLivreurData = async () => {
            try {
                const useremail = localStorage.getItem('email');
                const response = await axios.post(`${url}/api/livreur/findByName`, { email: useremail });
                if (response.data.success) {
                    const livreurData = response.data.data;
                    setData(prevData => ({
                        ...prevData,
                        id: livreurData._id,
                        name: livreurData.name,
                        email: livreurData.email,
                        password: livreurData.password,
                        localisation: livreurData.localisation,
                        phone: livreurData.phone,
                        image: livreurData.image // Actualiza el estado de la imagen
                    }));
                    localStorage.setItem("livreurname", livreurData.name);
                    localStorage.setItem("livreurid", livreurData._id);
                    const livreurid = localStorage.getItem("livreurid");
                    //toast.error(livreurid);
                } else {
                    toast.error(response.data.message);
                }
                
            } catch (error) {
                console.error("Error fetching livreur data:", error);
                toast.error("Error fetching livreur data");
            }
        };
        fetchLivreurData();
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
            const response = await axios.put(`${url}/api/livreur/upgrade/${data.id}`, formData);
            if (response.data.success) {
                toast.success("Livreur Updated Successfully!");
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
            console.error("Error updating livreur data:", error.response?.data || error.message);
            toast.error(error.message);
        }
    };

    return (
        <div className='profile'>
            <form className='flex-col' onSubmit={(e) => e.preventDefault()}>
                <div className='profile-img-upload flex-col'>
                    <p>Profile Picture</p>
                    <label htmlFor="image">
                        {/* Verifica si hay una imagen en los datos */}
                        {image ? (
                            // Muestra la imagen del livreur si está disponible
                            <img src={`http://localhost:4000/images/${image}`} alt="Profile" />
                        ) : (
                            // Si no hay imagen, muestra una imagen por defecto
                            <img src={defaultImage} alt="Default Profile" />
                        )}
                    </label>
                    <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
                </div>
                <div className='profile-product-name flex-col'>
                    <p>Name</p>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Bembos' required disabled />
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
                    <input name='localisation' onChange={onChangeHandler} value={data.localisation} type="text" placeholder='123 Main St, City, Country' required disabled />
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

export default Profile;
