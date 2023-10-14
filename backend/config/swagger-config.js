import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Your API Documentation',
            version: '1.0.0',
            description: 'API documentation for your Express.js application',
        },
    },
    // Define API routes where Swagger should look for JSDoc comments
    apis: ['backend/*.mjs', 'backend/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
