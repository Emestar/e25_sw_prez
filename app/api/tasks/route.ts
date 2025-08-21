import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Récupérer la liste de tous les tâches
 *     description: |
 *       Retourne la liste complète de tous les tâches enregistrées en base de données,
 *       triés par date de création décroissante (plus récent en premier).
 *     tags:
 *       - tâches
 *     responses:
 *       200:
 *         description: Liste des tâches récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: "3 tâche(s) trouvé(s)"
 *             examples:
 *               liste_vide:
 *                 summary: Liste vide
 *                 value:
 *                   success: true
 *                   data: []
 *                   message: "0 tâche(s) trouvé(s)"
 *               liste_avec_taches:
 *                 summary: Liste avec tâches
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: 1
 *                       name: "iPhone 15 Pro"
 *                       price: 1199.99
 *                       createdAt: "2024-01-15T10:30:00.000Z"
 *                       updatedAt: "2024-01-15T10:30:00.000Z"
 *                     - id: 2
 *                       name: "MacBook Air M2"
 *                       price: 1299.99
 *                       createdAt: "2024-01-15T10:25:00.000Z"
 *                       updatedAt: "2024-01-15T10:25:00.000Z"
 *                   message: "2 tâche(s) trouvé(s)"
 *       500:
 *         description: Erreur serveur lors de la récupération
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Erreur lors de la récupération des tâches"
 */
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: tasks,
      message: `${tasks.length} tâche(s) trouvée(s)`
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des tâches'
      },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Créer un nouveau produit
 *     description: |
 *       Crée un nouveau produit en base de données après validation des données.
 *       Le nom doit être une chaîne non vide et le prix un nombre positif.
 *     tags:
 *       - Tâches
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *           examples:
 *             produit_simple:
 *               summary: Produit standard
 *               value:
 *                 name: "iPhone 15 Pro"
 *                 price: 1199.99
 *             produit_economique:
 *               summary: Produit économique
 *               value:
 *                 name: "Écouteurs basiques"
 *                 price: 19.99
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: "Tâche créé avec succès"
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 name: "iPhone 15 Pro"
 *                 price: 1199.99
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-15T10:30:00.000Z"
 *               message: "Tâche créé avec succès"
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               nom_manquant:
 *                 summary: Nom manquant
 *                 value:
 *                   success: false
 *                   error: "Le titre de la tâche est requis et doit être une chaîne non vide"
 *               prix_invalide:
 *                 summary: Prix invalide
 *                 value:
 *                   success: false
 *                   error: "Le prix doit être un nombre positif"
 *       500:
 *         description: Erreur serveur lors de la création
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Erreur lors de la création de la tâche"
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, status, priority, dueDate } = body

    // Validation des données
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Le titre de la tâche est requis et doit être une chaîne non vide'
        },
        { status: 400 }
      )
    }

    // if (!priority || typeof priority !== 'string' || priority.trim().length === 0) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: 'La priorite de la tâche est requis et doit être une chaîne non vide'
    //     },
    //     { status: 400 }
    //   )
    // }

    // if (!price || typeof price !== 'number' || price <= 0) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: 'Le prix doit être un nombre positif'
    //     },
    //     { status: 400 }
    //   )
    // }

    // Créer la tâche
    // const task = await prisma.task.create({
    //   data: {
    //     title: title.trim()
    //   }
    // })

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description,
        status: status,
        priority: priority,
        dueDate: dueDate
      }
    })

    return NextResponse.json(
      {
        success: true,
        data: task,
        message: 'Tâche créé avec succès'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la création du tâche'
      },
      { status: 500 }
    )
  }
}