import swaggerJsdoc from 'swagger-jsdoc';
import YAML from 'yamljs';
import path from 'path';
import fs from 'fs';

// Define options for Swagger JSDoc
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Smart Home API',
            version: '1.0.0',
            description: 'API documentation for the Smart Home system',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
    },
    apis: ['../routes/*.routes.js'], // Adjust the path as needed
};

// Generate Swagger specification
const swaggerSpec = swaggerJsdoc(options);

// Read Swagger YAML file
const file = fs.readFileSync(path.resolve('swagger.yml'), 'utf8');
const swaggerDocument = YAML.parse(file);

export { swaggerSpec, swaggerDocument };
