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
import { ArrowLeft, Trash2 } from "lucide-react"
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

interface Product {
  id: string
  name: string
  description: string
  price: number
  notes: string
  allergies: string
  category_id: string
  subcategory_id?: string
  has_gluten: boolean
  active: boolean
  display_order: number
  image_url?: string
}

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    notes: "",
    allergies: "",
    category_id: "",
    subcategory_id: "",
    has_gluten: false,
    active: true,
    display_order: 0,
    image_url: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params
        const [productRes, categoriesRes, subcategoriesRes] = await Promise.all([
          fetch(`/api/admin/products/${resolvedParams.id}`),
          fetch("/api/admin/categories"),
          fetch("/api/admin/subcategories"),
        ])

        if (productRes.ok && categoriesRes.ok && subcategoriesRes.ok) {
          const productData = await productRes.json()
          const categoriesData = await categoriesRes.json()
          const subcategoriesData = await subcategoriesRes.json()

          setProduct(productData)
          setCategories(categoriesData)
          setSubcategories(subcategoriesData.filter((sub: Subcategory & { active: boolean }) => sub.active))
          setFormData({
            name: productData.name,
            description: productData.description || "",
            price: productData.price.toString(),
            notes: productData.notes || "",
            allergies: productData.allergies || "",
            category_id: productData.category_id,
            subcategory_id: productData.subcategory_id || "",
            has_gluten: productData.has_gluten,
            active: productData.active,
            display_order: productData.display_order,
            image_url: productData.image_url || "",
          })
        } else {
          setError("Product not found")
        }
      } catch (err) {
        setError("Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params])

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
    if (!product) return

    setIsLoading(true)
    setError("")

    if (!formData.name.trim()) {
      setError("Product name is required")
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

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
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
        setError(data.error || "Failed to update product")
      }
    } catch (err) {
      setError("An error occurred while updating the product")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!product || !confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/admin/dashboard")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete product")
      }
    } catch (err) {
      setError("An error occurred while deleting the product")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Product not found</div>
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
            <CardTitle className="text-2xl text-amber-800">Edit Product</CardTitle>
            <p className="text-amber-600">Update your menu item</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>

                {/* Image Upload Section */}
                <ImageUpload
                  label="Product Image"
                  currentImageUrl={formData.image_url}
                  onImageChange={handleImageChange}
                  disabled={isLoading}
                />

                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    placeholder="e.g., Cappuccino, Avocado Toast"
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

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your product..."
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

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Special preparation notes, customization options, etc."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies & Dietary Info</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange("allergies", e.target.value)}
                    placeholder="List allergens and dietary information..."
                    rows={2}
                  />
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

              <div className="flex justify-between pt-4">
                <div className="flex gap-3">
                  <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Product"}
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
