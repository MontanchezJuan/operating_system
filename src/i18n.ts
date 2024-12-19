import i18n from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(HttpBackend) // Para cargar traducciones desde archivos JSON
  .use(initReactI18next) // Integración con React
  .init({
    lng: "en", // Idioma por defecto
    fallbackLng: "en", // Idioma de respaldo si falta una traducción
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Ruta de los archivos JSON de traducción
      addPath: "http://localhost:3001/locales/{{lng}}/missing.json", // Ruta donde guardar claves faltantes
    },
    saveMissing: true, // Habilitar guardado automático de claves faltantes
    parseMissingKeyHandler: (key) => `[MISSING]: ${key}`, // Mostrar como [MISSING]: clave
    interpolation: {
      escapeValue: false, // React ya maneja la protección contra XSS
    },
  });

export default i18n;
