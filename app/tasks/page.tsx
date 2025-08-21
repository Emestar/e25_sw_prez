"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Product = {
  id: number
  name: string
  price: number
  createdAt: string
  updatedAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      setLoading(true)
      const res = await fetch("/api/products", { cache: "no-store" })
      const json = await res.json()
      if (!res.ok || json.success !== true) {
        throw new Error(json.error || "Erreur lors du chargement")
      }
      setProducts(json.data as Product[])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(id: number) {
    if (!confirm("Supprimer ce produit ?")) return
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
    if (res.ok) {
      await load()
    } else {
      const j = await res.json().catch(() => ({}))
      alert(j.error || "Suppression impossible")
    }
  }

  return (
    <main className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Produits</h1>
        <Link className="underline" href="/products/new">Nouveau produit</Link>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && products.length === 0 && (
        <p>Aucun produit.</p>
      )}

      <ul className="space-y-3">
        {products.map((p) => (
          <li key={p.id} className="flex items-center justify-between border p-3 rounded">
            <div>
              <Link className="font-medium underline" href={`/products/${p.id}`}>{p.name}</Link>
              <div className="text-sm text-gray-600">{p.price.toFixed(2)} $</div>
            </div>
            <div className="flex items-center gap-3">
              <Link className="underline" href={`/products/${p.id}/edit`}>Modifier</Link>
              <button onClick={() => handleDelete(p.id)} className="text-red-700">Supprimer</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}

