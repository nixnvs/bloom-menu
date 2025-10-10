"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, LogOut, Settings, Globe } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  notes: string
  allergies: string
  has_gluten: boolean
  active: boolean
  category_id: string
  category_name: string
}

interface Category {
  id: string
  name: string
  active: boolean
}

interface Subcategory {
  id: string
  name: string
  active: boolean
  category_id: string
  category_name: string
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("products")
  const router = useRouter()

  useEffect(() => {
    // Check admin session
    const adminSession = localStorage.getItem("adminSession")
    if (!adminSession) {
      router.push("/admin/login")
      return
    }

    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, subcategoriesRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/subcategories"),
      ])

      if (productsRes.ok && categoriesRes.ok && subcategoriesRes.ok) {
        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()
        const subcategoriesData = await subcategoriesRes.json()
        setProducts(productsData)
        setCategories(categoriesData)
        setSubcategories(subcategoriesData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleProductActive = async (productId: string, active: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      })

      if (response.ok) {
        setProducts(products.map((p) => (p.id === productId ? { ...p, active } : p)))
      }
    } catch (error) {
      console.error("Error updating product:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminSession")
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-800">Bloom Café Admin</h1>
            <p className="text-amber-600">Manage your café menu and products</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/admin/about-us")}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Globe className="h-4 w-4" />
              About Us
            </Button>
            <Button
              onClick={() => router.push("/admin/configuration")}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Settings className="h-4 w-4" />
              Configuration
            </Button>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    // Trigger a data refresh
                    fetchData()
                  }}
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Settings className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button
                  onClick={() => router.push("/admin/products/new")}
                  className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{product.name}</h3>
                          <Badge variant="secondary">{product.category_name}</Badge>
                          <Badge variant={product.active ? "default" : "secondary"}>
                            {product.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{product.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="font-semibold text-green-600">${product.price}</span>
                          {product.has_gluten && <Badge variant="outline">Contains Gluten</Badge>}
                          {product.allergies && <span>Allergies: {product.allergies}</span>}
                        </div>
                        {product.notes && <p className="text-sm text-gray-500 mt-2">Notes: {product.notes}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Active</span>
                          <Switch
                            checked={product.active}
                            onCheckedChange={(checked) => toggleProductActive(product.id, checked)}
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Categories</h2>
              <Button
                onClick={() => router.push("/admin/categories/new")}
                className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </div>

            <div className="grid gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{category.name}</h3>
                        <Badge variant={category.active ? "default" : "secondary"}>
                          {category.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/categories/${category.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subcategories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Subcategories</h2>
              <Button
                onClick={() => router.push("/admin/subcategories/new")}
                className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Subcategory
              </Button>
            </div>

            <div className="grid gap-4">
              {subcategories.map((subcategory) => (
                <Card key={subcategory.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{subcategory.name}</h3>
                          <Badge variant="secondary">{subcategory.category_name}</Badge>
                        </div>
                        <Badge variant={subcategory.active ? "default" : "secondary"}>
                          {subcategory.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/subcategories/${subcategory.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
