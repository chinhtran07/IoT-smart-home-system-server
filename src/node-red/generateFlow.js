import ActionSubflow from './actionSubflow.js';
import { NodeTypes } from './Node.js';
import { TimeTrigger, DeviceTrigger } from './triggerSubflow.js';
import _ from 'lodash';
import mongodb from '../models/mongo/index.js';
import { v4 as uuidv4 } from 'uuid';

function createBrokerNode(broker) {
    return {
        id: uuidv4(),
        type: "mqtt-broker",
        broker: broker,
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

async function createTriggers(scenario, brokerNode) {
    return Promise.all(scenario.triggers.map(async (trigger) => {
        if (trigger.type === "time") {
            const timeTrigger = new TimeTrigger(trigger.id, "");
            timeTrigger.build(trigger.detail.startTime, trigger.detail.endTime);
            return { [trigger.id]: timeTrigger };
        } else if (trigger.type === "device") {
            const topic = await mongodb.Topic.findOne({ deviceId: trigger.deviceId });
            const subscriberTopic = topic.topics.publisher[0];
            const deviceTrigger = new DeviceTrigger(trigger.id, "");
            deviceTrigger.build(subscriberTopic, brokerNode.id, [{
                t: trigger.detail.comparator,
                v: trigger.detail.deviceStatus,
                vt: [typeof trigger.detail.deviceStatus === "number" ? "num" : "str"],
            }]);
            return { [trigger.id]: deviceTrigger };
        }
    }));
}

async function createActions(scenario, brokerNode) {
    return Promise.all(scenario.actions.map(async (action) => {
        const topic = await mongodb.Topic.findOne({ deviceId: action.deviceId });
        const publisherTopic = topic.topics.subscriber[0];
        const actionSubflow = new ActionSubflow(action.id, "");
        actionSubflow.build(
            `{\"${action.property}\": \"${action.value}\"}`,
            publisherTopic, brokerNode.id
        );
        return { [action.id]: actionSubflow };
    }));
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

async function generateFlow(scenario, broker) {
    const brokerNode = createBrokerNode(broker);
    const triggers = await createTriggers(scenario, brokerNode);
    const actions = await createActions(scenario, brokerNode);

    const triggerSubflows = Object.values(triggers);
    const actionSubflows = Object.values(actions);

    connectTriggersAndActions(triggerSubflows, actionSubflows);

    const combinedNodes = exportNodes(triggerSubflows, actionSubflows);

    return JSON.stringify({
        id: scenario.id,
        label: scenario.name,
        nodes: combinedNodes,
        configs: [brokerNode],
    }, null, 2);
}

export default generateFlow;
