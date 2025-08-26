import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * @swagger
 * /api/tasks/by-priority:
 *   get:
 *     summary: Filtrer les tâches par priorité
 *     description: Retourne toutes les tâches ayant une priorité spécifique (LOW, MEDIUM, HIGH, URGENT)
 *     tags: [Filtrage]
 *     parameters:
 *       - in: query
 *         name: priority
 *         required: true
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *         description: Niveau de priorité à filtrer
 *         example: HIGH
 *     responses:
 *       200:
 *         description: Tâches filtrées récupérées avec succès
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
 *       400:
 *         description: Priorité invalide
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
 *                   example: Priorité invalide
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
// GET /api/tasks/by-priority - Filtrer les tâches par priorité
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const priority = searchParams.get('priority')
    
    // Validation de la priorité
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
    if (!priority || !validPriorities.includes(priority)) {
      return NextResponse.json(
        { success: false, error: 'Priorité invalide' },
        { status: 400 }
      )
    }
    
    const tasks = await prisma.task.findMany({
      where: { priority },
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