import React, { useState } from 'react';
import './Add.css';
import { assets, url } from '../../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = () => {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });

    const [image, setImage] = useState(null);

    const onSubmitHandler = async event => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('phone', data.phone);
        formData.append('image', image);
        const response = await axios.post(`${url}/api/food/add`, formData);
        if (response.data.success) {
            toast.success(response.data.message);
            setData({
                name: '',
                email: '',
                password: '',
                phone: ''
            });
            setImage(null);
        } else {
            toast.error(response.data.message);
        }
    };

    const onChangeHandler = event => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    return (
        <div className="add">
            <form className="flex-col" onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Photo perfil</p>
                    <label htmlFor="image">
                        <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
                    </label>
                    <input onChange={e => setImage(e.target.files[0])} type="file" id="image" hidden required />
                </div>
                <div className="add-profile-info flex-col">
                    <p>Name</p>
                    <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Enter your name" required />
                    <p>Email</p>
                    <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Enter your email" required />
                    <p>Password</p>
                    <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Enter your password" required />
                    <p>Phone</p>
                    <input name="phone" onChange={onChangeHandler} value={data.phone} type="tel" placeholder="Enter your phone number" required />
                </div>
                
            </form>
            <div className="profile-actions">
                <button className="add-btn">Upgrade Profile</button>
                &nbsp; {/* Espacio entre los botones */}
                <button className="add-btn">Delete Profile</button>
            </div>
        </div>
    );
};

export default Add;

