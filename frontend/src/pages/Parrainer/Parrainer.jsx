import React, { useState } from 'react';
import './Parrainer.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets, url } from '../../assets/assets';

const ParrainerRestaurant = () => {
    const [data, setData] = useState({
        name: "",
        localisation: "",
        password: "1234",
        email: ""
    });

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        try {
            const response = await axios.post(`${url}/api/user/add`, data);
            if (response.data.success) {
                toast.success(response.data.message);
                
                await axios.post(`${url}/send-email`, { email: data.email });

                setData({
                    name: "",
                    localisation: "",
                    password:"1234",
                    email: ""
                });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            //  console.error('Erreur:', error);
            //toast.error('Erreur lors de l\'ajout du restaurant ou de l\'envoi de l\'email');
        }

        //SENDREFFERAL
        await axios.post(`${url}/api/user/sendReferral`, {
            referrerEmail: localStorage.getItem("email"),
            referredEmail: data.email
        });


    }

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(prevData => ({ ...prevData, [name]: value }));
    }

    return (
        <div className='profile'>
            <div className='left-section'>
                <div className="parrainer-image">
                    <img src={assets.restaurantparrainer} alt="parrainer" />
                </div>
                <div className='partner-text'>
                    <p>Recommandez CESI EATS à vos collègues restaurateurs et gagnez 50 € pour chaque restaurant qui s'inscrit et utilise nos services. Aidez les autres à augmenter leur visibilité et à attirer plus de clients. Profitez de cette opportunité pour gagner de l'argent supplémentaire tout en soutenant votre communauté.</p>
                </div>
            </div>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className='profile-section flex-col'>
                    <p>Nom du utilisateur</p>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Nom du utilisateur' required />
                </div>
                <div className='profile-section flex-col'>
                    <p>Localisation</p>
                    <input name='localisation' onChange={onChangeHandler} value={data.localisation} type="text" placeholder='Localisation' required />
                </div>
                <div className='profile-section flex-col'>
                    <p>Téléphone</p>
                    <input name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Téléphone' required />
                </div>
                <div className='profile-section flex-col'>
                    <p>Courrier électronique</p>
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Courrier électronique' required />
                </div>
                <div className="button-container">
                    <button type="submit" className="btn btn-primary profile-btn">Ajouter</button>
                </div>
            </form>
        </div>
    )
}

export default ParrainerRestaurant;
