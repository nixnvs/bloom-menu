export type Language = "en" | "es"

export const translations = {
  en: {
    // Home page
    tagline: "Cafetería - Cultura - Pâtisserie",
    viewMenu: "View Menu",
    qrSuccess: "QR code scanned successfully",
    admin: "Admin",

    // Menu
    ourMenu: "Our Menu",
    loading: "Loading menu...",
    noProducts: "No products available in this category.",
    allergens: "Allergens",
    gluten: "Gluten",

    // Categories descriptions
    drinks: "Coffees, teas and specialty beverages",
    sweet: "Artisanal desserts and sweets",
    salty: "Savory dishes and appetizers",
    food: "Breakfasts, lunches and desserts",

    // About page
    learnMore: "Learn more about Bloom",
    aboutUs: "About Us",
    visitBlossom: "Visit Blossom",
    ourWebsite: "Our Website",
    followUs: "Follow Us",
    contactUs: "Contact Us",
    museum: "Museum",
    aboutText:
      "Welcome to Bloom, where culture meets culinary excellence. We are the café extension of our acclaimed Michelin restaurant, bringing you the same attention to detail and passion for quality in a more relaxed setting.",
    connectWithUs: "Connect with Us",
    visitOurRestaurant: "Visit Our Restaurant",
    exploreArt: "Explore Art & Culture",

    // Language
    language: "Language",
  },
  es: {
    // Home page
    tagline: "Cafetería - Cultura - Pâtisserie",
    viewMenu: "Ver Carta",
    qrSuccess: "Escaneaste el código QR correctamente",
    admin: "Admin",

    // Menu
    ourMenu: "Nuestra Carta",
    loading: "Cargando menú...",
    noProducts: "No hay productos disponibles en esta categoría.",
    allergens: "Alérgenos",
    gluten: "Gluten",

    // Categories descriptions
    drinks: "Cafés, tés y bebidas especiales",
    sweet: "Postres y dulces artesanales",
    salty: "Platos salados y aperitivos",
    food: "Desayunos, almuerzos y postres",

    // About page
    learnMore: "Conoce más sobre Bloom",
    aboutUs: "Sobre Nosotros",
    visitBlossom: "Visita Blossom",
    ourWebsite: "Nuestro Sitio Web",
    followUs: "Síguenos",
    contactUs: "Contáctanos",
    museum: "Museo",
    aboutText:
      "Bienvenido a Bloom, donde la cultura se encuentra con la excelencia culinaria. Somos la extensión cafetería de nuestro aclamado restaurante Michelin, trayéndote la misma atención al detalle y pasión por la calidad en un ambiente más relajado.",
    connectWithUs: "Conéctate con Nosotros",
    visitOurRestaurant: "Visita Nuestro Restaurante",
    exploreArt: "Explora Arte y Cultura",

    // Language
    language: "Idioma",
  },
}

export const useTranslation = (language: Language) => {
  return {
    t: (key: keyof typeof translations.en) => translations[language][key] || key,
    language,
  }
}
