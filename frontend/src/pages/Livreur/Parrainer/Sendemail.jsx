const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const app = express();
const PORT = 5000;

// Configurez votre clé API SendGrid
sgMail.setApiKey('VOTRE_CLE_API_SENDGRID');

app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
    const { email } = req.body;

    const msg = {
        to: email,
        from: 'noreply@cesieats.com', // Utilisez l'email vérifié dans votre compte SendGrid
        subject: 'Bienvenue chez CESI EATS',
        text: 'Félicitations, grâce à Bebmbos, vous faites partie de l\'équipe CESI EATS. Pour accéder, cliquez sur le lien suivant : http://localhost:5174/cart',
    };

    sgMail.send(msg)
        .then(() => {
            res.status(200).send('Email envoyé');
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Erreur lors de l\'envoi de l\'email');
        });
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
