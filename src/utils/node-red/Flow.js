class Flow {
    constructor(id, label) {
        this.id = id;
        this.label = label;
        this.nodes = [];
        this.configs = [];
    }

    addNode(node) {
        this.nodes.push(node);
    }

    addConfig(config) {
        this.configs.push(config);
    }

    toJSON() {
        return {
            id: this.id,
            label: this.label,
            nodes: this.nodes.map(node => node.toJSON()),
            configs: this.configs.map(config => config.toJSON())
        };
    }
}

module.exports = Flow;