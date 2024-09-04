const Flow = require('../src/utils/flow');
const { Node, NodeTypes } = require('../src/utils/node');

// Tạo flow mới
const myFlow = new Flow("98asdasd87a6da8","My Flow");

// Tạo các node sử dụng enum và cấu hình linh hoạt
const mqttInNode = new Node(NodeTypes.MQTT_IN, "mqtt_in", "MQTT Input", 100, 100, {
    topic: 'sensor/data',
    qos: 1
});
const functionNode = new Node(NodeTypes.FUNCTION, "process_data", "Process Data", 300, 100, {
    function: 'msg.payload = msg.payload * 2; return msg;'
});
const mqttOutNode = new Node(NodeTypes.MQTT_OUT, "mqtt_out", "MQTT Output", 500, 100, {
    topic: 'sensor/processed'
});

// Thêm các node vào flow
myFlow.addNode(mqttInNode);
myFlow.addNode(functionNode);
myFlow.addNode(mqttOutNode);

// Thêm kết nối giữa các node
mqttInNode.addWire(functionNode.getId());
functionNode.addWire(mqttOutNode.getId());

// Chuyển đổi flow thành JSON
const flowJSON = myFlow.toJSON();

console.log(JSON.stringify(flowJSON, null, 2));
