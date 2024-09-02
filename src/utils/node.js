const NodeTypes = {
    MQTT_IN: 'mqtt in',
    FUNCTION: 'function',
    MQTT_OUT: 'mqtt out',
    HTTP_IN: 'http in',
    HTTP_OUT: 'http out',
    DEBUG: 'debug',
};

Object.freeze(NodeTypes);

class Node {
    constructor(type, id ,name, x, y, config = {}) {
        if (!Object.values(NodeTypes).includes(type)) {
            throw new Error(`Invalid node type ${type}`);
        }
        this.type = type;
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
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
            x: this.x,
            y: this.y,
            wires: this.wires.map(wire => [wire]),
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