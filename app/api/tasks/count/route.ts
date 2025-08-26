import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * @swagger
 * /api/products/count:
 *   get:
 *     summary: Compter le nombre total de produits
 *     description: |
 *       Retourne le nombre total de produits enregistrés en base de données.
 *       Utile pour les statistiques et la pagination.
 *     tags:
 *       - Statistiques
 *     responses:
 *       200:
 *         description: Nombre de produits récupéré avec succès
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
 *                       description: Nombre total de produits
 *                       example: 15
 *                 message:
 *                   type: string
 *                   example: "15 produit(s) en base"
 *             examples:
 *               base_vide:
 *                 summary: Base de données vide
 *                 value:
 *                   success: true
 *                   data:
 *                     total: 0
 *                   message: "0 produit(s) en base"
 *               base_avec_produits:
 *                 summary: Base avec produits
 *                 value:
 *                   success: true
 *                   data:
 *                     total: 15
 *                   message: "15 produit(s) en base"
 *       500:
 *         description: Erreur serveur lors du comptage
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Erreur lors du comptage des produits"
 */
export async function GET() {
  try {
    // Compter tous les produits en base
    const total = await prisma.product.count()
    
    return NextResponse.json({
      success: true,
      data: {
        total: total
      },
      message: `${total} produit(s) en base`
    })
  } catch (error) {
    console.error('Erreur lors du comptage des produits:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors du comptage des produits'
      },
      { status: 500 }
    )
  }
}