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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Languages } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

interface Category {
  id: string
  name: string
}

interface Subcategory {
  id: string
  name: string
  category_id: string
}

export default function NewProduct() {
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [editingLanguage, setEditingLanguage] = useState<"es" | "en">("es")
  const [formData, setFormData] = useState({
    // Spanish fields
    name: "",
    description: "",
    notes: "",
    allergies: "",
    // English fields
    name_en: "",
    description_en: "",
    notes_en: "",
    allergies_en: "",
    // Language-independent fields
    price: "",
    category_id: "",
    subcategory_id: "",
    has_gluten: false,
    active: true,
    display_order: 0,
    image_url: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [loadingCategories, setLoadingCategories] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, subcategoriesRes] = await Promise.all([
          fetch("/api/admin/categories"),
          fetch("/api/admin/subcategories"),
        ])

        if (categoriesRes.ok && subcategoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          const subcategoriesData = await subcategoriesRes.json()
          setCategories(categoriesData.filter((cat: Category & { active: boolean }) => cat.active))
          setSubcategories(subcategoriesData.filter((sub: Subcategory & { active: boolean }) => sub.active))
        }
      } catch (err) {
        console.error("Failed to load data:", err)
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchData()
  }, [])

  const availableSubcategories = subcategories.filter((subcategory) => subcategory.category_id === formData.category_id)

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      }

      if (field === "category_id") {
        newData.subcategory_id = ""
      }

      return newData
    })
  }

  const handleImageChange = (imageUrl: string | null) => {
    setFormData((prev) => ({
      ...prev,
      image_url: imageUrl || "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation
    if (!formData.name.trim() && !formData.name_en.trim()) {
      setError("Product name is required")
      setIsLoading(false)
      return
    }

    if (!formData.category_id) {
      setError("Please select a category")
      setIsLoading(false)
      return
    }

    const price = Number.parseFloat(formData.price)
    if (Number.isNaN(price) || price <= 0) {
      setError("Please enter a valid price")
      setIsLoading(false)
      return
    }

    try {
      const subcategoryId =
        formData.subcategory_id === "none" || !formData.subcategory_id ? null : formData.subcategory_id

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price,
          subcategory_id: subcategoryId,
          image_url: formData.image_url || null,
        }),
      })

      if (response.ok) {
        router.push("/admin/dashboard")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to create product")
      }
    } catch (err) {
      setError("An error occurred while creating the product")
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingCategories) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
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
            <CardTitle className="text-2xl text-amber-800">Add New Product</CardTitle>
            <p className="text-amber-600">Create a new menu item for your café</p>

            {/* Language toggle */}
            <div className="flex items-center gap-2 mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Languages className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Editing in:</span>
              <div className="flex gap-1 ml-2">
                <Button
                  type="button"
                  size="sm"
                  variant={editingLanguage === "es" ? "default" : "outline"}
                  onClick={() => setEditingLanguage("es")}
                  className={editingLanguage === "es" ? "bg-amber-600 hover:bg-amber-700" : ""}
                >
                  Español
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={editingLanguage === "en" ? "default" : "outline"}
                  onClick={() => setEditingLanguage("en")}
                  className={editingLanguage === "en" ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  English
                </Button>
              </div>
              <span className="text-xs text-gray-500 ml-auto">{editingLanguage === "es" ? "🇪🇸" : "🇬🇧"}</span>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>

                <ImageUpload
                  label="Product Image"
                  currentImageUrl={formData.image_url}
                  onImageChange={handleImageChange}
                  disabled={isLoading}
                />

                {/* Name field */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Product Name * {editingLanguage === "en" && <span className="text-blue-600">(English)</span>}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={editingLanguage === "es" ? formData.name : formData.name_en}
                    onChange={(e) => handleInputChange(editingLanguage === "es" ? "name" : "name_en", e.target.value)}
                    required
                    placeholder={
                      editingLanguage === "es"
                        ? "e.g., Cappuccino, Tostada de Aguacate"
                        : "e.g., Cappuccino, Avocado Toast"
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => handleInputChange("category_id", value)}
                  >
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

                {formData.category_id && availableSubcategories.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select
                      value={formData.subcategory_id}
                      onValueChange={(value) => handleInputChange("subcategory_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subcategory (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No subcategory</SelectItem>
                        {availableSubcategories.map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">
                      Subcategories help organize products within a category (e.g., Coffee, Wine under Drinks)
                    </p>
                  </div>
                )}

                {/* Description field */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description {editingLanguage === "en" && <span className="text-blue-600">(English)</span>}
                  </Label>
                  <Textarea
                    id="description"
                    value={editingLanguage === "es" ? formData.description : formData.description_en}
                    onChange={(e) =>
                      handleInputChange(editingLanguage === "es" ? "description" : "description_en", e.target.value)
                    }
                    placeholder={editingLanguage === "es" ? "Describe tu producto..." : "Describe your product..."}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Additional Details</h3>

                {/* Notes field */}
                <div className="space-y-2">
                  <Label htmlFor="notes">
                    Notes {editingLanguage === "en" && <span className="text-blue-600">(English)</span>}
                  </Label>
                  <Textarea
                    id="notes"
                    value={editingLanguage === "es" ? formData.notes : formData.notes_en}
                    onChange={(e) => handleInputChange(editingLanguage === "es" ? "notes" : "notes_en", e.target.value)}
                    placeholder={
                      editingLanguage === "es"
                        ? "Notas especiales, opciones de personalización, etc."
                        : "Special preparation notes, customization options, etc."
                    }
                    rows={2}
                  />
                  <p className="text-sm text-gray-500">
                    {editingLanguage === "es"
                      ? 'e.g., "Disponible con leche de avena", "Añadir shot extra por +€1"'
                      : 'e.g., "Available with oat milk", "Add extra shot for +€1"'}
                  </p>
                </div>

                {/* Allergies field */}
                <div className="space-y-2">
                  <Label htmlFor="allergies">
                    Allergies & Dietary Info{" "}
                    {editingLanguage === "en" && <span className="text-blue-600">(English)</span>}
                  </Label>
                  <Textarea
                    id="allergies"
                    value={editingLanguage === "es" ? formData.allergies : formData.allergies_en}
                    onChange={(e) =>
                      handleInputChange(editingLanguage === "es" ? "allergies" : "allergies_en", e.target.value)
                    }
                    placeholder={
                      editingLanguage === "es"
                        ? "Lista de alérgenos e información dietética..."
                        : "List allergens and dietary information..."
                    }
                    rows={2}
                  />
                  <p className="text-sm text-gray-500">
                    {editingLanguage === "es"
                      ? 'e.g., "Contiene lácteos, frutos secos", "Opción vegana disponible"'
                      : 'e.g., "Contains dairy, nuts", "Vegan option available"'}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_gluten"
                    checked={formData.has_gluten}
                    onCheckedChange={(checked) => handleInputChange("has_gluten", checked)}
                  />
                  <Label htmlFor="has_gluten">Contains Gluten</Label>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Settings</h3>

                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => handleInputChange("display_order", Number.parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                  <p className="text-sm text-gray-500">Lower numbers appear first in the category</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => handleInputChange("active", checked)}
                  />
                  <Label htmlFor="active">Active (visible to customers)</Label>
                </div>
              </div>

              {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Product"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
