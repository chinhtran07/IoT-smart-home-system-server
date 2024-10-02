import { body } from 'express-validator';

export const validateGatewayCreation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('ipAddress').isIP().withMessage('A valid IP address is required'),
    body('macAddress')
        .matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)
        .withMessage('A valid MAC address is required'),
];
