const NodeTypes = {
    MQTT_IN: 'mqtt in',
    FUNCTION: 'function',
    SWITCH: 'switch',
    MQTT_OUT: 'mqtt out',
    HTTP_REQUEST: 'http request',
    DEBUG: 'debug',
    INJECT: 'inject',
    CHANGE: 'change',
    BROKER: 'mqtt-broker'
};

Object.freeze(NodeTypes);

class Node {
    constructor(type, id ,name, config = {}) {
        if (!Object.values(NodeTypes).includes(type)) {
            throw new Error(`Invalid node type ${type}`);
        }
        this.type = type;
        this.id = id;
        this.name = name;
        this.config = config;
        this.wires = [];
    }

    addWire(targetNodeId) {
        this.wires.push(targetNodeId);
    }

    toJSON(flowId) {
        return {
            id: this.id,
            type: this.type,
            z: flowId,
            name: this.name,
            wires: [this.wires.map(wire => wire)],
            ...this.config
        };
    }

    getId() {
        return this.id;
    }

}

module.exports = {
    NodeTypes,
    Node
}