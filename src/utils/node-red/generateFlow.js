const ActionSubflow = require("./actionSubflow");
const { NodeTypes } = require("./Node");
const { TimeTrigger, DeviceTrigger } = require("./triggerSubflow");
const _ = require("lodash");

function createBrokerNode(broker) {
  return {
    id: "mqtt_broker_id",
    type: "mqtt-broker",
    broker: broker.ipAddress,
    port: "1883",
    clientid: "",
    usetls: false,
    keepalive: "60",
    cleansession: true,
    credentials: {
      user: "Admin",
      password: "123456",
    },
  };
}

function createTriggers(scenario, brokerNode) {
  return scenario.triggers.reduce((acc, trigger) => {
    if (trigger.type === "time") {
      const timeTrigger = new TimeTrigger(trigger._id, "");
      timeTrigger.build(trigger.startTime, trigger.endTime);
      acc[trigger._id] = timeTrigger;
    } else if (trigger.type === "device") {
      const topic = trigger.device.topics.publisher[0];
      const deviceTrigger = new DeviceTrigger(trigger._id, "");
      deviceTrigger.build(topic, brokerNode.id, [{
        t: trigger.comparator, 
        v: trigger.deviceStatus, 
        vt: [typeof trigger.deviceStatus === "number" ? "num" : "str"],
      }]);
      acc[trigger._id] = deviceTrigger;
    }
    return acc;
  }, {});
}

function createActions(scenario, brokerNode) {
  return scenario.actions.reduce((acc, action) => {
    if (!acc[action._id]) {
      const topic = action.device.topics.subscriber[0];
      const actionSubflow = new ActionSubflow(action._id, "");
      actionSubflow.build(
        `{\"action\": \"${action.type}\", \"${action.property}\": ${action.value}}`,
        topic, brokerNode.id
      );
      acc[action._id] = actionSubflow;
    }
    return acc;
  }, {});
}

function connectTriggersAndActions(triggerSubflows, actionSubflows) {
  triggerSubflows.forEach((trigger) => {
    const switchNode = trigger.flow.nodes.find((node) => node.type === NodeTypes.SWITCH);
    actionSubflows.forEach((action) => {
      const firstActionNode = action.flow.nodes.find((node) => node.type === NodeTypes.CHANGE);
      if (firstActionNode) {
        trigger.connectNodes(switchNode, firstActionNode);
      }
    });
  });
}

function exportNodes(triggerSubflows, actionSubflows) {
  return [
    ...triggerSubflows.flatMap((trigger) => trigger.export().nodes),
    ...actionSubflows.flatMap((action) => action.export().nodes),
  ];
}

function generateFlow(scenario, broker) {
  const brokerNode = createBrokerNode(broker);

  const triggers = createTriggers(scenario, brokerNode);
  const actions = createActions(scenario, brokerNode);

  const triggerSubflows = Object.values(triggers);
  const actionSubflows = Object.values(actions);

  connectTriggersAndActions(triggerSubflows, actionSubflows);

  const combinedNodes = exportNodes(triggerSubflows, actionSubflows);

  return JSON.stringify({
    id: scenario._id,
    label: scenario.name,
    nodes: combinedNodes,
    configs: [brokerNode],
  }, null, 2);
}

module.exports = generateFlow;
