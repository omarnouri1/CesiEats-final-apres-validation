// notificationController.js

import notificationModel from '../models/notificationModel.js';

// Obtener todas las notificaciones
const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel.find({});
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error al obtener las notificaciones:", error);
    res.status(500).json({ message: "Error al obtener las notificaciones" });
  }
};

const markNotificationsAsRead = async (req, res) => {
    try {
      await notificationModel.updateMany({ status: { $ne: "already read" } }, { $set: { status: "already read" } });
      res.status(200).json({ message: "Todas las notificaciones han sido actualizadas" });
    } catch (error) {
      console.error("Error al actualizar las notificaciones:", error);
      res.status(500).json({ message: "Error al actualizar las notificaciones" });
    }
  };
  
  const createNotification = async (req, res) => {
    try {
      const notificationData = req.body;
      const notification = await notificationModel.create(notificationData);
      res.status(201).json(notification);
    } catch (error) {
      console.error("Error al crear la notificación:", error);
      res.status(500).json({ message: "Error al crear la notificación" });
    }
  };
  
  export { getNotifications, markNotificationsAsRead, createNotification };