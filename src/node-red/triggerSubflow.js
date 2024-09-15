const { Node, NodeTypes } = require("./Node");
const SubflowBuilder = require("./SubflowBuilder");

class TimeTrigger extends SubflowBuilder {
  constructor(id, label) {
    super(id, label);
  }

  build(startTime, endTime) {
    const inject = this.addNode(NodeTypes.INJECT, "Inject Time", {
      payload: "",
      payloadType: "date",
      repeat: "60",
      once: true,
    });

    const functionNode = this.addNode(NodeTypes.FUNCTION, "Check Time Range", {
      func: `function parseTimeString(timeStr) {
        const parts = timeStr.split(':');
        return {
          hours: parseInt(parts[0], 10),
          minutes: parseInt(parts[1], 10),
          seconds: parseInt(parts[2], 10)
        };
      }
      
      const startTimeParts = parseTimeString('${startTime}');
      const endTimeParts = parseTimeString('${endTime}');
      
      var currentTime = new Date(msg.payload);
      
      var startTime = new Date(currentTime);
      startTime.setHours(startTimeParts.hours, startTimeParts.minutes, startTimeParts.seconds);
      
      var endTime = new Date(currentTime);
      endTime.setHours(endTimeParts.hours, endTimeParts.minutes, endTimeParts.seconds);
      
      if (currentTime >= startTime && currentTime <= endTime) {
        msg.payload = true;
      } else {
        msg.payload = false;
      }
      
      return msg;
    `,
      outputs: 1,
    });

    const switchNode = this.addNode(NodeTypes.SWITCH, "Switch", {
      property: "payload",
      rules: [{ t: "true" }],
      checkall: "true",
      outputs: 1,
    });

    this.connectNodes(inject, functionNode);
    this.connectNodes(functionNode, switchNode);
  }
}

class DeviceTrigger extends SubflowBuilder {
    constructor(id, label) {
        super(id, label);
    }
    
    build(topic, brokerId, rules) {
        const mqttIn = this.addNode(NodeTypes.MQTT_IN, "MQTT In", {
            topic: topic,
            qos: "2",
            datatype: "auto",
            broker: brokerId
        });

        const switchNode = this.addNode(NodeTypes.SWITCH, "SWITCH", {
            property: "payload",
            rules: rules,
            checkall: "true",
            outputs: 1,
        });
        
        this.connectNodes(mqttIn, switchNode);
    }
}

module.exports = { TimeTrigger, DeviceTrigger };