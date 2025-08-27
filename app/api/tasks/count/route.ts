import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * @swagger
 * /api/tasks/count:
 *   get:
 *     summary: Compter le nombre total de tâches
 *     description: |
 *       Retourne le nombre total de tâches enregistrés en base de données.
 *       Utile pour les statistiques et la pagination.
 *     tags:
 *       - Statistiques
 *     responses:
 *       200:
 *         description: Nombre de tâches récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Nombre total de tâches
 *                       example: 15
 *                 message:
 *                   type: string
 *                   example: "15 tâche(s) en base"
 *             examples:
 *               base_vide:
 *                 summary: Base de données vide
 *                 value:
 *                   success: true
 *                   data:
 *                     total: 0
 *                   message: "0 tâche(s) en base"
 *               base_avec_tâches:
 *                 summary: Base avec tâches
 *                 value:
 *                   success: true
 *                   data:
 *                     total: 15
 *                   message: "15 tâche(s) en base"
 *       500:
 *         description: Erreur serveur lors du comptage
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Erreur lors du comptage des tâches"
 */
export async function GET() {
  try {
    // Compter tous les tâches en base
    const total = await prisma.task.count()
    
    return NextResponse.json({
      success: true,
      data: {
        total: total
      },
      message: `${total} tâche(s) en base`
    })
  } catch (error) {
    console.error('Erreur lors du comptage des tâches:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors du comptage des tâches'
      },
      { status: 500 }
    )
  }
}