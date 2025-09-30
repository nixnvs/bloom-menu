"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Globe, Instagram, MapPin } from "lucide-react"

interface AboutUsConfig {
  // Main about text
  about_text_en: string
  about_text_es: string

  // Social media
  instagram_url: string
  instagram_handle: string
  email_address: string
  website_url: string
  website_display: string

  // Restaurant connection
  restaurant_name: string
  restaurant_url: string
  restaurant_description_en: string
  restaurant_description_es: string

  // Museum/Culture
  museum_name: string
  museum_url: string
  museum_description_en: string
  museum_description_es: string

  // Section headers
  connect_header_en: string
  connect_header_es: string
  restaurant_header_en: string
  restaurant_header_es: string
  culture_header_en: string
  culture_header_es: string

  // Action text
  follow_text_en: string
  follow_text_es: string
  contact_text_en: string
  contact_text_es: string
  website_text_en: string
  website_text_es: string
  visit_text_en: string
  visit_text_es: string
}

export default function AboutUsAdminPage() {
  const [config, setConfig] = useState<AboutUsConfig>({
    about_text_en: "",
    about_text_es: "",
    instagram_url: "",
    instagram_handle: "",
    email_address: "",
    website_url: "",
    website_display: "",
    restaurant_name: "",
    restaurant_url: "",
    restaurant_description_en: "",
    restaurant_description_es: "",
    museum_name: "",
    museum_url: "",
    museum_description_en: "",
    museum_description_es: "",
    connect_header_en: "",
    connect_header_es: "",
    restaurant_header_en: "",
    restaurant_header_es: "",
    culture_header_en: "",
    culture_header_es: "",
    follow_text_en: "",
    follow_text_es: "",
    contact_text_en: "",
    contact_text_es: "",
    website_text_en: "",
    website_text_es: "",
    visit_text_en: "",
    visit_text_es: "",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check admin session
    const adminSession = localStorage.getItem("adminSession")
    if (!adminSession) {
      router.push("/admin/login")
      return
    }

    fetchAboutUsConfig()
  }, [router])

  const fetchAboutUsConfig = async () => {
    try {
      const response = await fetch("/api/admin/about-us")
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error("Error fetching About Us configuration:", error)
      setError("Failed to load About Us configuration")
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = (key: keyof AboutUsConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
    setSuccess(false)
  }

  const saveConfiguration = async () => {
    setSaving(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/admin/about-us", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError("Failed to save About Us configuration")
      }
    } catch (err) {
      setError("Failed to save About Us configuration")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/dashboard")}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <Button
            onClick={saveConfiguration}
            disabled={saving}
            className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-amber-800">About Us Content Management</CardTitle>
            <p className="text-amber-600">Edit all content that appears in the "Conoce más sobre Bloom" section</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="main-text" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="main-text">Main Text</TabsTrigger>
                <TabsTrigger value="social">Social & Contact</TabsTrigger>
                <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
                <TabsTrigger value="culture">Culture</TabsTrigger>
              </TabsList>

              <TabsContent value="main-text" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Main About Text
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="about-text-en">About Text (English)</Label>
                      <Textarea
                        id="about-text-en"
                        value={config.about_text_en}
                        onChange={(e) => updateConfig("about_text_en", e.target.value)}
                        placeholder="Enter the main about text in English..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="about-text-es">About Text (Spanish)</Label>
                      <Textarea
                        id="about-text-es"
                        value={config.about_text_es}
                        onChange={(e) => updateConfig("about_text_es", e.target.value)}
                        placeholder="Enter the main about text in Spanish..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Instagram className="h-5 w-5" />
                      Social Media & Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="instagram-url">Instagram URL</Label>
                        <Input
                          id="instagram-url"
                          value={config.instagram_url}
                          onChange={(e) => updateConfig("instagram_url", e.target.value)}
                          placeholder="https://instagram.com/bloom"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram-handle">Instagram Handle</Label>
                        <Input
                          id="instagram-handle"
                          value={config.instagram_handle}
                          onChange={(e) => updateConfig("instagram_handle", e.target.value)}
                          placeholder="@bloom"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email-address">Email Address</Label>
                        <Input
                          id="email-address"
                          type="email"
                          value={config.email_address}
                          onChange={(e) => updateConfig("email_address", e.target.value)}
                          placeholder="hello@bloom.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website-display">Website Display Text</Label>
                        <Input
                          id="website-display"
                          value={config.website_display}
                          onChange={(e) => updateConfig("website_display", e.target.value)}
                          placeholder="bloom.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website-url">Website URL</Label>
                      <Input
                        id="website-url"
                        value={config.website_url}
                        onChange={(e) => updateConfig("website_url", e.target.value)}
                        placeholder="https://bloom.com"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="connect-header-en">Section Header (English)</Label>
                        <Input
                          id="connect-header-en"
                          value={config.connect_header_en}
                          onChange={(e) => updateConfig("connect_header_en", e.target.value)}
                          placeholder="Connect with Us"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="connect-header-es">Section Header (Spanish)</Label>
                        <Input
                          id="connect-header-es"
                          value={config.connect_header_es}
                          onChange={(e) => updateConfig("connect_header_es", e.target.value)}
                          placeholder="Conéctate con Nosotros"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label htmlFor="follow-text-en">Follow Text (EN)</Label>
                        <Input
                          id="follow-text-en"
                          value={config.follow_text_en}
                          onChange={(e) => updateConfig("follow_text_en", e.target.value)}
                          placeholder="Follow Us"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="follow-text-es">Follow Text (ES)</Label>
                        <Input
                          id="follow-text-es"
                          value={config.follow_text_es}
                          onChange={(e) => updateConfig("follow_text_es", e.target.value)}
                          placeholder="Síguenos"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-text-en">Contact Text (EN)</Label>
                        <Input
                          id="contact-text-en"
                          value={config.contact_text_en}
                          onChange={(e) => updateConfig("contact_text_en", e.target.value)}
                          placeholder="Contact Us"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-text-es">Contact Text (ES)</Label>
                        <Input
                          id="contact-text-es"
                          value={config.contact_text_es}
                          onChange={(e) => updateConfig("contact_text_es", e.target.value)}
                          placeholder="Contáctanos"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="restaurant" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Restaurant Connection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="restaurant-name">Restaurant Name</Label>
                        <Input
                          id="restaurant-name"
                          value={config.restaurant_name}
                          onChange={(e) => updateConfig("restaurant_name", e.target.value)}
                          placeholder="Blossom"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="restaurant-url">Restaurant URL</Label>
                        <Input
                          id="restaurant-url"
                          value={config.restaurant_url}
                          onChange={(e) => updateConfig("restaurant_url", e.target.value)}
                          placeholder="https://blossom-restaurant.com"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="restaurant-description-en">Description (English)</Label>
                        <Input
                          id="restaurant-description-en"
                          value={config.restaurant_description_en}
                          onChange={(e) => updateConfig("restaurant_description_en", e.target.value)}
                          placeholder="Our Michelin restaurant"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="restaurant-description-es">Description (Spanish)</Label>
                        <Input
                          id="restaurant-description-es"
                          value={config.restaurant_description_es}
                          onChange={(e) => updateConfig("restaurant_description_es", e.target.value)}
                          placeholder="Nuestro restaurante Michelin"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="restaurant-header-en">Section Header (English)</Label>
                        <Input
                          id="restaurant-header-en"
                          value={config.restaurant_header_en}
                          onChange={(e) => updateConfig("restaurant_header_en", e.target.value)}
                          placeholder="Visit Our Restaurant"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="restaurant-header-es">Section Header (Spanish)</Label>
                        <Input
                          id="restaurant-header-es"
                          value={config.restaurant_header_es}
                          onChange={(e) => updateConfig("restaurant_header_es", e.target.value)}
                          placeholder="Visita Nuestro Restaurante"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="visit-text-en">Visit Text (English)</Label>
                        <Input
                          id="visit-text-en"
                          value={config.visit_text_en}
                          onChange={(e) => updateConfig("visit_text_en", e.target.value)}
                          placeholder="Visit Blossom"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="visit-text-es">Visit Text (Spanish)</Label>
                        <Input
                          id="visit-text-es"
                          value={config.visit_text_es}
                          onChange={(e) => updateConfig("visit_text_es", e.target.value)}
                          placeholder="Visita Blossom"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="culture" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-amber-600 rounded-sm"></div>
                      Culture & Museum
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="museum-name">Museum/Culture Name</Label>
                        <Input
                          id="museum-name"
                          value={config.museum_name}
                          onChange={(e) => updateConfig("museum_name", e.target.value)}
                          placeholder="Museum"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="museum-url">Museum URL</Label>
                        <Input
                          id="museum-url"
                          value={config.museum_url}
                          onChange={(e) => updateConfig("museum_url", e.target.value)}
                          placeholder="https://museum.com"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="museum-description-en">Description (English)</Label>
                        <Input
                          id="museum-description-en"
                          value={config.museum_description_en}
                          onChange={(e) => updateConfig("museum_description_en", e.target.value)}
                          placeholder="Discover our cultural exhibitions"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="museum-description-es">Description (Spanish)</Label>
                        <Input
                          id="museum-description-es"
                          value={config.museum_description_es}
                          onChange={(e) => updateConfig("museum_description_es", e.target.value)}
                          placeholder="Descubre nuestras exposiciones culturales"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="culture-header-en">Section Header (English)</Label>
                        <Input
                          id="culture-header-en"
                          value={config.culture_header_en}
                          onChange={(e) => updateConfig("culture_header_en", e.target.value)}
                          placeholder="Explore Art & Culture"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="culture-header-es">Section Header (Spanish)</Label>
                        <Input
                          id="culture-header-es"
                          value={config.culture_header_es}
                          onChange={(e) => updateConfig("culture_header_es", e.target.value)}
                          placeholder="Explora Arte y Cultura"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">{error}</div>
            )}

            {success && (
              <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">
                About Us configuration saved successfully!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
