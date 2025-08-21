import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Laboratoire 2 - API REST',
      version: '1.0.0',
      description: 'Documentation des services web REST pour la gestion de produits',
      contact: {
        name: 'Équipe de développement',
        email: 'contact@exemple.com'
      }
    },
    servers: [
      {
        url:'http://localhost:3000',
        description: 'Serveur de développement'
      }
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['id', 'name', 'price', 'createdAt', 'updatedAt'],
          properties: {
            id: {
              type: 'integer',
              description: 'Identifiant unique du produit',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Nom du produit',
              example: 'iPhone 15 Pro'
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Prix du produit en euros',
              example: 1199.99
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création du produit',
              example: '2024-01-15T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de dernière modification',
              example: '2024-01-15T11:45:00.000Z'
            }
          }
        },
        ProductInput: {
          type: 'object',
          required: ['name', 'price'],
          properties: {
            name: {
              type: 'string',
              description: 'Nom du produit',
              example: 'iPhone 15 Pro',
              minLength: 1
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Prix du produit en euros',
              example: 1199.99,
              minimum: 0.01
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Données de la réponse'
            },
            message: {
              type: 'string',
              description: 'Message descriptif',
              example: 'Opération réussie'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Message d\'erreur',
              example: 'Une erreur est survenue'
            }
          }
        }
      }
    }
  },
  apis: ['./app/api/**/*.ts']
}

export const swaggerSpec = swaggerJSDoc(options)
