//const Log = require('../models/logModel'); // Ajusta según tu estructura
import Log from "../models/logModel.js";
import LogDownload from '../models/logDownloadModel.js';
import fs from 'fs'


const getAllLogs = async (req, res) => {
    try {
        const logs = await Log.find();
        res.json({ success: true, data: logs });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.json({ success: false, message: "Error fetching logs" });
    }
};
const getAllLogDownloads = async (req, res) => {
    try {
      const logDownloads = await LogDownload.find();
      res.json({ success: true, data: logDownloads });
    } catch (error) {
      console.error('Error fetching log downloads:', error);
      res.status(500).json({ success: false, message: "Error fetching log downloads" });
    }
  };
//odule.exports = { getAllLogs };

export { getAllLogs, getAllLogDownloads };
