import Actuator from '../models/actuator.model.js';
import Sensor from '../models/sensor.model.js';

class DeviceFactory {
  static createDevice(deviceData) {
    switch (deviceData.type) {
      case 'actuator':
        return new Actuator({
          ...deviceData,
          actions: deviceData.actions || [], // Ensure actions are included
        });
      case 'sensor':
        return new Sensor(deviceData);
      default:
        throw new Error('Invalid device type');
    }
  }
}

export default DeviceFactory;
