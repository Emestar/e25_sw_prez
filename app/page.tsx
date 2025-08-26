export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Laboratoire 2 - Services Web REST
      </h1>
                  <div className="space-y-4">
              <p>
                Cette application propose des services web REST pour gérer des tâches :
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Services principaux</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>GET /api/tasks</strong> - Obtenir la liste des tâches</li>
                    <li><strong>POST /api/tasks</strong> - Ajouter une nouvelle tâche</li>
                    <li><strong>PUT /api/tasks/[id]</strong> - Modifier une tâche par ID</li>
                    <li><strong>DELETE /api/tasks/[id]</strong> - Supprimer une tâche par ID</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Services complémentaires</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>GET /api/tasks/count</strong> - Compter les taches</li>
                  </ul>
                </div>
              </div>
        <p className="mt-6">
          Utilisez Postman ou un autre client REST pour tester ces endpoints.
        </p>
        <p className="mt-2">
          Interface web: <a className="underline" href="/tasks">/tasks</a>
        </p>
      </div>
    </main>
  )
}