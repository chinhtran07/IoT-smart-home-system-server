import { connectToGateway, clients } from './mqttClient.js';
import Gateway from "../models/gateway.model.js"; 

const connectToGateways = async (gatewayIds = []) => {
    try {
        // If specific gateway IDs are provided, filter by them; otherwise, fetch all gateways
        const query = gatewayIds.length > 0 ? { _id: { $in: gatewayIds } } : {};
        const gateways = await Gateway.find(query); // Use find with a dynamic query

        await Promise.all(gateways.map(gateway => connectToGateway(gateway))); // Connect to all gateways in parallel
    } catch (err) {
        console.error('Error connecting to gateways:', err);
    }
};

const onGatewayCreated = async (gateway) => {
    // Check if client for the gateway is not already connected
    if (!clients[gateway._id]) {
        await connectToGateways([gateway._id]); // Connect to the newly created gateway
    }
};

const onDeviceCreated = async (device) => {
    try {
        const gateway = await Gateway.findById(device.gatewayId); // Find the gateway by device's gatewayId

        if (gateway && !clients[gateway._id]) {
            await connectToGateways([gateway._id]); // Connect to the gateway if not already connected
        }
    } catch (err) {
        console.error('Error connecting to gateway for device:', err);
    }
};

export {
    connectToGateways,
    onGatewayCreated,
    onDeviceCreated,
};
