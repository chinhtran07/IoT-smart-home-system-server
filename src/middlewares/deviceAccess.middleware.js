import Device from '../models/device.model.js'; 
import AccessControl from '../models/accessControl.model.js'; 

const checkDeviceAccess = async (req, res, next) => {
  try {
    const deviceId = req.params.id || req.body.deviceId;

    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Check if the device belongs to the user
    if (device.owner.toString() === req.user._id.toString()) {
      next(); // User is the owner of the device
      return;
    }

    // Check AccessControl for additional permissions
    const access = await AccessControl.findOne({
      userId: req.user._id,
      'permissions.device': deviceId,
    });

    if (!access) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next(); // User has access through AccessControl
  } catch (err) {
    next(err);
  }
};

export default checkDeviceAccess;
