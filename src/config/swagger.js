const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '🚛 Fleet Management SaaS API',
            version: '1.0.0',
            description: `
## Multi-Tenant Fleet Management SaaS REST API

### Authentication
All protected endpoints require a **Bearer JWT token**.
1. Register a tenant: \`POST /api/auth/register-tenant\`
2. Login: \`POST /api/auth/login\`
3. Copy the \`token\` from the response
4. Click **Authorize** (🔒) and enter: \`Bearer <your_token>\`

### Multi-Tenancy
Data is fully isolated per tenant. Each user's token encodes their \`tenantId\`.

### Roles
| Role | Access |
|------|--------|
| \`superadmin\` | Full access across all resources |
| \`admin\` | Full access within tenant |
| \`manager\` | CRUD on vehicles, drivers, trips, logs |
| \`driver\` | View vehicles, update own trips |
      `,
            contact: {
                name: 'Fleet Management API',
                email: 'support@fleetmanagement.io',
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5006}`,
                description: 'Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                    },
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string' },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
