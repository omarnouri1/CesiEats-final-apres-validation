import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import livreurModel from "../models/livreurModel.js";
import developModel from "../models/developModel.js";
import restaurantModel from "../models/restaurantModel.js";
import servicetechniqueModel from "../models/servicetechniqueModel.js";
import servicecomercialModel from "../models/servicecommercialModel.js";
import notificationModel from "../models/notificationModel.js";
import Referral from "../models/referralModel.js";
import PromoCode from "../models/promocodeModel.js"
import Log from "../models/logModel.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs'
import { ToastContainer, toast } from 'react-toastify'; // Importa 'toast'
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

// Create token
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

// Login user


const logAttempt = async (action, role, email, user_id, success) => {
    try {
        const logEntry = new Log({
            action,
            role,
            email,
            user_id,
            success
        });
        await logEntry.save();
    } catch (error) {
        console.error('Error logging attempt:', error);
    }
};

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await userModel.findOne({email});

        if (!user) {
            await logAttempt('login', null, email, null, false);
            return res.json({success: false, message: "User does not exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            await logAttempt('login', user.role, email, user._id, false);
            return res.json({success: false, message: "Invalid credentials"});
        }
        
        const token = createToken(user._id);
        toast.success(user.role);
        await logAttempt('login', user.role, email, user._id, true);
        const userid=user._id;
        res.json({success: true, token, role: user.role, userid, email: user.email});
        
        const newnotif = new notificationModel({
            message: "A new user has been logged. Please check the connections log",
            role: "servicetechnique",
            status: "new"
        })
    
        try {
            await newnotif.save();
           // toast.success("done");
          //  res.json({ success: true, message: "NOTIF Added" })
        } catch (error) {
           // res.json({ success: false, message: "Error" })
        }

    } catch (error) {
        console.log(error);
        await logAttempt('login', null, email, null, false);
        res.json({success: false, message: "Error"});
    }
};

const registerUser = async (req, res) => {
    const {name, email, password, role} = req.body;

    try {
        // Check if user already exists
        const exists = await userModel.findOne({email});
        if (exists) {
            await logAttempt('register', role, email, null, false);
            return res.json({success: false, message: "User already exists"});
        }

        // Validate email format & strong password
        if (!validator.isEmail(email)) {
            await logAttempt('register', role, email, null, false);
            return res.json({success: false, message: "Please enter a valid email"});
        }
        if (password.length < 8) {
            await logAttempt('register', role, email, null, false);
            return res.json({success: false, message: "Please enter a strong password"});
        }

        // Hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({name, email, password: hashedPassword, role});
        const user = await newUser.save();

        // If role is "restaurateur", create new restaurant for the user
        if (role === "restaurateur") {
            const newRestaurant = new restaurantModel({ name: `${name}'s Restaurant`, email, password });
            await newRestaurant.save();
        }
        if (role === "livreur") {
            const newLivreur = new livreurModel({ name: name, email, password });
            await newLivreur.save();
        }
        if (role === "developtiers") {
            const newDevelop = new developModel({ name: name, email, password });
            await newDevelop.save();
        }
        if (role === "servicetechnique") {
            const newServicetechnique = new servicetechniqueModel({ name: name, email, password });
            await newServicetechnique.save();
        }
        if (role === "servicecomercial") {
            const newServicecomercial = new servicecomercialModel({ name: name, email, password });
            await newServicecomercial.save();
        }
        const token = createToken(user._id);
        await logAttempt('register', user.role, email, user._id, true);
        res.json({success: true, token, role: user.role});

    } catch (error) {
        console.log(error);
        await logAttempt('register', role, email, null, false);
        res.json({success: false, message: "Error"});
    }
};

// Forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // Recherche de l'utilisateur par email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        // Génération du token de réinitialisation de mot de passe
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetPasswordExpire = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 24 hours

        // Enregistrement du token et de la date d'expiration dans la base de données
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetPasswordExpire;
        await user.save();

        // Construction de l'URL de réinitialisation
        const resetUrl = `${req.protocol}://localhost:5174/resetpassword/${resetToken}`;

        // Contenu HTML de l'email
        const htmlContent = `
            <html>
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email de réinitialisation de mot de passe</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #333;
                        border-bottom: 2px solid tomato; /* Couleur tomate pour la bordure */
                        padding-bottom: 10px;
                        text-align: center; /* Centrer le titre */
                    }
                    p {
                        margin-bottom: 15px;
                        color: #555; /* Couleur du texte */
                    }
                    a {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: tomato; /* Couleur tomate pour le fond du bouton */
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 15px;
                        text-align: center; /* Centrer le texte dans le bouton */
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Réinitialisation de mot de passe</h1>
                    <p>Bonjour ${user.name},</p>
                    <p>Vous recevez cet email car vous avez demandé la réinitialisation de votre mot de passe.</p>
                    <p>Veuillez cliquer sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
                    <a href="${resetUrl}" style="margin: 0 auto; display: block; width: fit-content;">Réinitialiser mon mot de passe</a>
                    <p>Si vous n'avez pas demandé cela, veuillez ignorer cet email.</p>
                </div>
            </body>
            </html>
        `;

        // Configuration du transporteur de messagerie
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Options de l'email
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "Réinitialisation de mot de passe - CESI EATS",
            html: htmlContent // Utilisation du contenu HTML ici
        };

        // Envoi de l'email
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Email sent" });
    } catch (error) {
        console.error("Error occurred in forgotPassword:", error.message);
        res.json({ success: false, message: `Error: ${error.message}` });
    }
}


// Reset password
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Hachage du token
        // const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Recherche de l'utilisateur par le token de réinitialisation de mot de passe
        // console.log(hashedToken)
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({ success: false, message: "Invalid or expired token" });
        }

        // Hachage du nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Mise à jour du mot de passe de l'utilisateur et suppression du token de réinitialisation
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error("Error occurred in resetPassword:", error.message);
        res.json({ success: false, message: `Error: ${error.message}` });
    }
};

// Get user details
const getUserDetails = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password -resetPasswordToken -resetPasswordExpire');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Update user
const updateUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        if (name) user.name = name;
        if (email) {
            if (!validator.isEmail(email)) {
                return res.status(400).json({ message: 'Invalid email' });
            }
            user.email = email;
        }
        if (password) {
            if (password.length < 8) {
                return res.status(400).json({ message: 'Password must be at least 8 characters long' });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        if (role) user.role = role;

        await user.save();
        res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        console.error("Error occurred in updateUser:", error.message);
        res.status(500).json({ success: false, message: `Error: ${error.message}` });
    }
}

// Delete user
const deleteUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await userModel.findByIdAndDelete(decoded.id);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error occurred in deleteUser:", error.message);
        res.status(500).json({ success: false, message: `Error: ${error.message}` });
    }
}

const listUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.json({ success: true, data: users });
    } catch (error) {
        console.error("Error occurred in listUsers:", error.message);
        res.status(500).json({ success: false, message: `Error: ${error.message}` });
    }
};

const deleteUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await userModel.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error occurred in deleteUserById:", error.message);
        res.status(500).json({ success: false, message: `Error: ${error.message}` });
    }
};

const removeUser = async (req, res) => {
    try {
        const { id, email, role } = req.body;

        // Encuentra y elimina el usuario del modelo principal
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await userModel.findByIdAndDelete(id);

        // Encuentra y elimina el usuario de su tabla específica basado en el rol
        switch (role) {
            case 'servicetechnique':
                await servicetechniqueModel.findOneAndDelete({ email });
                break;
            case 'servicecomercial':
                await servicecomercialModel.findOneAndDelete({ email });
                break;
            case 'restaurateur':
                await restaurantModel.findOneAndDelete({ email });
                break;
            case 'livreur':
                await livreurModel.findOneAndDelete({ email });
                break;
            case 'developtiers':
                await developModel.findOneAndDelete({ email });
                break;
            default:
                break;
        }

        res.json({ success: true, message: "User removed" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error removing user" });
    }
};

const sendReferral = async (req, res) => {
    const { referrerEmail, referredEmail } = req.body;

    try {
        // Vérifier si l'invitation existe déjà
        const existingReferral = await Referral.findOne({ referredEmail });
        if (existingReferral) {
            return res.status(400).json({ message: 'This email has already been referred.' });
        }

        // Générer un token unique
        const token = crypto.randomBytes(32).toString('hex');

        // Enregistrer l'invitation dans la base de données
        const referral = new Referral({ referrerEmail, referredEmail, token });
        await referral.save();

        // Créer l'URL de parrainage pour la personne parrainée
        const signupUrl = `${req.protocol}://localhost:5173/signup?token=${token}`;

        // Envoyer l'email à la personne parrainée
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const referredMailOptions = {
            from: process.env.EMAIL_FROM,
            to: referredEmail,
            subject: 'Join us and get started!',
            text: `You have been invited to join our app by your friend. Sign up using the following link: ${signupUrl}`
        };

        await transporter.sendMail(referredMailOptions);

        // Générer un code promo unique pour le parrain
        const promoCode = uuidv4();

        // Enregistrer le code promo dans la base de données
        await PromoCode.create({ email: referrerEmail, code: promoCode });

        // Envoyer l'email au parrain avec le code promo
        const referrerMailOptions = {
            from: process.env.EMAIL_FROM,
            to: referrerEmail,
            subject: 'Thank you for referring a friend!',
            text: `Your friend ${referredEmail} has joined us. Here is your promo code: ${promoCode}`
        };

        await transporter.sendMail(referrerMailOptions);

        res.status(200).json({ message: 'Referral emails sent successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while sending the referral emails.' });
    }
};

const adduser = async (req, res) => {
    const { name = "newuser", email, localisation, password } = req.body;
    try {
        // Verificar si el restaurante ya existe
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Crear el nuevo restaurante
        const newUser = new userModel({ name, email, localisation, password });
        await newUser.save();

        res.status(201).json({ success: true, message: "User created successfully" });
    } catch (error) {
        console.error("Error adding restaurant:", error);
        res.status(500).json({ success: false, message: "Error adding restaurant" });
    }
};

export { loginUser, registerUser,deleteUser, forgotPassword, resetPassword, getUserDetails, updateUser, deleteUserById, listUsers,removeUser, sendReferral,adduser };

