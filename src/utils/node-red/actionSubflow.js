const { NodeTypes } = require("./Node");
const SubflowBuilder = require("./SubflowBuilder");

class ActionSubflow extends SubflowBuilder {
  constructor(id, label) {
    super(id, label);
  }

  build(action, topic, brokerId) {
    const changeNode = this.addNode(NodeTypes.CHANGE, "Change Node", {
      rules: [
        {
          t: "set",
          p: "payload",
          pt: "msg",
          to: `${action}`,
          tot: "json",
        },
      ],
    });

    const mqttOut = this.addNode(NodeTypes.MQTT_OUT, "MQTT Out", {
      topic: topic,
      qos: "0",
      retain: true,
      broker: brokerId,
    });

    this.connectNodes(changeNode, mqttOut);
  }
}

module.exports = ActionSubflow;