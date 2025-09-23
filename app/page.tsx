"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Settings, Globe, ExternalLink, Instagram, Mail, MapPin } from "lucide-react"
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
  active: boolean
  image_url?: string // Added image_url field to Category interface
}

interface Subcategory {
  id: string
  name: string
  active: boolean
  category_id: string
}

export default function BloomCafe() {
  const [currentView, setCurrentView] = useState<"home" | "menu" | "about" | string>("home")
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation(language)

  useEffect(() => {
    if (currentView === "menu") {
      fetchMenuData()
    }
  }, [currentView])

  const fetchMenuData = async () => {
    setLoading(true)
    try {
      const [categoriesRes, subcategoriesRes, productsRes] = await Promise.all([
        fetch("/api/menu/categories"),
        fetch("/api/menu/subcategories"),
        fetch("/api/menu/products"),
      ])

      if (categoriesRes.ok && subcategoriesRes.ok && productsRes.ok) {
        const categoriesData = await categoriesRes.json()
        const subcategoriesData = await subcategoriesRes.json()
        const productsData = await productsRes.json()
        setCategories(categoriesData)
        setSubcategories(subcategoriesData)
        setProducts(productsData)
      }
    } catch (error) {
      console.error("Error fetching menu data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getProductsByCategory = (categoryId: string) => {
    return products.filter((product) => product.category_id === categoryId && product.active)
  }

  const getSubcategoriesByCategory = (categoryId: string) => {
    return subcategories.filter((subcategory) => subcategory.category_id === categoryId && subcategory.active)
  }

  const getProductsBySubcategory = (subcategoryId: string) => {
    return products.filter((product) => product.subcategory_id === subcategoryId && product.active)
  }

  const getProductsWithoutSubcategory = (categoryId: string) => {
    return products.filter((product) => product.category_id === categoryId && !product.subcategory_id && product.active)
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
          <p className="text-bloom-blue/80 text-base font-light tracking-wide text-balance">{t("tagline")}</p>
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

      <div className="p-6 space-y-4">
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

                const name = category.name.toLowerCase()
                if (name.includes("drink") || name.includes("bebida")) {
                  return "/images/drinks-illustration.jpg"
                } else if (name.includes("sweet") || name.includes("dulce")) {
                  return "/images/sweet-illustration.jpg"
                } else if (name.includes("salty") || name.includes("salado")) {
                  return "/images/salty-illustration.jpg"
                } else {
                  return "/images/food-illustration.jpg"
                }
              }

              const getCategoryDescription = () => {
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
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                        <div className="w-16 h-16 relative">
                          <Image
                            src={getIllustration() || "/placeholder.svg"}
                            alt={`${category.name} illustration`}
                            fill
                            className="object-contain"
                            style={{
                              filter: category.image_url ? "none" : "hue-rotate(200deg) saturate(0.8) brightness(0.4)",
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-bloom-blue mb-1 tracking-tight">{category.name}</h3>
                        <p className="text-bloom-blue/70 font-light text-sm">{getCategoryDescription()}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-bloom-beige/80 text-bloom-blue font-medium text-xs px-3 py-1"
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

      const name = category.name.toLowerCase()
      if (name.includes("drink") || name.includes("bebida")) {
        return "/images/drinks-illustration.jpg"
      } else if (name.includes("sweet") || name.includes("dulce")) {
        return "/images/sweet-illustration.jpg"
      } else if (name.includes("salty") || name.includes("salado")) {
        return "/images/salty-illustration.jpg"
      } else {
        return "/images/food-illustration.jpg"
      }
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
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 relative flex-shrink-0">
                  <Image
                    src={getIllustration() || "/placeholder.svg"}
                    alt={`${category.name} icon`}
                    fill
                    className="object-contain"
                    style={{
                      filter: category.image_url ? "none" : "hue-rotate(200deg) saturate(0.8) brightness(0.4)",
                    }}
                  />
                </div>
                <h1 className="text-2xl font-bold text-bloom-blue tracking-tight">{category.name}</h1>
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

        <div className="p-4 space-y-6">
          {categoryProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-bloom-blue/70">{t("noProducts")}</p>
            </div>
          ) : (
            <>
              {categorySubcategories.map((subcategory) => {
                const subcategoryProducts = getProductsBySubcategory(subcategory.id)

                if (subcategoryProducts.length === 0) return null

                return (
                  <div key={subcategory.id} className="space-y-4">
                    <div className="flex items-center gap-4 px-2">
                      <h2 className="text-lg font-semibold text-bloom-blue tracking-tight">{subcategory.name}</h2>
                      <div className="flex-1 h-px dotted-divider text-bloom-blue/20"></div>
                      <Badge
                        variant="secondary"
                        className="bg-bloom-beige/80 text-bloom-blue font-medium text-xs px-2 py-1"
                      >
                        {subcategoryProducts.length}
                      </Badge>
                    </div>

                    {subcategoryProducts.map((product) => (
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
                                ${product.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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
                              ${product.price.toFixed(2)}
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

  const renderAbout = () => (
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
            <p className="text-bloom-blue leading-relaxed text-base font-light">{t("aboutText")}</p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-bloom-blue tracking-tight">{t("connectWithUs")}</h3>

          <div className="grid gap-4">
            <Card className="bg-bloom-ivory/90 backdrop-blur-sm elegant-border hover:shadow-lg hover:shadow-black/5 hover:scale-[1.02] transition-all duration-300 ease-out">
              <CardContent className="p-4">
                <a
                  href="https://instagram.com/bloom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-bloom-blue hover:text-bloom-blue/80 transition-colors"
                >
                  <div className="w-12 h-12 bg-bloom-cream/80 rounded-xl flex items-center justify-center">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold tracking-tight">{t("followUs")}</h4>
                    <p className="text-sm text-bloom-blue/70 font-light">@bloom</p>
                  </div>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>

            <Card className="bg-bloom-ivory/90 backdrop-blur-sm elegant-border hover:shadow-lg hover:shadow-black/5 hover:scale-[1.02] transition-all duration-300 ease-out">
              <CardContent className="p-4">
                <a
                  href="mailto:hello@bloom.com"
                  className="flex items-center gap-4 text-bloom-blue hover:text-bloom-blue/80 transition-colors"
                >
                  <div className="w-12 h-12 bg-bloom-cream/80 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold tracking-tight">{t("contactUs")}</h4>
                    <p className="text-sm text-bloom-blue/70 font-light">hello@bloom.com</p>
                  </div>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>

            <Card className="bg-bloom-ivory/90 backdrop-blur-sm elegant-border hover:shadow-lg hover:shadow-black/5 hover:scale-[1.02] transition-all duration-300 ease-out">
              <CardContent className="p-4">
                <a
                  href="https://bloom.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-bloom-blue hover:text-bloom-blue/80 transition-colors"
                >
                  <div className="w-12 h-12 bg-bloom-cream/80 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold tracking-tight">{t("ourWebsite")}</h4>
                    <p className="text-sm text-bloom-blue/70 font-light">bloom.com</p>
                  </div>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-xl font-semibold text-bloom-blue pt-4 tracking-tight">{t("visitOurRestaurant")}</h3>

          <Card className="bg-bloom-ivory/90 backdrop-blur-sm elegant-border hover:shadow-lg hover:shadow-black/5 hover:scale-[1.02] transition-all duration-300 ease-out">
            <CardContent className="p-4">
              <a
                href="https://blossom-restaurant.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-bloom-blue hover:text-bloom-blue/80 transition-colors"
              >
                <div className="w-12 h-12 bg-bloom-cream/80 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold tracking-tight">{t("visitBlossom")}</h4>
                  <p className="text-sm text-bloom-blue/70 font-light">
                    {language === "en" ? "Our Michelin restaurant" : "Nuestro restaurante Michelin"}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4" />
              </a>
            </CardContent>
          </Card>

          <h3 className="text-xl font-semibold text-bloom-blue pt-4 tracking-tight">{t("exploreArt")}</h3>

          <Card className="bg-bloom-ivory/90 backdrop-blur-sm elegant-border hover:shadow-lg hover:shadow-black/5 hover:scale-[1.02] transition-all duration-300 ease-out">
            <CardContent className="p-4">
              <a
                href="https://museum.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-bloom-blue hover:text-bloom-blue/80 transition-colors"
              >
                <div className="w-12 h-12 bg-bloom-cream/80 rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-bloom-blue rounded-sm"></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold tracking-tight">{t("museum")}</h4>
                  <p className="text-sm text-bloom-blue/70 font-light">
                    {language === "en"
                      ? "Discover our cultural exhibitions"
                      : "Descubre nuestras exposiciones culturales"}
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

  return (
    <>
      {currentView === "home" && renderHome()}
      {currentView === "menu" && renderMenu()}
      {currentView === "about" && renderAbout()}
      {currentView !== "home" && currentView !== "menu" && currentView !== "about" && renderCategory(currentView)}
    </>
  )
}
