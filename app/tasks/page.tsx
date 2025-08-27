'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Task {
  id: number
  title: string
  description?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  dueDate?: string
  createdAt: string
  updatedAt: string
}

// Fonction utilitaire pour formater les dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fonction pour vérifier si une tâche est en retard
const isOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date()
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks", { cache: "no-store" })
      const json = await res.json()
      if (json.success) {
        setTasks(json.data as Task[])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" })
        if (res.ok) {
          fetchTasks() // Recharger la liste
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600 font-bold'
      case 'HIGH': return 'text-orange-600'
      case 'MEDIUM': return 'text-yellow-600'
      case 'LOW': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 font-bold'
      case 'IN_PROGRESS': return 'text-blue-600'
      case 'PENDING': return 'text-gray-600'
      case 'CANCELLED': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionnaire de Tâches</h1>
        <Link 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          href="/tasks/new"
        >
          Nouvelle tâche
        </Link>
      </div>

      {loading && <p>Chargement...</p>}

      {!loading && tasks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Aucune tâche trouvée</p>
          <Link 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            href="/tasks/new"
          >
            Créer votre première tâche
          </Link>
        </div>
      )}

      {tasks.map((task) => (
        <div key={task.id} className="border rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
              {task.description && (
                <p className="text-gray-600 mb-2">{task.description}</p>
              )}
              <div className="flex gap-4 text-sm">
                <span className={`${getPriorityColor(task.priority)}`}>
                  Priorité: {task.priority}
                </span>
                <span className={`${getStatusColor(task.status)}`}>
                  Statut: {task.status}
                </span>
                {task.dueDate && (
                  <span className={`${isOverdue(task.dueDate) ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                    Échéance: {formatDate(task.dueDate)}
                    {isOverdue(task.dueDate) && ' (EN RETARD)'}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Link 
                className="text-blue-600 hover:text-blue-800 underline"
                href={`/tasks/${task.id}`}
              >
                Voir
              </Link>
              <Link 
                className="text-green-600 hover:text-green-800 underline"
                href={`/tasks/${task.id}/edit`}
              >
                Modifier
              </Link>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-600 hover:text-red-800 underline"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
