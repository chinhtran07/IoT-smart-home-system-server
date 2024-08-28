const Device = require('../models/Device');

const checkDeviceStatus = async (req, res, next) => {
    try {
      const { deviceId } = req.params;
      const device = await Device.findById(deviceId);
  
      if (!device || device.status !== 'online') {
        return res.status(400).send('Device is offline or does not exist.');
      }
  
      next();
    } catch (err) {
      next(err);
    }
};
  
module.exports = checkDeviceStatus;