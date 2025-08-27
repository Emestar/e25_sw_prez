import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 
// import { parseISO, isValid } from 'date-fns'

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Récupérer toutes les tâches
 *     description: Retourne la liste de toutes les tâches triées par date de création (plus récent en premier)
 *     tags: [Tâches]
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
 *                     $ref: '#/components/schemas/Task'
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
 *                       name: "Réviser le cours de Services Web"
 *                       description: "Relire les chapitres 1 à 5 et faire les exercices pratiques"
 *                       status: "WIP"
 *                       priority: "MEDIUM"
 *                       dueDate: "2024-12-20T19:00:00.000Z"
 *                       createdAt: "2025-08-27T14:03:59.021Z"
 *                     - id: 2
 *                       name: "Pick up dry cleaning"
 *                       description: "Go to George to pick up suit."
 *                       status: "DONE"
 *                       priority: "LOW"
 *                       dueDate: "2025-07-03T00:00:00.000Z"
 *                       createdAt: "2025-08-26T14:49:47.812Z"
 *                   message: "2 tâche(s) trouvé(s)"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Erreur lors de la récupération des tâches
 */
// GET /api/tasks - Liste des tâches
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, data: tasks })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des tâches' },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Créer une nouvelle tâche
 *     description: Crée une nouvelle tâche avec les informations fournies
 *     tags: [Tâches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *           examples:
 *             tache_simple:
 *               summary: Tâche simple - titre seulement
 *               value:
 *                title: "Préparer gâteau pour fête"
 *             tache_detaillee:
 *               summary: Tâche détaillée
 *               value:
 *                title: "Réviser le cours de Services Web"
 *                description: "Relire les chapitres 1 à 5 et faire les exercices pratiques"
 *                priority: "MEDIUM"
 *                dueDate: "2025-12-20T14:00:00"
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
 *                 title: "Réviser le cours de Services Web"
 *                 description: "Relire les chapitres 1 à 5 et faire les exercices pratiques"
 *                 status: ""
 *                 priority: "MEDIUM"
 *                 dueDate: "2024-12-20T14:00:00"
 *                 createdAt: "2024-01-15T10:30:00.000Z"
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
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Erreur lors de la création de la tâche
 */
// POST /api/tasks - Créer une tâche
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, priority, dueDate } = body
    
    // Validation
    if (!title || title.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Le titre est requis' },
        { status: 400 }
      )
    }

    // if (dueDate !== undefined && dueDate !== null) {
    //   if (typeof dueDate !== 'string') {
    //     return NextResponse.json({ success: false, error: 'dueDate doit être une chaîne ISO (ex: 2025-08-26)' }, { status: 400 })
    //   }
    //   // const parsed = parseISO(dueDate)
    //   // if (!isValid(parsed)) {
    //   //   return NextResponse.json({ success: false, error: 'dueDate invalide — utilisez un format ISO, ex: 2025-08-26 ou 2025-08-26T15:00:00Z' }, { status: 400 })
    //   // }
    // }

    // Créer la tâche
    // const task = await prisma.task.create({
    //   data: {
    //     title: title.trim(),
    //     description: description,
    //     status: status,
    //     priority: priority,
    
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null
      }
    })
    
    return NextResponse.json({ success: true, data: task }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de la tâche' },
      { status: 500 }
    )
  }
}