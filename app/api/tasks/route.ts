import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
// import { parseISO, isValid } from 'date-fns'

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Récupérer la liste de tous les tâches
 *     description: |
 *       Retourne la liste complète de tous les tâches enregistrées.
 *     tags:
 *       - Tâches
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
 *                     $ref: '#/components/schemas/task'
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
 *                       name: "Cake"
 *                       description: "Cake for Anna"
 *                       status: "WIP"
 *                       priority: "High"
 *                       dueDate: null
 *                       createdAt: "2024-01-15T10:30:00.000Z"
 *                     - id: 2
 *                       name: "Gift"
 *                       description: "Gift for Mike"
 *                       status: "WIP"
 *                       priority: "High"
 *                       dueDate: "2025-08-27"
 *                       createdAt: "2024-01-15T10:30:00.000Z"
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
 * /api/tasks:
 *   post:
 *     summary: Créer un nouveau tâche
 *     description: |
 *       Crée un nouvelle tâche en base de données après validation des données.
 *       Le titre doit être une chaîne unique.
 *     tags:
 *       - Tâches
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *           examples:
 *             tache_simple:
 *               summary: Tâche standard
 *               value:
 *                 title: "Simple task"
 *             tache_economique:
 *               summary: Tâche détaillée
 *               value:
 *                 title: "Pick up dry cleaning"
 *                 description: "Go to George to pick up suit."
 *                 status: "DONE"
 *                 priority: "Low"
 *                 dueDate: "2025-07-03"
 *     responses:
 *       201:
 *         description: Tâche créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *                 message:
 *                   type: string
 *                   example: "Tâche créé avec succès"
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 title: "tache 1"
 *                 description: null
 *                 status: null
 *                 priority: null
 *                 dueDate: null
 *                 createdAt: "2025-08-26T14:45:46.250Z"
 *               message: "Tâche créé avec succès"
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               titre_manquant:
 *                 summary: Nom manquant
 *                 value:
 *                   success: false
 *                   error: "Le titre de la tâche est requis et doit être une chaîne non vide"
 *               date_invalide:
 *                 summary: Date invalide
 *                 value:
 *                   success: false
 *                   error: "dueDate doit être une chaîne ISO (ex: 2025-08-26)"
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

    if (dueDate !== undefined && dueDate !== null) {
      if (typeof dueDate !== 'string') {
        return NextResponse.json({ success: false, error: 'dueDate doit être une chaîne ISO (ex: 2025-08-26)' }, { status: 400 })
      }
      // const parsed = parseISO(dueDate)
      // if (!isValid(parsed)) {
      //   return NextResponse.json({ success: false, error: 'dueDate invalide — utilisez un format ISO, ex: 2025-08-26 ou 2025-08-26T15:00:00Z' }, { status: 400 })
      // }
    }

    // Créer la tâche
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description,
        status: status,
        priority: priority,
        dueDate: dueDate ? new Date(dueDate) : null
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