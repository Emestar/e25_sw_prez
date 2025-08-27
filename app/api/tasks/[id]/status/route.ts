import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * @swagger
 * /api/tasks/{id}/status:
 *   put:
 *     summary: Modifier le statut d'une tâche
 *     description: Met à jour le statut d'une tâche (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
 *     tags: [Tâches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant unique de la tâche
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusUpdate'
 *           example:
 *             status: "IN_PROGRESS"
 *     responses:
 *       200:
 *         description: Statut modifié avec succès
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
 *       400:
 *         description: Données invalides
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
 *                   example: Statut invalide
 *       404:
 *         description: Tâche non trouvée
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
 *                   example: Tâche non trouvée
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
 *                   example: Erreur lors de la modification du statut
 */
// PUT /api/tasks/[id]/status - Modifier le statut d'une tâche
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID de tâche invalide' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    const { status } = body
    
    // Validation du statut
    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Statut invalide' },
        { status: 400 }
      )
    }
    
    const task = await prisma.task.findUnique({
      where: { id }
    })
    
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Tâche non trouvée' },
        { status: 404 }
      )
    }
    
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status }
    })
    
    return NextResponse.json({ success: true, data: updatedTask })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la modification du statut' },
      { status: 500 }
    )
  }
}