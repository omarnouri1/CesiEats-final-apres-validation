import express from 'express';
import { loginUser,registerUser,forgotPassword,resetPassword,getUserDetails,updateUser,deleteUser,listUsers,deleteUserById,removeUser,sendReferral,adduser} from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.post("/forgotpassword",forgotPassword);
userRouter.put("/resetpassword/:token", resetPassword);
userRouter.get('/details', getUserDetails);
userRouter.delete('/delete', deleteUser);
userRouter.put('/update', updateUser);
userRouter.get('/list', listUsers); 
userRouter.delete('/delete/:userId', deleteUserById);
userRouter.post("/remove",removeUser);
userRouter.post('/sendReferral', sendReferral);
userRouter.post("/add", adduser);

export default userRouter;