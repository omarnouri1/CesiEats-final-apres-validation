import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ResetPassword.css';

export const ResetPassword = () => {
    const { token } = useParams();
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const password = e.target.NewPassword.value;
        const verifyPassword = e.target.VerifyNewPassword.value;

        // Check if the passwords match
        if (password !== verifyPassword) {
            setIsSuccess(false);
            setMessage('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:4000/api/user/resetPassword/${token}`, { password });
            if (response.data.success) {
                setIsSuccess(true);
                setMessage('Mot de passe réinitialisé avec succès');
                setTimeout(() => {
                    window.location.href = 'http://localhost:5174/';
                }, 2000);
            } else {
                setIsSuccess(false);
                setMessage('Erreur: ' + response.data.message);
            }
        } catch (error) {
            setIsSuccess(false);
            setMessage('Erreur: ' + error.message);
        }
    };

    return (
        <form id="form-container" onSubmit={handleSubmit}>
            <label id="form-label">Nouveau mot de passe</label>
            <input id="form-input" type="password" name="NewPassword" required />
            <label id="form-label">Vérifiez le nouveau mot de passe</label>
            <input id="form-input" type="password" name="VerifyNewPassword" required />
            <button id="form-submit" type="submit">Soumettre</button>
            {message && <div id={isSuccess ? 'form-success' : 'form-alert'}>{message}</div>}
        </form>
    );
};
