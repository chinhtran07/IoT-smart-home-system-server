import { connectToGateway, clients } from './mqttClient.js';
import mysqlDb from '../models/mysql/index.js';

const connectToGateways = async (gatewayIds = []) => {
    try {
        const gateways = gatewayIds.length > 0
            ? await mysqlDb.Gateway.findAll({ where: { id: gatewayIds } })
            : await mysqlDb.Gateway.findAll();

        for (const gateway of gateways) {
            await connectToGateway(gateway);
        }
    } catch (err) {
        console.error('Error connecting to gateways:', err);
    }
};

const onGatewayCreated = async (gateway) => {
    if (!clients[gateway.id]) {
        await connectToGateways([gateway.id]);
    }
};

const onDeviceCreated = async (device) => {
    const gateway = await mysqlDb.Gateway.findByPk(device.gatewayId);
    if (gateway && !clients[gateway.id]) {
        await connectToGateways([gateway.id]);
    }
};

export {
    connectToGateways,
    onGatewayCreated,
    onDeviceCreated,
};
