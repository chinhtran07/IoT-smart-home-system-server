const swaggerJsdoc = require('swagger-jsdoc');
const YAML = require('yamljs');
const path = require('path');
const fs = require('fs');


// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Smart Home API',
//       version: '1.0.0',
//       description: 'API documentation for the Smart Home system',
//     },
//     servers: [
//       {
//         url: 'http://localhost:3000',
//         description: 'Development server',
//       },
//     ],
//   },
//   apis: ['../routes/*.routes.js'], 
// };

// const swaggerSpec = swaggerJsdoc(options);

const file = fs.readFileSync(path.resolve('swagger.yml'), 'utf8');

const swaggerDocument = YAML.parse(file);

module.exports = swaggerDocument;