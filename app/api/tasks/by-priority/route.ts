import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tasks/by-priority - Tâches par priorité
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const priority = searchParams.get('priority')
    
    const tasks = await prisma.task.findMany({
      where: priority ? { priority: priority as any } : {},
      orderBy: { priority: 'desc' }
    })
    
    return NextResponse.json({ success: true, data: tasks })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des tâches par priorité' },
      { status: 500 }
    )
  }
}