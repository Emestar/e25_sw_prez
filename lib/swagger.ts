import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gestionnaire de Tâches - API REST',
      version: '1.0.0',
      description: 'Documentation des services web REST pour la gestion de tâches avec priorités, statuts et dates d\'échéance',
      contact: {
        name: 'Équipe de développement',
        email: 'contact@exemple.com'
      }
    },
    servers: [
      {
        url: ((process as any).env?.NODE_ENV === 'production') 
          ? 'https://votre-app.vercel.app'
          : 'http://localhost:3000',
        description: ((process as any).env?.NODE_ENV === 'production') 
          ? 'Serveur de production' 
          : 'Serveur de développement'
      }
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['id', 'title', 'priority', 'status', 'createdAt', 'updatedAt'],
          properties: {
            id: { 
              type: 'integer', 
              example: 1,
              description: 'Identifiant unique de la tâche'
            },
            title: { 
              type: 'string', 
              example: 'Réviser le cours de Services Web',
              description: 'Titre de la tâche (obligatoire)'
            },
            description: { 
              type: 'string', 
              example: 'Relire les chapitres 1 à 5 et faire les exercices pratiques',
              description: 'Description détaillée de la tâche (optionnelle)'
            },
            priority: { 
              type: 'string', 
              enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
              example: 'MEDIUM',
              description: 'Niveau de priorité de la tâche'
            },
            status: { 
              type: 'string', 
              enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
              example: 'PENDING',
              description: 'Statut actuel de la tâche'
            },
            dueDate: { 
              type: 'string', 
              format: 'date-time',
              example: '2024-12-20T14:00:00',
              description: 'Date et heure d\'échéance (optionnelle)'
            },
            createdAt: { 
              type: 'string', 
              format: 'date-time',
              example: '2024-12-15T10:30:00',
              description: 'Date de création automatique'
            },
            updatedAt: { 
              type: 'string', 
              format: 'date-time',
              example: '2024-12-15T11:45:00',
              description: 'Date de dernière modification'
            }
          }
        },
        TaskInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { 
              type: 'string', 
              example: 'Réviser le cours de Services Web',
              description: 'Titre de la tâche (obligatoire)'
            },
            description: { 
              type: 'string', 
              example: 'Relire les chapitres 1 à 5 et faire les exercices pratiques',
              description: 'Description détaillée de la tâche (optionnelle)'
            },
            priority: { 
              type: 'string', 
              enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
              example: 'MEDIUM',
              description: 'Niveau de priorité de la tâche (défaut: MEDIUM)'
            },
            dueDate: { 
              type: 'string', 
              format: 'date-time',
              example: '2024-12-20T14:00:00',
              description: 'Date et heure d\'échéance (optionnelle)'
            }
          }
        },
        StatusUpdate: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { 
              type: 'string', 
              enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
              example: 'IN_PROGRESS',
              description: 'Nouveau statut de la tâche'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { 
              type: 'boolean', 
              example: true,
              description: 'Indique si l\'opération a réussi'
            },
            data: { 
              type: 'object',
              description: 'Données de la réponse (en cas de succès)'
            },
            error: { 
              type: 'string',
              example: 'Erreur lors de la récupération des tâches',
              description: 'Message d\'erreur (en cas d\'échec)'
            }
          }
        }
      }
    }
  },
  apis: ['./app/api/**/*.ts']
}

export const swaggerSpec = swaggerJSDoc(options)
