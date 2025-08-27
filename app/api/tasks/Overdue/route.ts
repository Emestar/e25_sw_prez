import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * @swagger
 * /api/tasks/Overdue:
 *   get:
 *     summary: Récupérer les tâches en retard
 *     description: Retourne toutes les tâches dont la date d'échéance est dépassée et qui ne sont pas terminées
 *     tags: [Filtrage]
 *     responses:
 *       200:
 *         description: Tâches en retard récupérées avec succès
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
 *                   example: Erreur lors de la récupération des tâches en retard
 */
// GET /api/tasks/overdue - Tâches en retard
export async function GET() {
  try {
    const overdueTasks = await prisma.task.findMany({
      where: {
        dueDate: {
          lt: new Date()
        },
        status: {
          not: 'COMPLETED'
        }
      },
      orderBy: { dueDate: 'asc' }
    })
    
    return NextResponse.json({ success: true, data: overdueTasks })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des tâches en retard' },
      { status: 500 }
    )
  }
}