"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Trash2 } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

interface Category {
  id: string
  name: string
  description?: string
  active: boolean
  display_order: number
  image_url?: string
}

export default function EditCategory({ params }: { params: Promise<{ id: string }> }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [active, setActive] = useState(true)
  const [displayOrder, setDisplayOrder] = useState(0)
  const [imageUrl, setImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const resolvedParams = await params
        const response = await fetch(`/api/admin/categories/${resolvedParams.id}`)
        if (response.ok) {
          const data = await response.json()
          setCategory(data)
          setName(data.name)
          setDescription(data.description || "")
          setActive(data.active)
          setDisplayOrder(data.display_order)
          setImageUrl(data.image_url || "")
        } else {
          setError("Category not found")
        }
      } catch (err) {
        setError("Failed to load category")
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [params])

  const handleImageChange = (url: string | null) => {
    console.log("[v0] Image URL changed to:", url)
    setImageUrl(url || "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category) return

    setIsLoading(true)
    setError("")

    const updateData = {
      name,
      description: description || null,
      active,
      display_order: displayOrder,
      image_url: imageUrl || null,
    }
    console.log("[v0] Submitting category update with data:", updateData)

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const updatedCategory = await response.json()
        console.log("[v0] Category updated successfully:", updatedCategory)
        router.push("/admin/dashboard?tab=categories")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update category")
      }
    } catch (err) {
      setError("An error occurred while updating the category")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (
      !category ||
      !confirm("Are you sure you want to delete this category? This will also delete all products in this category.")
    ) {
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/admin/dashboard?tab=categories")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete category")
      }
    } catch (err) {
      setError("An error occurred while deleting the category")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Category not found</div>
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
            <CardTitle className="text-2xl text-amber-800">Edit Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <ImageUpload
                label="Category Image"
                currentImageUrl={imageUrl}
                onImageChange={handleImageChange}
                disabled={isLoading}
              />

              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g., Drinks, Food, Desserts"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Disponible de 8:00 AM a 10:00 PM"
                  rows={3}
                />
                <p className="text-sm text-gray-500">
                  Optional description for the category (e.g., schedule, special notes)
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
                    {isLoading ? "Updating..." : "Update Category"}
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
