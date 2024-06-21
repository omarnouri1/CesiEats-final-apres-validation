import React, { createContext, useState, useEffect } from 'react';

// Créer le contexte utilisateur
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fonction pour récupérer les détails de l'utilisateur
        const fetchUserDetails = async () => {
            try {
                const response = await fetch('/details', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setUser(data);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des détails utilisateur:', error);
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
};
