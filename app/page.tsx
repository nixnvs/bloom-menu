"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Settings, Globe, ExternalLink, Instagram, Mail, MapPin, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTranslation } from "@/lib/i18n"

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
  subcategory_id?: string
}

interface Category {
  id: string
  name: string
  description?: string // Added description field to Category interface
  active: boolean
  image_url?: string
}

interface Subcategory {
  id: string
  name: string
  active: boolean
  category_id: string
  description?: string // Added description field to Subcategory interface
}

interface AboutUsConfig {
  about_text_en: string
  about_text_es: string
  instagram_url: string
  instagram_handle: string
  email_address: string
  website_url: string
  website_display: string
  restaurant_name: string
  restaurant_url: string
  restaurant_description_en: string
  restaurant_description_es: string
  museum_name: string
  museum_url: string
  museum_description_en: string
  museum_description_es: string
  connect_header_en: string
  connect_header_es: string
  restaurant_header_en: string
  restaurant_header_es: string
  culture_header_en: string
  culture_header_es: string
  follow_text_en: string
  follow_text_es: string
  contact_text_en: string
  contact_text_es: string
  website_text_en: string
  website_text_es: string
  visit_text_en: string
  visit_text_es: string
}

export default function BloomCafe() {
  const [currentView, setCurrentView] = useState<"home" | "menu" | "about" | string>("home")
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [aboutUsConfig, setAboutUsConfig] = useState<AboutUsConfig | null>(null)
  const [aboutUsLoading, setAboutUsLoading] = useState(false)
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set())
  const [cafeConfig, setCafeConfig] = useState<{ cafe_name?: string; cafe_description?: string } | null>(null)

  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation(language)

  useEffect(() => {
    fetchCafeConfig()
  }, [])

  useEffect(() => {
    if (currentView === "menu") {
      fetchMenuData()
    }
    if (currentView === "about") {
      fetchAboutUsData()
    }
  }, [currentView])

  const fetchMenuData = async () => {
    setLoading(true)
    try {
      console.log("[v0] Fetching menu data...")

      const [categoriesRes, subcategoriesRes, productsRes] = await Promise.all([
        fetch("/api/menu/categories"),
        fetch("/api/menu/subcategories"),
        fetch("/api/menu/products"),
      ])

      if (categoriesRes.ok && subcategoriesRes.ok && productsRes.ok) {
        const categoriesData = await categoriesRes.json()
        const subcategoriesData = await subcategoriesRes.json()
        const productsData = await productsRes.json()

        console.log("[v0] Menu data received:", {
          categories: categoriesData.length,
          subcategories: subcategoriesData.length,
          products: productsData.length,
        })

        setCategories(categoriesData)
        setSubcategories(subcategoriesData)
        setProducts(productsData)
      }
    } catch (error) {
      console.error("[v0] Error fetching menu data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAboutUsData = async () => {
    if (aboutUsConfig) return // Don't fetch if already loaded

    setAboutUsLoading(true)
    try {
      const response = await fetch("/api/admin/about-us")
      if (response.ok) {
        const data = await response.json()
        setAboutUsConfig(data)
      }
    } catch (error) {
      console.error("Error fetching About Us data:", error)
    } finally {
      setAboutUsLoading(false)
    }
  }

  const fetchCafeConfig = async () => {
    try {
      console.log("[v0] Fetching cafe configuration...")
      const response = await fetch("/api/admin/configuration")
      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Cafe configuration received:", data)
        const config: any = {}
        data.forEach((item: any) => {
          config[item.key] = item.value
        })
        setCafeConfig(config)
      }
    } catch (error) {
      console.error("[v0] Error fetching cafe configuration:", error)
    }
  }

  const getProductsByCategory = (categoryId: string) => {
    return products.filter((product) => product.category_id === categoryId && product.active)
  }

  const getSubcategoriesByCategory = (categoryId: string) => {
    return subcategories.filter((subcategory) => subcategory.category_id === categoryId && subcategory.active)
  }

  const getProductsBySubcategory = (subcategoryId: string) => {
    const filtered = products.filter((product) => product.subcategory_id === subcategoryId && product.active)
    console.log("[v0] getProductsBySubcategory:", {
      subcategoryId,
      totalProducts: products.length,
      filteredProducts: filtered.length,
      filtered: filtered.map((p) => ({ name: p.name, subcategory_id: p.subcategory_id })),
    })
    return filtered
  }

  const getProductsWithoutSubcategory = (categoryId: string) => {
    return products.filter((product) => product.category_id === categoryId && !product.subcategory_id && product.active)
  }

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(subcategoryId)) {
        newSet.delete(subcategoryId)
      } else {
        newSet.add(subcategoryId)
      }
      return newSet
    })
  }

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-bloom-ivory via-bloom-cream to-bloom-beige flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-6 right-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(language === "en" ? "es" : "en")}
          className="text-bloom-blue/70 hover:text-bloom-blue hover:bg-bloom-cream/50 transition-all duration-300 flex items-center gap-2 btn-chic"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">{language === "en" ? "ES" : "EN"}</span>
        </Button>
      </div>

      <div className="text-center space-y-8 max-w-sm w-full">
        <div className="space-y-6">
          <div className="w-48 h-20 mx-auto relative">
            <Image src="/images/bloom-logo.png" alt="Bloom Logo" fill className="object-contain" priority />
          </div>
          <p className="text-bloom-blue/80 text-base font-light tracking-wide text-balance">
            {cafeConfig?.cafe_description || t("tagline")}
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <Button
            onClick={() => setCurrentView("menu")}
            variant="outline"
            className="px-4 py-2 text-sm font-medium border-bloom-blue/30 text-bloom-blue hover:bg-bloom-blue/5 hover:border-bloom-blue/50 shadow-sm transition-all duration-300 hover:shadow-md rounded-lg btn-chic"
            size="sm"
          >
            {t("viewMenu")}
          </Button>

          <Button
            onClick={() => setCurrentView("about")}
            variant="outline"
            className="px-4 py-2 text-sm font-medium border-bloom-blue/30 text-bloom-blue hover:bg-bloom-blue/5 hover:border-bloom-blue/50 shadow-sm transition-all duration-300 hover:shadow-md rounded-lg btn-chic"
            size="sm"
          >
            {t("learnMore")}
          </Button>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <Link href="/admin/login">
          <Button
            variant="ghost"
            size="sm"
            className="text-bloom-blue/50 hover:text-bloom-blue hover:bg-bloom-cream/50 transition-all duration-300 btn-chic"
          >
            <Settings className="w-4 h-4 mr-2" />
            <span className="text-xs">{t("admin")}</span>
          </Button>
        </Link>
      </div>
    </div>
  )

  const renderMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-bloom-ivory via-bloom-cream to-bloom-beige">
      <div className="bg-bloom-ivory/95 backdrop-blur-sm border-b border-bloom-beige/60 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView("home")}
              className="text-bloom-blue hover:text-bloom-blue/80 hover:bg-bloom-cream/50 btn-chic"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-bloom-blue tracking-tight">{t("ourMenu")}</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "es" : "en")}
            className="text-bloom-blue/70 hover:text-bloom-blue hover:bg-bloom-cream/50 transition-all duration-300 flex items-center gap-2 btn-chic"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">{language === "en" ? "ES" : "EN"}</span>
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-3 md:space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-lg text-bloom-blue font-medium">{t("loading")}</div>
          </div>
        ) : (
          categories
            .filter((category) => category.active)
            .map((category) => {
              const categoryProducts = getProductsByCategory(category.id)
              const getIllustration = () => {
                if (category.image_url) {
                  return category.image_url
                }

                return "/images/coffee-cup-icon.jpg"
              }

              const getCategoryDescription = () => {
                if (category.description) {
                  return category.description
                }

                const name = category.name.toLowerCase()
                if (name.includes("drink") || name.includes("bebida")) {
                  return t("drinks")
                } else if (name.includes("sweet") || name.includes("dulce")) {
                  return t("sweet")
                } else if (name.includes("salty") || name.includes("salado")) {
                  return t("salty")
                } else {
                  return t("food")
                }
              }

              return (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg hover:shadow-black/5 hover:scale-[1.02] transition-all duration-300 ease-out bg-bloom-ivory/90 backdrop-blur-sm elegant-border"
                  onClick={() => setCurrentView(category.id)}
                >
                  <CardContent className="p-2 md:p-3">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 md:w-48 md:h-48 relative">
                          <Image
                            src={getIllustration() || "/placeholder.svg"}
                            alt={`${category.name} illustration`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg md:text-xl font-semibold text-bloom-blue mb-1 tracking-tight">
                          {category.name}
                        </h3>
                        <p className="text-bloom-blue/70 font-light text-xs md:text-sm">{getCategoryDescription()}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-bloom-beige/80 text-bloom-blue font-medium text-xs px-2 md:px-3 py-1"
                      >
                        {categoryProducts.length}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })
        )}
      </div>
    </div>
  )

  const renderCategory = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    const categoryProducts = getProductsByCategory(categoryId)
    const categorySubcategories = getSubcategoriesByCategory(categoryId)
    const productsWithoutSubcategory = getProductsWithoutSubcategory(categoryId)

    if (!category) {
      return renderMenu()
    }

    const getIllustration = () => {
      if (category.image_url) {
        return category.image_url
      }

      return "/images/coffee-cup-icon.jpg"
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-ivory via-bloom-cream to-bloom-beige">
        <div className="bg-bloom-ivory/95 backdrop-blur-sm border-b border-bloom-beige/60 p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView("menu")}
                className="text-bloom-blue hover:text-bloom-blue/80 hover:bg-bloom-cream/50 btn-chic"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-24 h-24 md:w-32 md:h-32 relative flex-shrink-0">
                  <Image
                    src={getIllustration() || "/placeholder.svg"}
                    alt={`${category.name} icon`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-bloom-blue tracking-tight">{category.name}</h1>
                  {category.description && (
                    <p className="text-sm text-bloom-blue/60 font-light mt-0.5">{category.description}</p>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "es" : "en")}
              className="text-bloom-blue/70 hover:text-bloom-blue hover:bg-bloom-cream/50 transition-all duration-300 flex items-center gap-2 btn-chic"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language === "en" ? "ES" : "EN"}</span>
            </Button>
          </div>
        </div>

        <div className="p-3 md:p-4 space-y-4 md:space-y-6">
          {categoryProducts.length === 0 && categorySubcategories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-bloom-blue/70">{t("noProducts")}</p>
            </div>
          ) : (
            <>
              {categorySubcategories.map((subcategory) => {
                const subcategoryProducts = getProductsBySubcategory(subcategory.id)
                const isExpanded = expandedSubcategories.has(subcategory.id)

                return (
                  <div key={subcategory.id} className="space-y-4">
                    <button
                      onClick={() => toggleSubcategory(subcategory.id)}
                      className="w-full flex items-center gap-4 px-2 hover:bg-bloom-cream/30 rounded-lg transition-colors duration-200 py-2"
                    >
                      <ChevronDown
                        className={`w-5 h-5 text-bloom-blue transition-transform duration-200 flex-shrink-0 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                      <div className="flex-1 text-left">
                        <h2 className="text-lg font-semibold text-bloom-blue tracking-tight">{subcategory.name}</h2>
                        {subcategory.description && (
                          <p className="text-sm text-bloom-blue/60 font-light mt-0.5">{subcategory.description}</p>
                        )}
                      </div>
                      <div className="flex-1 h-px dotted-divider text-bloom-blue/20"></div>
                      <Badge
                        variant="secondary"
                        className="bg-bloom-beige/80 text-bloom-blue font-medium text-xs px-2 py-1"
                      >
                        {subcategoryProducts.length}
                      </Badge>
                    </button>

                    {isExpanded && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        {subcategoryProducts.length === 0 ? (
                          <div className="text-center py-4">
                            <p className="text-bloom-blue/50 text-sm italic">
                              {language === "en" ? "No products yet" : "Sin productos aún"}
                            </p>
                          </div>
                        ) : (
                          subcategoryProducts.map((product) => (
                            <Card
                              key={product.id}
                              className="hover:shadow-lg hover:shadow-black/5 hover:scale-[1.02] transition-all duration-300 ease-out bg-bloom-ivory/90 backdrop-blur-sm elegant-border"
                            >
                              <CardContent className="p-5">
                                <div className="flex justify-between items-start gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h3 className="font-semibold text-bloom-blue text-lg tracking-tight">
                                        {product.name}
                                      </h3>
                                      {product.has_gluten && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs border-bloom-blue/30 text-bloom-blue"
                                        >
                                          {t("gluten")}
                                        </Badge>
                                      )}
                                    </div>
                                    {product.description && (
                                      <p className="text-bloom-blue/80 text-sm mt-1 leading-relaxed font-light">
                                        {product.description}
                                      </p>
                                    )}
                                    {product.notes && (
                                      <p className="text-bloom-blue/60 text-xs mt-2 italic">{product.notes}</p>
                                    )}
                                    {product.allergies && (
                                      <p className="text-bloom-blue/60 text-xs mt-1">
                                        <span className="font-medium">{t("allergens")}:</span> {product.allergies}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xl font-light text-bloom-blue tracking-tight">
                                      €{product.price.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              {productsWithoutSubcategory.length > 0 && (
                <div className="space-y-4">
                  {categorySubcategories.length > 0 && (
                    <div className="flex items-center gap-4 px-2">
                      <h2 className="text-lg font-semibold text-bloom-blue tracking-tight">
                        {language === "en" ? "Other" : "Otros"}
                      </h2>
                      <div className="flex-1 h-px dotted-divider text-bloom-blue/20"></div>
                      <Badge
                        variant="secondary"
                        className="bg-bloom-beige/80 text-bloom-blue font-medium text-xs px-2 py-1"
                      >
                        {productsWithoutSubcategory.length}
                      </Badge>
                    </div>
                  )}

                  {productsWithoutSubcategory.map((product) => (
                    <Card
                      key={product.id}
                      className="hover:shadow-lg hover:shadow-black/5 hover:scale-[1.02] transition-all duration-300 ease-out bg-bloom-ivory/90 backdrop-blur-sm elegant-border"
                    >
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-bloom-blue text-lg tracking-tight">{product.name}</h3>
                              {product.has_gluten && (
                                <Badge variant="outline" className="text-xs border-bloom-blue/30 text-bloom-blue">
                                  {t("gluten")}
                                </Badge>
                              )}
                            </div>
                            {product.description && (
                              <p className="text-bloom-blue/80 text-sm mt-1 leading-relaxed font-light">
                                {product.description}
                              </p>
                            )}
                            {product.notes && <p className="text-bloom-blue/60 text-xs mt-2 italic">{product.notes}</p>}
                            {product.allergies && (
                              <p className="text-bloom-blue/60 text-xs mt-1">
                                <span className="font-medium">{t("allergens")}:</span> {product.allergies}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-light text-bloom-blue tracking-tight">
                              €{product.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  const renderAbout = () => {
    if (aboutUsLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-bloom-ivory via-bloom-cream to-bloom-beige flex items-center justify-center">
          <div className="text-lg text-bloom-blue font-medium">Loading...</div>
        </div>
      )
    }

    const getConfigValue = (key: keyof AboutUsConfig, fallback?: string) => {
      return aboutUsConfig?.[key] || fallback || ""
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-ivory via-bloom-cream to-bloom-beige">
        <div className="bg-bloom-ivory/95 backdrop-blur-sm border-b border-bloom-beige/60 p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView("home")}
                className="text-bloom-blue hover:text-bloom-blue/80 hover:bg-bloom-cream/50 btn-chic"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-2xl font-bold text-bloom-blue tracking-tight">{t("aboutUs")}</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "es" : "en")}
              className="text-bloom-blue/70 hover:text-bloom-blue hover:bg-bloom-cream/50 transition-all duration-300 flex items-center gap-2 btn-chic"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language === "en" ? "ES" : "EN"}</span>
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <Card className="bg-bloom-ivory/90 backdrop-blur-sm elegant-border hover:shadow-lg hover:shadow-black/5 hover:scale-[1.02] transition-all duration-300 ease-out">
            <CardContent className="p-6">
              <p className="text-bloom-blue leading-relaxed text-base font-light">
                {getConfigValue(language === "en" ? "about_text_en" : "about_text_es", t("aboutText"))}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-bloom-blue tracking-tight">
              {getConfigValue(language === "en" ? "connect_header_en" : "connect_header_es", t("connectWithUs"))}
            </h3>

            <div className="grid gap-4">
              <Card className="bg-bloom-ivory/90 backdrop-blur-sm elegant-border hover:shadow-lg hover:shadow-black/5 hover:scale-[1.02] transition-all duration-300 ease-out">
                <CardContent className="p-4">
                  <a
                    href={getConfigValue("instagram_url", "https://instagram.com/bloom")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-bloom-blue hover:text-bloom-blue/80 transition-colors"
                  >
                    <div className="w-16 h-16 bg-bloom-cream/80 rounded-xl flex items-center justify-center">
                      <Instagram className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold tracking-tight">
                        {getConfigValue(language === "en" ? "follow_text_en" : "follow_text_es", t("followUs"))}
                      </h4>
                      <p className="text-sm text-bloom-blue/70 font-light">
                        {getConfigValue("instagram_handle", "@bloom")}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-bloom-ivory/90 backdrop-blur-sm elegant-border hover:shadow-lg hover:shadow-black/5 hover:scale-[1.02] transition-all duration-300 ease-out">
                <CardContent className="p-4">
                  <a
                    href={`mailto:${getConfigValue("email_address", "hello@bloom.com")}`}
                    className="flex items-center gap-4 text-bloom-blue hover:text-bloom-blue/80 transition-colors"
                  >
                    <div className="w-16 h-16 bg-bloom-cream/80 rounded-xl flex items-center justify-center">
                      <Mail className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold tracking-tight">
                        {getConfigValue(language === "en" ? "contact_text_en" : "contact_text_es", t("contactUs"))}
                      </h4>
                      <p className="text-sm text-bloom-blue/70 font-light">
                        {getConfigValue("email_address", "hello@bloom.com")}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-bloom-ivory/90 backdrop-blur-sm elegant-border hover:shadow-lg hover:shadow-black/5 hover:scale-[1.02] transition-all duration-300 ease-out">
                <CardContent className="p-4">
                  <a
                    href={getConfigValue("website_url", "https://bloom.com")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-bloom-blue hover:text-bloom-blue/80 transition-colors"
                  >
                    <div className="w-16 h-16 bg-bloom-cream/80 rounded-xl flex items-center justify-center">
                      <Globe className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold tracking-tight">
                        {getConfigValue(language === "en" ? "website_text_en" : "website_text_es", t("ourWebsite"))}
                      </h4>
                      <p className="text-sm text-bloom-blue/70 font-light">
                        {getConfigValue("website_display", "bloom.com")}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold text-bloom-blue pt-4 tracking-tight">
              {getConfigValue(
                language === "en" ? "restaurant_header_en" : "restaurant_header_es",
                t("visitOurRestaurant"),
              )}
            </h3>

            <Card className="bg-bloom-ivory/90 backdrop-blur-sm elegant-border hover:shadow-lg hover:shadow-black/5 hover:scale-[1.02] transition-all duration-300 ease-out">
              <CardContent className="p-4">
                <a
                  href={getConfigValue("restaurant_url", "https://blossom-restaurant.com")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-bloom-blue hover:text-bloom-blue/80 transition-colors"
                >
                  <div className="w-16 h-16 bg-bloom-cream/80 rounded-xl flex items-center justify-center">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold tracking-tight">
                      {getConfigValue("restaurant_name", t("blossomRestaurant"))}
                    </h4>
                    <p className="text-sm text-bloom-blue/70 font-light">
                      {getConfigValue(
                        language === "en" ? "restaurant_description_en" : "restaurant_description_es",
                        language === "en" ? "Our Michelin restaurant" : "Nuestro restaurante Michelin",
                      )}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>

            <h3 className="text-xl font-semibold text-bloom-blue pt-4 tracking-tight">
              {getConfigValue(language === "en" ? "culture_header_en" : "culture_header_es", t("exploreArt"))}
            </h3>

            <Card className="bg-bloom-ivory/90 backdrop-blur-sm elegant-border hover:shadow-lg hover:shadow-black/5 hover:scale-[1.02] transition-all duration-300 ease-out">
              <CardContent className="p-4">
                <a
                  href={getConfigValue("museum_url", "https://museum.com")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-bloom-blue hover:text-bloom-blue/80 transition-colors"
                >
                  <div className="w-16 h-16 bg-bloom-cream/80 rounded-xl flex items-center justify-center">
                    <div className="w-7 h-7 bg-bloom-blue rounded-sm"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold tracking-tight">{getConfigValue("museum_name", t("museum"))}</h4>
                    <p className="text-sm text-bloom-blue/70 font-light">
                      {getConfigValue(
                        language === "en" ? "museum_description_en" : "museum_description_es",
                        language === "en"
                          ? "Discover our cultural exhibitions"
                          : "Descubre nuestras exposiciones culturales",
                      )}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {currentView === "home" && renderHome()}
      {currentView === "menu" && renderMenu()}
      {currentView === "about" && renderAbout()}
      {currentView !== "home" && currentView !== "menu" && currentView !== "about" && renderCategory(currentView)}
    </>
  )
}
