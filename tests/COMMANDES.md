# Commandes laboratoire - Gestionnaire de Tâches

## Installation

```bash
git clone [URL_REPO]
cd e25_sw_prez
npm install
```

## Configuration base de données

```bash
# 1. Créer compte sur neon.tech
# 2. Créer fichier .env.local avec DATABASE_URL
# 3. Synchroniser schéma
npx prisma generate
npx prisma db push
```

## Démarrage

```bash
npm run dev
```

## Test avec curl

```bash
# Créer une tâche
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Réviser le cours de Services Web",
    "description": "Relire les chapitres 1 à 5 et faire les exercices pratiques",
    "priority": "MEDIUM"
  }'

# Créer une tâche urgente avec date d'échéance
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Présentation finale du projet",
    "description": "Préparer la présentation PowerPoint et répéter le discours",
    "priority": "URGENT",
    "dueDate": "2024-12-20T14:00:00"
  }'

# Lister toutes les tâches
curl http://localhost:3000/api/tasks

# Obtenir une tâche par ID
curl http://localhost:3000/api/tasks/1

# Modifier le statut d'une tâche
curl -X PUT http://localhost:3000/api/tasks/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "IN_PROGRESS"}'

# Marquer une tâche comme terminée
curl -X PUT http://localhost:3000/api/tasks/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "COMPLETED"}'

# Supprimer une tâche
curl -X DELETE http://localhost:3000/api/tasks/1

# Obtenir les tâches par priorité
curl http://localhost:3000/api/tasks/by-priority?priority=HIGH

# Obtenir les tâches en retard
curl http://localhost:3000/api/tasks/Overdue
```

## Test avec fichier .http

```bash
# Installer extension REST Client dans VS Code
# Ouvrir tests/api.http
# Cliquer sur "Send Request" au-dessus de chaque requête
```

## Test avec Collection Postman

```bash
# 1. Ouvrir Postman
# 2. Importer la collection : File > Import > tests/Laboratoire2-Collection.postman_collection.json
# 3. Importer l'environnement : File > Import > tests/Laboratoire2-Environment.postman_environment.json
# 4. Sélectionner l'environnement "Laboratoire 2 - Environment"
# 5. Exécuter les requêtes individuellement ou lancer toute la collection
```

## Prisma utilitaires

```bash
# Regénérer le client Prisma
npx prisma generate

# Synchroniser schéma avec base
npx prisma db push

# Réinitialiser la base
npx prisma db push --force-reset

# Interface graphique base
npx prisma studio
```

## Dépannage

```bash
# Port 3000 occupé
npm run dev -- -p 3001

# Tuer processus Node.js (Windows)
taskkill /f /im node.exe

# Nettoyer cache npm
npm cache clean --force

# Réinstaller dépendances
rm -rf node_modules package-lock.json
npm install
```

## Structure projet

```
e25_sw_prez/
├── app/api/tasks/route.ts              # GET + POST
├── app/api/tasks/[id]/route.ts         # GET + DELETE
├── app/api/tasks/[id]/status/route.ts  # PUT (modifier statut)
├── app/api/tasks/by-priority/route.ts  # GET (filtrer par priorité)
├── app/api/tasks/Overdue/route.ts      # GET (tâches en retard)
├── lib/prisma.ts                       # Config Prisma
├── prisma/schema.prisma                # Modèle données
├── tests/api.http                      # Tests HTTP
└── .env.local                          # Variables env
```

## Endpoints disponibles

```
GET    /api/tasks                    # Lister toutes les tâches
POST   /api/tasks                    # Créer une tâche
GET    /api/tasks/[id]               # Obtenir une tâche
DELETE /api/tasks/[id]               # Supprimer une tâche
PUT    /api/tasks/[id]/status        # Modifier le statut
GET    /api/tasks/by-priority        # Filtrer par priorité
GET    /api/tasks/Overdue            # Tâches en retard
```

## Format données

```json
// POST body pour créer une tâche
{
  "title": "string (requis)",
  "description": "string (optionnel)",
  "priority": "LOW|MEDIUM|HIGH|URGENT (défaut: MEDIUM)",
  "dueDate": "string (format ISO, optionnel)"
}

// PUT body pour modifier le statut
{
  "status": "PENDING|IN_PROGRESS|COMPLETED|CANCELLED"
}

// Réponse succès
{
  "success": true,
  "data": {...}
}

// Réponse erreur
{
  "success": false,
  "error": "string"
}
```

## Variables environnement

```bash
# .env.local
DATABASE_URL="postgresql://user:pass@host.neon.tech/db?sslmode=require"
```

## Validation données

```
title: string non vide requis
description: string optionnel
priority: enum (LOW, MEDIUM, HIGH, URGENT)
dueDate: string ISO format optionnel
status: enum (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
id: integer positif pour GET/DELETE/PUT
```

## Codes erreur HTTP

```
200: Succès
201: Créé
400: Données invalides
404: Ressource non trouvée
500: Erreur serveur
```

## Script de test complet avec curl

Créez un fichier `test-tasks.sh` :

```bash
#!/bin/bash
echo "=== Test du Gestionnaire de Tâches ==="

echo "1. Liste initiale (vide):"
curl -s http://localhost:3000/api/tasks | json_pp

echo -e "\n2. Créer tâche 1:"
curl -s -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Réviser Services Web", "priority": "MEDIUM"}' | json_pp

echo -e "\n3. Créer tâche 2 (urgente):"
curl -s -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Présentation finale", "priority": "URGENT", "dueDate": "2024-12-20T14:00:00"}' | json_pp

echo -e "\n4. Liste après création:"
curl -s http://localhost:3000/api/tasks | json_pp

echo -e "\n5. Modifier statut tâche 1:"
curl -s -X PUT http://localhost:3000/api/tasks/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "IN_PROGRESS"}' | json_pp

echo -e "\n6. Tâches par priorité (URGENT):"
curl -s http://localhost:3000/api/tasks/by-priority?priority=URGENT | json_pp

echo -e "\n7. Tâches en retard:"
curl -s http://localhost:3000/api/tasks/Overdue | json_pp

echo -e "\n8. Supprimer tâche 1:"
curl -s -X DELETE http://localhost:3000/api/tasks/1 | json_pp

echo -e "\n9. Liste finale:"
curl -s http://localhost:3000/api/tasks | json_pp
```