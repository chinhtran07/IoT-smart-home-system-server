const mongoose = require('mongoose');
require('dotenv').config('.env');

// Định nghĩa các models
const User = require('../src/models/User');
const {Sensor, Device, Actuator} = require('../src/models/Device');
const AccessControl = require('../src/models/AccessControl');
const AutomationRule = require('../src/models/AutomationRule');
const Command = require('../src/models/Command');
const Event = require('../src/models/Event');
const Gateway = require('../src/models/Gateway');
const Notification = require('../src/models/Notification');
const Schedule = require('../src/models/Schedule');
const SensorData = require('../src/models/SensorData');
const Group = require('../src/models/Group');

// Kết nối với MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/smarthome')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Xóa tất cả dữ liệu cũ và tạo dữ liệu mẫu mới
const seedDatabase = async () => {
  try {
    // Xóa dữ liệu cũ


    // Tạo người dùng mẫu
    const user = new User({
      username: 'johndoe',
      password: 'password123', // Thay đổi mật khẩu với một giá trị hash trong thực tế
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      role: 'admin'
    });
    await user.save();

    // Tạo thiết bị mẫu
    const device = new Device({
      userId: user._id,
      name: 'Living Room Light',
      type: 'actuator',
      gatewayId: '64a2b8e4e4b0a2f6e84d0c66', // Sẽ được cập nhật sau khi tạo Gateway
      manufacturer: 'Philips',
      modelNumber: 'HueWhite',
      macAddress: '00:1A:2B:3C:4D:5E',
      status: 'online',
      lastUpdate: new Date(),
      configuration: {
        color: 'warm_white',
        maxBrightness: 100
      }
    });
    await device.save();

    // Tạo gateway mẫu
    const gateway = new Gateway({
      name: 'Home Gateway',
      macAddress: '00:1A:2B:3C:4D:5F',
      userId: user._id,
      protocol: 'MQTT',
      deviceIds: [device._id],
      ipAddress: '192.168.1.100',
      status: 'online',
      lastSeen: new Date()
    });
    await gateway.save();

    // Cập nhật thiết bị với gatewayId mới
    device.gatewayId = gateway._id;
    await device.save();

    // Tạo nhóm thiết bị mẫu
    const deviceGroup = new Group({
      groupName: 'Living Room Devices',
      userId: user._id,
      deviceIds: [device._id],
      groupType: 'room',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await deviceGroup.save();

    // Tạo quyền truy cập mẫu
    const accessControl = new AccessControl({
      userId: user._id,
      deviceId: device._id,
      permissionLevel: 'admin'
    });
    await accessControl.save();

    // Tạo quy tắc tự động hóa mẫu
    const automationRule = new AutomationRule({
      ruleName: 'Turn off lights when everyone leaves',
      triggerEvent: 'everyone_left',
      deviceIds: [device._id],
      groupIds: [deviceGroup._id],
      condition: { timeOfDay: '18:00' },
      action: { type: 'turn_off', devices: [device._id] },
      enabled: true
    });
    await automationRule.save();

    // Tạo lệnh điều khiển mẫu
    const command = new Command({
      deviceId: device._id,
      commandType: 'turn_on',
      parameters: { brightness: 75 },
      timestamp: new Date()
    });
    await command.save();

    // Tạo cảm biến mẫu
    // const sensor = new Sensor({
    //   unit: 'Celsius'
    // });
    // await sensor.save();

    // Tạo bộ điều khiển mẫu
    // const actuator = new Actuator({
    //   status: true
    // });
    // await actuator.save();

    // Tạo sự kiện mẫu
    const event = new Event({
      deviceId: device._id,
      eventType: 'motion_detected',
      eventData: { sensitivity: 'high', duration: 5 },
      timestamp: new Date()
    });
    await event.save();

    // Tạo thông báo mẫu
    const notification = new Notification({
      userId: user._id,
      type: 'device_error',
      message: 'Living Room Light is offline',
      read: false,
      timestamp: new Date()
    });
    await notification.save();

    // Tạo lịch trình mẫu
    const schedule = new Schedule({
      name: 'Night Time Lights',
      userId: user._id,
      deviceIds: [device._id],
      groupIds: [deviceGroup._id],
      action: 'turn_on',
      parameters: { brightness: 50 },
      scheduleType: 'recurring',
      date: null,
      recurrence: {
        interval: 'daily',
        daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        timeOfDay: '20:00'
      },
      enabled: true,
      lastExecuted: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await schedule.save();

    // Tạo dữ liệu cảm biến mẫu
    const sensorData = new SensorData({
      deviceId: device._id,
      value: 22.5,
      timestamp: new Date()
    });
    await sensorData.save();

    console.log('Database seeding completed');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding database:', err);
    mongoose.disconnect();
  }
};

seedDatabase();
