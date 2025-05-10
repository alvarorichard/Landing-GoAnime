"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "pt" | "en" | "es"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  pt: {
    // Header
    "nav.features": "Recursos",
    "nav.installation": "Instalação",
    "nav.usage": "Como Usar",
    "nav.press": "Pressione",

    // Hero
    "hero.tagline": "Anime no terminal, simples e poderoso",
    "hero.description":
      "Um player de anime para terminal construído em Go, que permite buscar, assistir e baixar episódios diretamente no MPV com uma experiência fluida e moderna.",
    "hero.github": "Ver no GitHub",
    "hero.install": "Instalar Agora",

    // Features
    "features.badge": "Recursos Incríveis",
    "features.title": "Experiência Extraordinária",
    "features.subtitle": "Descubra o que torna o GoAnime uma ferramenta única para os amantes de anime",

    "features.cli.title": "Interface CLI Elegante",
    "features.cli.description":
      "Interface de linha de comando intuitiva e moderna para buscar e assistir animes com facilidade.",

    "features.playback.title": "Reprodução Direta",
    "features.playback.description":
      "Reproduza episódios diretamente no MPV sem precisar abrir o navegador ou outros aplicativos.",

    "features.fast.title": "Rápido e Eficiente",
    "features.fast.description": "Construído em Go para oferecer desempenho excepcional e consumo mínimo de recursos.",

    "features.sources.title": "Múltiplas Fontes",
    "features.sources.description":
      "Acesse animes de várias fontes para garantir a melhor qualidade e disponibilidade.",

    "features.opensource.title": "Código Aberto",
    "features.opensource.description":
      "Projeto totalmente open source, permitindo contribuições e personalizações da comunidade.",

    "features.download.title": "Download de Episódios",
    "features.download.description":
      "Baixe episódios para assistir offline quando e onde quiser, sem depender de conexão com a internet.",

    // Installation
    "install.badge": "Instalação Simples",
    "install.title": "Comece em Segundos",
    "install.subtitle": "Escolha o método de instalação que funciona melhor para você",

    "install.universal.title": "Instalação Universal",
    "install.universal.description": "Recomendado para a maioria dos usuários (apenas Go necessário)",

    "install.manual.title": "Instalação Manual",
    "install.manual.description": "Clone o repositório e instale manualmente",

    "install.arch.title": "Arch Linux (AUR)",
    "install.arch.description": "Para usuários do Arch Linux",

    "install.nixos.title": "NixOS (Flakes)",
    "install.nixos.description": "Para usuários do NixOS",

    "install.learnmore": "Saiba mais",

    // Usage
    "usage.badge": "Como Usar",
    "usage.title": "Simples e Intuitivo",
    "usage.subtitle": "Comandos simples para começar a usar o GoAnime imediatamente",

    "usage.step1.title": "Inicie o GoAnime",
    "usage.step1.description": "Abra seu terminal e execute o comando para iniciar o GoAnime.",

    "usage.step2.title": "Busque seu anime favorito",
    "usage.step2.description": "Digite o nome do anime que deseja assistir ou use a busca direta.",

    "usage.step3.title": "Selecione o anime",
    "usage.step3.description":
      "Navegue pela lista de resultados usando as setas do teclado e pressione Enter para selecionar.",

    "usage.step4.title": "Escolha o episódio",
    "usage.step4.description": "Selecione o episódio que deseja assistir da lista apresentada.",

    "usage.step5.title": "Aproveite!",
    "usage.step5.description": "O episódio será reproduzido automaticamente no MPV. Relaxe e aproveite seu anime!",

    // CTA
    "cta.badge": "Pronto para começar?",
    "cta.title": "Experimente o GoAnime Hoje",
    "cta.subtitle":
      "Junte-se a milhares de usuários que já estão aproveitando a melhor experiência de anime no terminal.",

    // Footer
    "footer.developed": "Desenvolvido por",

    // Language
    language: "Idioma",
    "language.pt": "Português",
    "language.en": "Inglês",
    "language.es": "Espanhol",
  },
  en: {
    // Header
    "nav.features": "Features",
    "nav.installation": "Installation",
    "nav.usage": "How to Use",
    "nav.press": "Press",

    // Hero
    "hero.tagline": "Anime in the terminal, simple and powerful",
    "hero.description":
      "An anime player for terminal built in Go, which allows you to search, watch and download episodes directly in MPV with a fluid and modern experience.",
    "hero.github": "View on GitHub",
    "hero.install": "Install Now",

    // Features
    "features.badge": "Amazing Features",
    "features.title": "Extraordinary Experience",
    "features.subtitle": "Discover what makes GoAnime a unique tool for anime lovers",

    "features.cli.title": "Elegant CLI Interface",
    "features.cli.description": "Intuitive and modern command line interface to search and watch anime with ease.",

    "features.playback.title": "Direct Playback",
    "features.playback.description":
      "Play episodes directly in MPV without having to open the browser or other applications.",

    "features.fast.title": "Fast and Efficient",
    "features.fast.description": "Built in Go to offer exceptional performance and minimal resource consumption.",

    "features.sources.title": "Multiple Sources",
    "features.sources.description": "Access anime from various sources to ensure the best quality and availability.",

    "features.opensource.title": "Open Source",
    "features.opensource.description":
      "Fully open source project, allowing community contributions and customizations.",

    "features.download.title": "Episode Download",
    "features.download.description":
      "Download episodes to watch offline whenever and wherever you want, without relying on an internet connection.",

    // Installation
    "install.badge": "Simple Installation",
    "install.title": "Start in Seconds",
    "install.subtitle": "Choose the installation method that works best for you",

    "install.universal.title": "Universal Installation",
    "install.universal.description": "Recommended for most users (only Go required)",

    "install.manual.title": "Manual Installation",
    "install.manual.description": "Clone the repository and install manually",

    "install.arch.title": "Arch Linux (AUR)",
    "install.arch.description": "For Arch Linux users",

    "install.nixos.title": "NixOS (Flakes)",
    "install.nixos.description": "For NixOS users",

    "install.learnmore": "Learn more",

    // Usage
    "usage.badge": "How to Use",
    "usage.title": "Simple and Intuitive",
    "usage.subtitle": "Simple commands to start using GoAnime immediately",

    "usage.step1.title": "Start GoAnime",
    "usage.step1.description": "Open your terminal and run the command to start GoAnime.",

    "usage.step2.title": "Search for your favorite anime",
    "usage.step2.description": "Type the name of the anime you want to watch or use direct search.",

    "usage.step3.title": "Select the anime",
    "usage.step3.description": "Navigate through the results list using the keyboard arrows and press Enter to select.",

    "usage.step4.title": "Choose the episode",
    "usage.step4.description": "Select the episode you want to watch from the presented list.",

    "usage.step5.title": "Enjoy!",
    "usage.step5.description": "The episode will be automatically played in MPV. Relax and enjoy your anime!",

    // CTA
    "cta.badge": "Ready to start?",
    "cta.title": "Try GoAnime Today",
    "cta.subtitle": "Join thousands of users who are already enjoying the best anime experience in the terminal.",

    // Footer
    "footer.developed": "Developed by",

    // Language
    language: "Language",
    "language.pt": "Portuguese",
    "language.en": "English",
    "language.es": "Spanish",
  },
  es: {
    // Header
    "nav.features": "Características",
    "nav.installation": "Instalación",
    "nav.usage": "Cómo Usar",
    "nav.press": "Presiona",

    // Hero
    "hero.tagline": "Anime en la terminal, simple y potente",
    "hero.description":
      "Un reproductor de anime para terminal construido en Go, que permite buscar, ver y descargar episodios directamente en MPV con una experiencia fluida y moderna.",
    "hero.github": "Ver en GitHub",
    "hero.install": "Instalar Ahora",

    // Features
    "features.badge": "Características Increíbles",
    "features.title": "Experiencia Extraordinaria",
    "features.subtitle": "Descubre lo que hace de GoAnime una herramienta única para los amantes del anime",

    "features.cli.title": "Interfaz CLI Elegante",
    "features.cli.description":
      "Interfaz de línea de comandos intuitiva y moderna para buscar y ver anime con facilidad.",

    "features.playback.title": "Reproducción Directa",
    "features.playback.description":
      "Reproduce episodios directamente en MPV sin tener que abrir el navegador u otras aplicaciones.",

    "features.fast.title": "Rápido y Eficiente",
    "features.fast.description":
      "Construido en Go para ofrecer un rendimiento excepcional y un consumo mínimo de recursos.",

    "features.sources.title": "Múltiples Fuentes",
    "features.sources.description":
      "Accede a anime de varias fuentes para garantizar la mejor calidad y disponibilidad.",

    "features.opensource.title": "Código Abierto",
    "features.opensource.description":
      "Proyecto totalmente de código abierto, que permite contribuciones y personalizaciones de la comunidad.",

    "features.download.title": "Descarga de Episodios",
    "features.download.description":
      "Descarga episodios para verlos sin conexión cuando y donde quieras, sin depender de una conexión a internet.",

    // Installation
    "install.badge": "Instalación Simple",
    "install.title": "Comienza en Segundos",
    "install.subtitle": "Elige el método de instalación que mejor funcione para ti",

    "install.universal.title": "Instalación Universal",
    "install.universal.description": "Recomendado para la mayoría de los usuarios (solo se requiere Go)",

    "install.manual.title": "Instalación Manual",
    "install.manual.description": "Clona el repositorio e instala manualmente",

    "install.arch.title": "Arch Linux (AUR)",
    "install.arch.description": "Para usuarios de Arch Linux",

    "install.nixos.title": "NixOS (Flakes)",
    "install.nixos.description": "Para usuarios de NixOS",

    "install.learnmore": "Saber más",

    // Usage
    "usage.badge": "Cómo Usar",
    "usage.title": "Simple e Intuitivo",
    "usage.subtitle": "Comandos simples para comenzar a usar GoAnime inmediatamente",

    "usage.step1.title": "Inicia GoAnime",
    "usage.step1.description": "Abre tu terminal y ejecuta el comando para iniciar GoAnime.",

    "usage.step2.title": "Busca tu anime favorito",
    "usage.step2.description": "Escribe el nombre del anime que deseas ver o usa la búsqueda directa.",

    "usage.step3.title": "Selecciona el anime",
    "usage.step3.description":
      "Navega por la lista de resultados usando las flechas del teclado y presiona Enter para seleccionar.",

    "usage.step4.title": "Elige el episodio",
    "usage.step4.description": "Selecciona el episodio que deseas ver de la lista presentada.",

    "usage.step5.title": "¡Disfruta!",
    "usage.step5.description": "El episodio se reproducirá automáticamente en MPV. Relájate y disfruta de tu anime!",

    // CTA
    "cta.badge": "¿Listo para comenzar?",
    "cta.title": "Prueba GoAnime Hoy",
    "cta.subtitle":
      "Únete a miles de usuarios que ya están disfrutando de la mejor experiencia de anime en la terminal.",

    // Footer
    "footer.developed": "Desarrollado por",

    // Language
    language: "Idioma",
    "language.pt": "Portugués",
    "language.en": "Inglés",
    "language.es": "Español",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("pt")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["pt", "en", "es"].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
