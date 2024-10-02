export const validateDeviceCreation = [
    body('name').notEmpty().withMessage('Device name is required'),
    body('type').isIn(['actuator', 'sensor']).withMessage('Type must be either actuator or sensor'),
    body('macAddress')
        .matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)
        .withMessage('A valid MAC address is required'),
    body('firmwareVersion').notEmpty().withMessage('Firmware version is required'),
];
