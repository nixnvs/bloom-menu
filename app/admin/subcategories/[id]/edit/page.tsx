"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Trash2 } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { Textarea } from "@/components/ui/textarea"

interface Category {
  id: string
  name: string
}

interface Subcategory {
  id: string
  name: string
  active: boolean
  display_order: number
  category_id: string
  image_url?: string
  description?: string
}

export default function EditSubcategory({ params }: { params: Promise<{ id: string }> }) {
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [description, setDescription] = useState("")
  const [active, setActive] = useState(true)
  const [displayOrder, setDisplayOrder] = useState(0)
  const [imageUrl, setImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params
        const [subcategoryRes, categoriesRes] = await Promise.all([
          fetch(`/api/admin/subcategories/${resolvedParams.id}`),
          fetch("/api/admin/categories"),
        ])

        if (subcategoryRes.ok && categoriesRes.ok) {
          const subcategoryData = await subcategoryRes.json()
          const categoriesData = await categoriesRes.json()

          setSubcategory(subcategoryData)
          setCategories(categoriesData)
          setName(subcategoryData.name)
          setCategoryId(subcategoryData.category_id)
          setDescription(subcategoryData.description || "")
          setActive(subcategoryData.active)
          setDisplayOrder(subcategoryData.display_order)
          setImageUrl(subcategoryData.image_url || "")
        } else {
          setError("Subcategory not found")
        }
      } catch (err) {
        setError("Failed to load subcategory")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params])

  const handleImageChange = (url: string | null) => {
    setImageUrl(url || "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subcategory) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/subcategories/${subcategory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category_id: categoryId,
          description: description || null,
          active,
          display_order: displayOrder,
          image_url: imageUrl || null,
        }),
      })

      if (response.ok) {
        router.push("/admin/dashboard?tab=subcategories")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update subcategory")
      }
    } catch (err) {
      setError("An error occurred while updating the subcategory")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (
      !subcategory ||
      !confirm(
        "Are you sure you want to delete this subcategory? Products in this subcategory will be moved to no subcategory.",
      )
    ) {
      return
    }

    try {
      const response = await fetch(`/api/admin/subcategories/${subcategory.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/admin/dashboard?tab=subcategories")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete subcategory")
      }
    } catch (err) {
      setError("An error occurred while deleting the subcategory")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!subcategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Subcategory not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 p-6">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-amber-800">Edit Subcategory</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <ImageUpload
                label="Subcategory Image"
                currentImageUrl={imageUrl}
                onImageChange={handleImageChange}
                disabled={isLoading}
              />

              <div className="space-y-2">
                <Label htmlFor="category">Parent Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Subcategory Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g., Coffee, Sweet, Wine"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Disponible de 8:00 AM a 12:00 PM"
                  rows={3}
                />
                <p className="text-sm text-gray-500">
                  Optional: Add schedule, availability, or other information about this subcategory
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number.parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
                <p className="text-sm text-gray-500">Lower numbers appear first in the menu</p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="active" checked={active} onCheckedChange={setActive} />
                <Label htmlFor="active">Active (visible to customers)</Label>
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <div className="flex justify-between">
                <div className="flex gap-3">
                  <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Subcategory"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
                <Button type="button" variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
