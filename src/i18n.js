import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        shop: "Shop",
        ourStory: "Our Story",
        face: "Face",
        lips: "Lips",
        body: "Body",
        hair: "Hair",
        search: "Search",
        wishlist: "Wishlist",
        cart: "Cart",
        language: "العربية",
      },
    },
  },

  ar: {
    translation: {
      nav: {
        home: "الرئيسية",
        shop: "المتجر",
        ourStory: "قصتنا",
        face: "الوجه",
        lips: "الشفاه",
        body: "الجسم",
        hair: "الشعر",
        search: "بحث",
        wishlist: "المفضلة",
        cart: "السلة",
        language: "English",
      },
    },
  },
};

const savedLanguage =
  typeof window !== "undefined"
    ? window.localStorage.getItem("nyora-language")
    : null;

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (language) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem("nyora-language", language);
  }
});

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language;
  document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
}

export default i18n;
