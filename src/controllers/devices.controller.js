const deviceService = require('../services/device.services'); 
const CustomError = require('../utils/CustomError');

const getAllDevices = async (req, res, next) => {
    try {
        const devices = await deviceService.getAllDevices();
        res.status(200).json(devices);
    } catch (error) {
        next(error);
    }
}


const getDeviceById = async (req, res, next) => {
    try {
        const deviceId = req.params.id;
        const device = await deviceService.getDeviceById(deviceId);
        res.status(200).json(device);
    } catch (error) {
        next(error);
    }
}

const updateDevice = async (req, res, next) => {
    try {
        const deviceId = req.params.id;
        const dataToUpdate = req.body; 

        if (!dataToUpdate || Object.keys(dataToUpdate).length === 0) {
            return new CustomError("No data provided for update", 400);
        }

        // Gọi service để thực hiện cập nhật thiết bị
        const updatedDevice = await deviceService.updateDevice(deviceId, dataToUpdate);

        // Kiểm tra xem có cập nhật thành công hay không
        if (updatedDevice) {
            return res.sendStatus(204);
        } else {
            return res.status(404).json({ message: "Device not found" });
        }
    } catch (error) {
        next(error); // Truyền lỗi tới middleware xử lý lỗi
    }
};


const deleteDevice = async (req, res, next) => {
    try {
        const deviceId = req.params.id;
        await deviceService.deleteDevice(deviceId);
        res.status(204);
    } catch (error) {
        next(error);
    }
}


const getDevicesOwner = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const page = req.query.page;
        const limit = req.query.limit;
        const devices = await deviceService.getDevicesOwner(userId, page, limit);
        res.status(200).json(devices);
    } catch (error) {
        next(error);
    }
}

const getDevicesByAccessControl = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const page = req.query.page;
        const limit = req.query.limit;
        const devices = await deviceService.getDevicesByAccessControl(userId, page, limit);
        res.status(200).json(devices);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllDevices,
    getDeviceById,
    updateDevice,
    deleteDevice,
    getDevicesOwner,
    getDevicesByAccessControl
}