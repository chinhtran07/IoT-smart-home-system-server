const { uniqueId } = require("lodash");
const Flow = require("./Flow");
const { Node, NodeTypes } = require("./Node");
const { v4: uuidv4 } = require('uuid');

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
    return uniqueId(uuidv4());
  }

  export() {
    return this.flow.toJSON();
  }
}

module.exports = SubflowBuilder;
