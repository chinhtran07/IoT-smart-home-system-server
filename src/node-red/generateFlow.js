import ActionSubflow from './actionSubflow.js';
import { NodeTypes } from './Node.js';
import { TimeTrigger, DeviceTrigger } from './triggerSubflow.js';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import Device from '../models/device.model.js';

function createBrokerNode(broker) {
  return {
    id: uuidv4(),
    type: 'mqtt-broker',
    broker,
    port: '1883',
    clientid: '',
    usetls: false,
    keepalive: '60',
    cleansession: true,
    credentials: { user: 'Admin', password: '123456' },
  };
}

async function getDeviceTopics(deviceId) {
  const device = await Device.findById(deviceId);
  if (!device || !device.topics) {
    throw new Error(`Device or topics not found for deviceId: ${deviceId}`);
  }
  return device.topics;
}

async function createTriggers(scenario, brokerNode) {
  return Promise.all(
    scenario.triggers.map(async (trigger) => {
      if (trigger.type === 'time') {
        const timeTrigger = new TimeTrigger(trigger._id, '');
        timeTrigger.build(trigger.startTime, trigger.endTime);
        return { [trigger._id]: timeTrigger };
      } else if (type === 'device') {
        const { publisher } = await getDeviceTopics(trigger.deviceId);
        const subscriberTopic = publisher[0];
        const deviceTrigger = new DeviceTrigger(trigger._id, '');
        deviceTrigger.build(subscriberTopic, brokerNode.id, [{
          t: trigger.comparator,
          v: trigger.value,
          vt: [typeof trigger.value === 'number' ? 'num' : 'str'],
        }]);
        return { [id]: deviceTrigger };
      }
    })
  );
}

async function createActions(scenario, brokerNode) {
  return Promise.all(
    scenario.actions.map(async (action) => {
      const { subscriber } = await getDeviceTopics(trigger.deviceId);
      const publisherTopic = subscriber[0]; 
      const actionSubflow = new ActionSubflow(trigger._id, '');
      actionSubflow.build(
        `{"${trigger.property}": "${trigger.value}"}`,
        publisherTopic,
        brokerNode.id
      );
      return { [trigger._id]: actionSubflow };
    })
  );
}

function connectTriggersAndActions(triggerSubflows, actionSubflows) {
  triggerSubflows.forEach(trigger => {
    const switchNode = trigger.flow.nodes.find(node => node.type === NodeTypes.SWITCH);
    actionSubflows.forEach(action => {
      const firstActionNode = action.flow.nodes.find(node => node.type === NodeTypes.CHANGE);
      if (firstActionNode) {
        trigger.connectNodes(switchNode, firstActionNode);
      }
    });
  });
}

function exportNodes(triggerSubflows, actionSubflows) {
  return [
    ...triggerSubflows.flatMap(trigger => trigger.export().nodes),
    ...actionSubflows.flatMap(action => action.export().nodes),
  ];
}

async function generateFlow(scenario, broker) {
    const brokerNode = createBrokerNode(broker);
    const triggers = await createTriggers(scenario, brokerNode);
    const actions = await createActions(scenario, brokerNode);

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

export default generateFlow;
