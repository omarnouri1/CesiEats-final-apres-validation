import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    message: { type: String, required: false },
    role: { type: String, required: false },
    userid: { type: String, required: false },
    status: { type: String, required: false }
});

const notificationModel = mongoose.models.notification || mongoose.model('notification', notificationSchema);

export default notificationModel;
