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
    "nav.download": "Download",

    // Terminal/Usage Instructions
    "terminal.universal.command": "go install github.com/alvarorichard/Goanime/cmd/goanime@latest",
    "terminal.manual.clone": "git clone https://github.com/alvarorichard/GoAnime.git",
    "terminal.manual.cd": "cd GoAnime",
    "terminal.manual.install": "go run cmd/goanime/main.go",
    "terminal.arch.paru": "# Usando paru",
    "terminal.arch.paru.command": "paru -S goanime",
    "terminal.arch.yay": "# Usando yay",
    "terminal.arch.yay.command": "yay -S goanime",
    "terminal.nixos.comment": "# Execução temporária",
    "terminal.nixos.command": "nix github:alvarorichard/GoAnime",
    "terminal.usage.command": "go-anime # Linux/macOS goanime # Windows",
    "terminal.usage.search": "goanime \"demon slayer\"",
    "terminal.demo.command": "go-anime \"demon slayer\"",
    "terminal.demo.searching": "Buscando \"demon slayer\"...",
    "terminal.demo.found": "Encontrado:",
    "terminal.demo.anime": "Demon Slayer: Kimetsu no Yaiba",
    "terminal.demo.loading": "Carregando episódios...",
    "terminal.demo.episode1": "Episódio 1 - Crueldade",
    "terminal.demo.episode2": "Episódio 2 - O Treinador Urokodaki Sakonji",
    "terminal.demo.episode3": "Episódio 3 - Sabito e Makomo",
    "terminal.demo.select": "Selecione um episódio:",
    "terminal.demo.starting": "Iniciando MPV...",
    "terminal.demo.playing": "Reproduzindo:",
    "terminal.demo.playing.ep": "Demon Slayer - Episódio 1 - Crueldade",

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

    "install.manual.title": "Manual install methods",
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

    // Download Page
    "download.back": "Voltar para a página inicial",
    "download.badge": "Downloads Oficiais",
    "download.title": "Baixe o GoAnime",
    "download.subtitle":
      "Escolha a versão para seu sistema operacional e comece a assistir anime no terminal agora mesmo.",
    "download.version": "Versão:",
    "download.file": "Arquivo",
    "download.loading": "Carregando informações da versão mais recente...",
    "download.error": "Não foi possível carregar as informações da versão mais recente. Por favor, tente novamente.",
    "download.retry": "Tentar novamente",
    "download.instructions": "Após o download, extraia e execute o arquivo conforme as instruções abaixo.",

    "download.mac.title": "macOS",
    "download.mac.description": "Para macOS 10.13 ou superior (Intel e Apple Silicon)",
    "download.mac.button": "Baixar para macOS",

    "download.linux.title": "Linux",
    "download.linux.description": "Para distribuições Linux modernas (64-bit)",
    "download.linux.button": "Baixar para Linux",

    "download.windows.title": "Windows",
    "download.windows.description": "Para Windows 10 ou superior (64-bit)",
    "download.windows.button": "Baixar para Windows",

    "download.alternative.title": "Métodos Alternativos",
    "download.alternative.subtitle": "Outras formas de obter o GoAnime",

    "download.github.title": "GitHub Releases",
    "download.github.description": "Baixe versões específicas e veja as notas de lançamento",
    "download.github.button": "Ver no GitHub",

    "download.source.title": "Código Fonte",
    "download.source.description": "Clone o repositório e compile você mesmo",
    "download.source.button": "Baixar Código Fonte",

    "download.instructions.badge": "Guia de Instalação",
    "download.instructions.title": "Como Instalar",
    "download.instructions.subtitle": "Siga estas etapas simples para começar a usar o GoAnime",
    "download.instructions.step1.title": "Baixe o arquivo",
    "download.instructions.step1.description": "Escolha a versão para seu sistema operacional e faça o download.",
    "download.instructions.step2.title": "Torne o arquivo executável (Linux/macOS)",
    "download.instructions.step2.description": "Abra o terminal e execute 'chmod +x ./nome-do-arquivo'.",
    "download.instructions.step2.command": "chmod +x ./goanime-linux",
    "download.instructions.step3.title": "Execute o GoAnime",
    "download.instructions.step3.description": "Execute o arquivo baixado e comece a assistir anime!",
    "download.instructions.step3.command": "./goanime-linux",
    "download.instructions.starting": "Iniciando...",
    "download.instructions.prompt": "Digite o nome do anime que deseja assistir:",

    // Star on GitHub CTA
    "star.cta": "Deixe uma estrela no nosso repositório no GitHub!",
  },
  en: {
    // Header
    "nav.features": "Features",
    "nav.installation": "Installation",
    "nav.usage": "How to Use",
    "nav.press": "Press",
    "nav.download": "Download",

    // Terminal/Usage Instructions
    "terminal.universal.command": "go install github.com/alvarorichard/Goanime/cmd/goanime@latest",
    "terminal.manual.clone": "git clone https://github.com/alvarorichard/GoAnime.git",
    "terminal.manual.cd": "cd GoAnime",
    "terminal.manual.install": "go run cmd/goanime/main.go",
    "terminal.arch.paru": "# Using paru",
    "terminal.arch.paru.command": "paru -S goanime",
    "terminal.arch.yay": "# Using yay",
    "terminal.arch.yay.command": "yay -S goanime",
    "terminal.nixos.comment": "# Temporary execution",
    "terminal.nixos.command": "nix github:alvarorichard/GoAnime",
    "terminal.usage.command": "go-anime # Linux/macOS goanime # Windows",
    "terminal.usage.search": "goanime \"demon slayer\"",
    "terminal.demo.command": "go-anime \"demon slayer\"",
    "terminal.demo.searching": "Searching for \"demon slayer\"...",
    "terminal.demo.found": "Found:",
    "terminal.demo.anime": "Demon Slayer: Kimetsu no Yaiba",
    "terminal.demo.loading": "Loading episodes...",
    "terminal.demo.episode1": "Episode 1 - Cruelty",
    "terminal.demo.episode2": "Episode 2 - Trainer Urokodaki Sakonji",
    "terminal.demo.episode3": "Episode 3 - Sabito and Makomo",
    "terminal.demo.select": "Select an episode:",
    "terminal.demo.starting": "Starting MPV...",
    "terminal.demo.playing": "Playing:",
    "terminal.demo.playing.ep": "Demon Slayer - Episode 1 - Cruelty",

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

    "install.manual.title": "Manual install methods",
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

    // Download Page
    "download.back": "Back to home",
    "download.badge": "Official Downloads",
    "download.title": "Download GoAnime",
    "download.subtitle":
      "Choose the version for your operating system and start watching anime in the terminal right now.",
    "download.version": "Version:",
    "download.file": "File",
    "download.loading": "Loading latest version information...",
    "download.error": "Could not load latest version information. Please try again.",
    "download.retry": "Try again",
    "download.instructions": "After downloading, extract and run the file according to the instructions below.",

    "download.mac.title": "macOS",
    "download.mac.description": "For macOS 10.13 or higher (Intel and Apple Silicon)",
    "download.mac.button": "Download for macOS",

    "download.linux.title": "Linux",
    "download.linux.description": "For modern Linux distributions (64-bit)",
    "download.linux.button": "Download for Linux",

    "download.windows.title": "Windows",
    "download.windows.description": "For Windows 10 or higher (64-bit)",
    "download.windows.button": "Download for Windows",

    "download.alternative.title": "Alternative Methods",
    "download.alternative.subtitle": "Other ways to get GoAnime",

    "download.github.title": "GitHub Releases",
    "download.github.description": "Download specific versions and view release notes",
    "download.github.button": "View on GitHub",

    "download.source.title": "Source Code",
    "download.source.description": "Clone the repository and build it yourself",
    "download.source.button": "Download Source Code",

    "download.instructions.badge": "Installation Guide",
    "download.instructions.title": "How to Install",
    "download.instructions.subtitle": "Follow these simple steps to start using GoAnime",
    "download.instructions.step1.title": "Download the file",
    "download.instructions.step1.description": "Choose the version for your operating system and download it.",
    "download.instructions.step2.title": "Make the file executable (Linux/macOS)",
    "download.instructions.step2.description": "Open the terminal and run 'chmod +x ./file-name'.",
    "download.instructions.step2.command": "chmod +x ./goanime-linux",
    "download.instructions.step3.title": "Run GoAnime",
    "download.instructions.step3.description": "Execute the downloaded file and start watching anime!",
    "download.instructions.step3.command": "./goanime-linux",
    "download.instructions.starting": "Starting...",
    "download.instructions.prompt": "Type the name of the anime you want to watch:",

    // Star on GitHub CTA
    "star.cta": "Leave a star on our GitHub repository!",
  },
  es: {
    // Header
    "nav.features": "Características",
    "nav.installation": "Instalación",
    "nav.usage": "Cómo Usar",
    "nav.press": "Presiona",
    "nav.download": "Descargar",

    // Terminal/Usage Instructions
    "terminal.universal.command": "go install github.com/alvarorichard/Goanime/cmd/goanime@latest",
    "terminal.manual.clone": "git clone https://github.com/alvarorichard/GoAnime.git",
    "terminal.manual.cd": "cd GoAnime",
    "terminal.manual.install": "go run cmd/goanime/main.go",
    "terminal.arch.paru": "# Usando paru",
    "terminal.arch.paru.command": "paru -S goanime",
    "terminal.arch.yay": "# Usando yay",
    "terminal.arch.yay.command": "yay -S goanime",
    "terminal.nixos.comment": "# Ejecución temporal",
    "terminal.nixos.command": "nix github:alvarorichard/GoAnime",
    "terminal.usage.command": "go-anime # Linux/macOS goanime # Windows",
    "terminal.usage.search": "goanime \"demon slayer\"",
    "terminal.demo.command": "go-anime \"demon slayer\"",
    "terminal.demo.searching": "Buscando \"demon slayer\"...",
    "terminal.demo.found": "Encontrado:",
    "terminal.demo.anime": "Demon Slayer: Kimetsu no Yaiba",
    "terminal.demo.loading": "Cargando episodios...",
    "terminal.demo.episode1": "Episodio 1 - Crueldad",
    "terminal.demo.episode2": "Episodio 2 - Entrenador Urokodaki Sakonji",
    "terminal.demo.episode3": "Episodio 3 - Sabito y Makomo",
    "terminal.demo.select": "Selecciona un episodio:",
    "terminal.demo.starting": "Iniciando MPV...",
    "terminal.demo.playing": "Reproduciendo:",
    "terminal.demo.playing.ep": "Demon Slayer - Episodio 1 - Crueldad",

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

    "install.manual.title": "Manual install methods",
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

    // Download Page
    "download.back": "Volver a la página principal",
    "download.badge": "Descargas Oficiales",
    "download.title": "Descarga GoAnime",
    "download.subtitle":
      "Elige la versión para tu sistema operativo y comienza a ver anime en la terminal ahora mismo.",
    "download.version": "Versión:",
    "download.file": "Archivo",
    "download.loading": "Cargando información de la versión más reciente...",
    "download.error": "No se pudo cargar la información de la versión más reciente. Por favor, inténtalo de nuevo.",
    "download.retry": "Intentar de nuevo",
    "download.instructions":
      "Después de descargar, extrae y ejecuta el archivo según las instrucciones a continuación.",

    "download.mac.title": "macOS",
    "download.mac.description": "Para macOS 10.13 o superior (Intel y Apple Silicon)",
    "download.mac.button": "Descargar para macOS",

    "download.linux.title": "Linux",
    "download.linux.description": "Para distribuciones Linux modernas (64-bit)",
    "download.linux.button": "Descargar para Linux",

    "download.windows.title": "Windows",
    "download.windows.description": "Para Windows 10 o superior (64-bit)",
    "download.windows.button": "Descargar para Windows",

    "download.alternative.title": "Métodos Alternativos",
    "download.alternative.subtitle": "Otras formas de obtener GoAnime",

    "download.github.title": "GitHub Releases",
    "download.github.description": "Descarga versiones específicas y consulta las notas de lanzamiento",
    "download.github.button": "Ver en GitHub",

    "download.source.title": "Código Fuente",
    "download.source.description": "Clona el repositorio y compílalo tú mismo",
    "download.source.button": "Descargar Código Fuente",

    "download.instructions.badge": "Guía de Instalación",
    "download.instructions.title": "Cómo Instalar",
    "download.instructions.subtitle": "Sigue estos sencillos pasos para comenzar a usar GoAnime",
    "download.instructions.step1.title": "Descarga el archivo",
    "download.instructions.step1.description": "Elige la versión para tu sistema operativo y descárgala.",
    "download.instructions.step2.title": "Haz el archivo ejecutable (Linux/macOS)",
    "download.instructions.step2.description": "Abre la terminal y ejecuta 'chmod +x ./nombre-del-archivo'.",
    "download.instructions.step2.command": "chmod +x ./goanime-linux",
    "download.instructions.step3.title": "Ejecuta GoAnime",
    "download.instructions.step3.description": "Ejecuta el archivo descargado y ¡comienza a ver anime!",
    "download.instructions.step3.command": "./goanime-linux",
    "download.instructions.starting": "Iniciando...",
    "download.instructions.prompt": "Escribe el nombre del anime que deseas ver:",

    // Star on GitHub CTA
    "star.cta": "¡Deja una estrella en nuestro repositorio de GitHub!",
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
    return (translations[language] as Record<string, string>)[key] || key
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
