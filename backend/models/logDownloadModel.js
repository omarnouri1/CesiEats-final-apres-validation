import mongoose from 'mongoose';

const logDownloadSchema = new mongoose.Schema({
    directory: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const LogDownload = mongoose.model('LogDownload', logDownloadSchema);

export default LogDownload;
