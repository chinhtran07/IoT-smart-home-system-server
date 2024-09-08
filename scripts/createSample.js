const generateFlow = require("../src/utils/node-red/generateFlow");

// MQTT broker thông tin
const broker = {
  ipAddress: "192.168.2.151",
};

// Trigger: Kích hoạt khi nhiệt độ vượt quá 30°C
const temperatureSensor = {
  _id: "device_1",
  name: "Temperature Sensor",
  topics: {
    publisher: ["home/temperature"],
    subscriber: ["home/temperature/set"],
  },
};

// Action: Điều chỉnh điều hòa nhiệt độ
const airConditioner = {
  _id: "device_2",
  name: "Air Conditioner",
  topics: {
    publisher: ["home/air_conditioner"],
    subscriber: ["home/air_conditioner/set"],
  },
};

// Kịch bản tự động hóa
const automationScenario = {
  _id: "scenario_1",
  name: "Temperature Control",
  triggers: [
    {
      _id: "trigger_1",
      type: "device",
      device: temperatureSensor,
      comparator: "gt",
      deviceStatus: 30, // Kích hoạt khi nhiệt độ > 30°C
    },
  ],
  actions: [
    {
      _id: "action_1",
      device: airConditioner,
      type: "modify",
      property: "temperature",
      value: 24, // Điều chỉnh điều hòa xuống 24°C
    },
    {
      _id: "action_2",
      device: airConditioner,
      type: "control",
      value: "ON",
    }
  ],
};

// Tạo flow từ kịch bản
const flow = generateFlow(automationScenario, broker);

// Kết quả flow
console.log(flow);
