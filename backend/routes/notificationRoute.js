// notificationRoutes.js

import express from 'express';
import { getNotifications,markNotificationsAsRead ,createNotification } from '../controllers/notificationController.js';

const notificationRouter = express.Router();

notificationRouter.get('/notifications', getNotifications);
notificationRouter.post('/markAsRead', markNotificationsAsRead);
notificationRouter.post('/createNotification', createNotification);


export default notificationRouter;
