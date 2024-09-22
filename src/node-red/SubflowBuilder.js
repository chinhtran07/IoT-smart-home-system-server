// SubflowBuilder.js
import Flow from './Flow.js';
import { Node, NodeTypes } from './Node.js';
import { v4 as uuidv4 } from 'uuid';

class SubflowBuilder {
    constructor(id, label) {
        this.flow = new Flow(id, label);
    }

    addNode(type, name, config = {}) {
        const id = this.generateId();
        const node = new Node(type, id, name, config);
        this.flow.addNode(node);
        return node;
    }

    connectNodes(sourceNode, targetNode) {
        sourceNode.addWire(targetNode.getId());
        return this;
    }

    generateId() {
        return uuidv4();
    }

    export() {
        return this.flow.toJSON();
    }
}

export default SubflowBuilder;
