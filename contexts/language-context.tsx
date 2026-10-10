"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export type Language = "pt" | "en" | "es"

export const LANGUAGES: { code: Language; htmlLang: string }[] = [
  { code: "pt", htmlLang: "pt-BR" },
  { code: "en", htmlLang: "en" },
  { code: "es", htmlLang: "es" },
]

// Portuguese is the source of truth: every other language must define exactly
// these keys, which the TranslationKey type enforces at compile time.
const pt = {
  "lang.label": "Idioma",
  "lang.pt": "Português",
  "lang.en": "English",
  "lang.es": "Español",

  "nav.features": "Recursos",
  "nav.demo": "Demo",
  "nav.install": "Instalação",
  "nav.download": "Download",
  "nav.home": "Início do GoAnime",
  "nav.label": "Navegação principal",
  "nav.skip": "Pular para o conteúdo",

  "hero.eyebrow": "Código aberto · Linux, macOS e Windows",
  "hero.title": "Assista anime direto do terminal.",
  "hero.subtitle":
    "O GoAnime busca em várias fontes ao mesmo tempo, toca o episódio no mpv e lembra onde você parou. Em português e inglês.",
  "hero.download": "Baixar o GoAnime",
  "hero.download.windows": "Baixar para Windows",
  "hero.download.macos": "Baixar para macOS",
  "hero.download.linux": "Baixar para Linux",
  "hero.github": "Ver no GitHub",
  "hero.stars": "estrelas no GitHub",

  "demo.title": "Veja funcionando",
  "demo.subtitle": "Uma sessão real: a busca, a lista de resultados com detalhes e o episódio tocando no mpv.",
  "demo.caption": "Gravado com curtas de animação japoneses em domínio público, de 1917 a 1929.",
  "demo.fallback": "Seu navegador não reproduz este vídeo.",

  "features.title": "O que ele faz",
  "features.subtitle": "Tudo pelo terminal, num único binário.",
  "features.sources.title": "Várias fontes ao mesmo tempo",
  "features.sources.body": "Pesquisa em todas as fontes ativas em paralelo e passa para outra quando uma falha.",
  "features.languages.title": "Português e inglês",
  "features.languages.body": "Animes legendados e dublados nos dois idiomas, além de filmes e séries em português.",
  "features.download.title": "Assista ou baixe",
  "features.download.body":
    "Escolha a qualidade e assista no mpv, ou baixe um episódio, um intervalo ou a série inteira, com nomes prontos para o Plex.",
  "features.resume.title": "Continua de onde parou",
  "features.resume.body": "Guarda o progresso de cada episódio e pula aberturas e encerramentos automaticamente.",
  "features.discord.title": "Discord Rich Presence",
  "features.discord.body": "Mostra no seu perfil do Discord o que você está assistindo.",
  "features.upscale.title": "Upscaling com Anime4K",
  "features.upscale.body": "Melhora a resolução de vídeos e imagens baixados.",

  "install.title": "Instalação",
  "install.subtitle":
    "O GoAnime usa o mpv para reproduzir vídeos. O instalador do Windows já inclui o mpv; nos outros sistemas, instale-o antes.",
  "install.tabs": "Sistema",
  "install.windows.body": "Baixe e execute o instalador. Ele instala o GoAnime e o mpv e adiciona os dois ao PATH.",
  "install.windows.button": "Baixar o instalador",
  "install.windows.note": "Prefere sem instalador? Há uma versão portátil em .zip na página de download.",
  "install.macos.body":
    "Instale o mpv com o Homebrew e depois o binário universal do GoAnime, que roda em Apple Silicon e Intel.",
  "install.linux.body": "Instale o mpv pelo gerenciador de pacotes da sua distribuição e depois o GoAnime:",
  "install.linux.note": "Em ARM64, troque amd64 por arm64.",
  "install.arch.body": "O GoAnime está no AUR. Com yay ou paru:",
  "install.go.body": "Com Go 1.27 ou mais recente:",
  "install.go.note":
    "O histórico de progresso usa SQLite e precisa de um compilador C (CGO). Os binários das releases já vêm com ele.",
  "install.after": "Depois de instalar, é só rodar",
  "install.update": "Para atualizar:",

  "copy.copy": "Copiar",
  "copy.copied": "Copiado",

  "usage.title": "Uso",
  "usage.subtitle": "Os comandos mais comuns.",
  "usage.help": "Rode goanime -h para ver todas as opções.",
  "usage.want": "O que você quer",
  "usage.command": "Comando",
  "usage.interactive": "Abrir a busca interativa",
  "usage.direct": "Buscar direto pelo nome",
  "usage.episode": "Baixar um episódio",
  "usage.range": "Baixar um intervalo",
  "usage.all": "Baixar todos os episódios",
  "usage.quality": "Escolher a qualidade",
  "usage.source": "Usar uma fonte específica",
  "usage.movie": "Baixar um filme",
  "usage.upscale": "Melhorar um vídeo com Anime4K",
  "usage.update": "Atualizar o GoAnime",

  "community.title": "Participe",
  "community.subtitle":
    "O GoAnime é feito pela comunidade. Toda ajuda conta, de relatar um bug a consertar uma fonte que parou de funcionar.",
  "community.github.title": "Contribua no GitHub",
  "community.github.body":
    "Os sites mudam e as fontes quebram: consertar uma delas é a contribuição mais útil. O guia de desenvolvimento explica como começar.",
  "community.github.cta": "Abrir o repositório",
  "community.discord.title": "Discord",
  "community.discord.body": "Tire dúvidas, mande sugestões e acompanhe as novas versões.",
  "community.discord.cta": "Entrar no servidor",
  "community.mobile.title": "GoAnime Mobile",
  "community.mobile.body": "A versão do GoAnime para Android.",
  "community.mobile.cta": "Ver o projeto",
  "community.star": "Se o GoAnime é útil para você, uma estrela no GitHub ajuda outras pessoas a encontrá-lo.",
  "community.star.cta": "Dar uma estrela",

  "footer.tagline": "Anime no terminal.",
  "footer.by": "Desenvolvido por",
  "footer.contributors": "e colaboradores.",
  "footer.logo": "Logo criado por um membro da comunidade.",
  "footer.license": "Licença MIT",
  "footer.releases": "Releases",
  "footer.project": "Projeto",
  "footer.community": "Comunidade",
  "footer.devguide": "Guia de desenvolvimento",
  "footer.disclaimer":
    "O GoAnime não hospeda, envia nem distribui nenhuma mídia. Ele acessa conteúdo que sites de terceiros disponibilizam publicamente e não tem vínculo com nenhum deles.",

  "download.back": "Voltar ao início",
  "download.title": "Baixar o GoAnime",
  "download.subtitle": "Escolha o seu sistema. Os arquivos vêm direto da versão mais recente publicada no GitHub.",
  "download.version": "Versão",
  "download.published": "Publicada em",
  "download.notes": "Notas da versão",
  "download.prerelease": "Pré-lançamento",
  "download.loading": "Consultando a versão mais recente no GitHub…",
  "download.error": "Não foi possível consultar o GitHub agora. Os botões abaixo levam sempre à versão mais recente.",
  "download.recommended": "Recomendado para você",
  "download.architecture": "Arquitetura",
  "download.size": "Tamanho",
  "download.windows.body": "Windows 10 ou mais recente, 64 bits. O instalador já inclui o mpv.",
  "download.windows.primary": "Baixar o instalador",
  "download.windows.secondary": "Versão portátil (.zip)",
  "download.macos.body": "Um único binário para Apple Silicon e Intel. Requer o mpv.",
  "download.macos.primary": "Baixar para macOS",
  "download.macos.secondary": "Arquivo .tar.gz",
  "download.linux.body": "Distribuições de 64 bits, em x86_64 ou ARM64. Requer o mpv.",
  "download.linux.primary": "Baixar o .tar.gz",
  "download.linux.secondary": "Binário avulso",
  "download.checksums": "Verificar os downloads (SHA-256)",
  "download.after.title": "Depois de baixar",
  "download.after.windows":
    "Execute o instalador e abra um terminal novo, para que o PATH atualizado seja carregado. Depois, rode",
  "download.after.macos": "No terminal, na pasta do download:",
  "download.after.linux": "Instale o mpv pelo gerenciador de pacotes e, na pasta do download:",
  "download.other.title": "Outras formas de instalar",
  "download.other.aur": "Arch Linux (AUR)",
  "download.other.go": "Com Go",
  "download.other.source": "Código-fonte",
  "download.other.source.body": "Clone o repositório e compile. O guia de desenvolvimento tem os detalhes.",
} as const

export type TranslationKey = keyof typeof pt
type Dictionary = Record<TranslationKey, string>

const en: Dictionary = {
  "lang.label": "Language",
  "lang.pt": "Português",
  "lang.en": "English",
  "lang.es": "Español",

  "nav.features": "Features",
  "nav.demo": "Demo",
  "nav.install": "Installation",
  "nav.download": "Download",
  "nav.home": "GoAnime home",
  "nav.label": "Main navigation",
  "nav.skip": "Skip to content",

  "hero.eyebrow": "Open source · Linux, macOS and Windows",
  "hero.title": "Watch anime from your terminal.",
  "hero.subtitle":
    "GoAnime searches several sources at once, plays the episode in mpv, and remembers where you stopped. In English and Brazilian Portuguese.",
  "hero.download": "Download GoAnime",
  "hero.download.windows": "Download for Windows",
  "hero.download.macos": "Download for macOS",
  "hero.download.linux": "Download for Linux",
  "hero.github": "View on GitHub",
  "hero.stars": "stars on GitHub",

  "demo.title": "See it in action",
  "demo.subtitle": "A real session: the search, the result list with details, and the episode playing in mpv.",
  "demo.caption": "Recorded with Japanese animated shorts in the public domain, from 1917 to 1929.",
  "demo.fallback": "Your browser cannot play this video.",

  "features.title": "What it does",
  "features.subtitle": "All from the terminal, in a single binary.",
  "features.sources.title": "Several sources at once",
  "features.sources.body": "Searches every enabled source in parallel and falls back to another when one fails.",
  "features.languages.title": "English and Portuguese",
  "features.languages.body": "Subbed and dubbed anime in both languages, plus movies and TV shows in Portuguese.",
  "features.download.title": "Stream or download",
  "features.download.body":
    "Pick a quality and watch in mpv, or download one episode, a range, or a whole series, named for Plex.",
  "features.resume.title": "Picks up where you left off",
  "features.resume.body": "Keeps your progress on every episode and skips openings and endings automatically.",
  "features.discord.title": "Discord Rich Presence",
  "features.discord.body": "Shows what you are watching on your Discord profile.",
  "features.upscale.title": "Anime4K upscaling",
  "features.upscale.body": "Improves the resolution of downloaded videos and images.",

  "install.title": "Installation",
  "install.subtitle":
    "GoAnime plays video through mpv. The Windows installer includes it; on other systems, install mpv first.",
  "install.tabs": "System",
  "install.windows.body": "Download and run the installer. It installs GoAnime and mpv and adds both to your PATH.",
  "install.windows.button": "Download the installer",
  "install.windows.note": "Prefer no installer? A portable .zip is on the download page.",
  "install.macos.body":
    "Install mpv with Homebrew, then GoAnime's universal binary, which runs on Apple Silicon and Intel.",
  "install.linux.body": "Install mpv with your distribution's package manager, then GoAnime:",
  "install.linux.note": "On ARM64, replace amd64 with arm64.",
  "install.arch.body": "GoAnime is in the AUR. With yay or paru:",
  "install.go.body": "With Go 1.27 or later:",
  "install.go.note": "Progress tracking uses SQLite and needs a C compiler (CGO). Release binaries include it.",
  "install.after": "Once installed, just run",
  "install.update": "To update:",

  "copy.copy": "Copy",
  "copy.copied": "Copied",

  "usage.title": "Usage",
  "usage.subtitle": "The most common commands.",
  "usage.help": "Run goanime -h for every option.",
  "usage.want": "What you want",
  "usage.command": "Command",
  "usage.interactive": "Open the interactive search",
  "usage.direct": "Search by name directly",
  "usage.episode": "Download one episode",
  "usage.range": "Download a range",
  "usage.all": "Download every episode",
  "usage.quality": "Choose the quality",
  "usage.source": "Use a specific source",
  "usage.movie": "Download a movie",
  "usage.upscale": "Upscale a video with Anime4K",
  "usage.update": "Update GoAnime",

  "community.title": "Get involved",
  "community.subtitle":
    "GoAnime is built by its community. Every bit helps, from reporting a bug to fixing a source that stopped working.",
  "community.github.title": "Contribute on GitHub",
  "community.github.body":
    "Sites change and sources break: fixing one is the most useful contribution. The development guide explains how to start.",
  "community.github.cta": "Open the repository",
  "community.discord.title": "Discord",
  "community.discord.body": "Ask questions, send suggestions, and follow new releases.",
  "community.discord.cta": "Join the server",
  "community.mobile.title": "GoAnime Mobile",
  "community.mobile.body": "The Android version of GoAnime.",
  "community.mobile.cta": "See the project",
  "community.star": "If GoAnime is useful to you, a star on GitHub helps other people find it.",
  "community.star.cta": "Star on GitHub",

  "footer.tagline": "Anime in the terminal.",
  "footer.by": "Developed by",
  "footer.contributors": "and contributors.",
  "footer.logo": "Logo designed by a member of the community.",
  "footer.license": "MIT License",
  "footer.releases": "Releases",
  "footer.project": "Project",
  "footer.community": "Community",
  "footer.devguide": "Development guide",
  "footer.disclaimer":
    "GoAnime does not host, upload, or distribute any media. It retrieves content that third-party websites make publicly available and is not affiliated with any of them.",

  "download.back": "Back to home",
  "download.title": "Download GoAnime",
  "download.subtitle": "Pick your system. The files come straight from the latest release published on GitHub.",
  "download.version": "Version",
  "download.published": "Published on",
  "download.notes": "Release notes",
  "download.prerelease": "Pre-release",
  "download.loading": "Checking GitHub for the latest release…",
  "download.error": "GitHub could not be reached right now. The buttons below always lead to the latest release.",
  "download.recommended": "Recommended for you",
  "download.architecture": "Architecture",
  "download.size": "Size",
  "download.windows.body": "Windows 10 or later, 64-bit. The installer includes mpv.",
  "download.windows.primary": "Download the installer",
  "download.windows.secondary": "Portable version (.zip)",
  "download.macos.body": "One binary for Apple Silicon and Intel. Requires mpv.",
  "download.macos.primary": "Download for macOS",
  "download.macos.secondary": ".tar.gz archive",
  "download.linux.body": "64-bit distributions, on x86_64 or ARM64. Requires mpv.",
  "download.linux.primary": "Download the .tar.gz",
  "download.linux.secondary": "Standalone binary",
  "download.checksums": "Verify the downloads (SHA-256)",
  "download.after.title": "After downloading",
  "download.after.windows": "Run the installer and open a new terminal so the updated PATH is picked up. Then run",
  "download.after.macos": "In a terminal, in the download folder:",
  "download.after.linux": "Install mpv with your package manager and, in the download folder:",
  "download.other.title": "Other ways to install",
  "download.other.aur": "Arch Linux (AUR)",
  "download.other.go": "With Go",
  "download.other.source": "Source code",
  "download.other.source.body": "Clone the repository and build it. The development guide has the details.",
}

const es: Dictionary = {
  "lang.label": "Idioma",
  "lang.pt": "Português",
  "lang.en": "English",
  "lang.es": "Español",

  "nav.features": "Funciones",
  "nav.demo": "Demo",
  "nav.install": "Instalación",
  "nav.download": "Descargar",
  "nav.home": "Inicio de GoAnime",
  "nav.label": "Navegación principal",
  "nav.skip": "Saltar al contenido",

  "hero.eyebrow": "Código abierto · Linux, macOS y Windows",
  "hero.title": "Mira anime desde tu terminal.",
  "hero.subtitle":
    "GoAnime busca en varias fuentes a la vez, reproduce el episodio en mpv y recuerda dónde te quedaste. En inglés y portugués de Brasil.",
  "hero.download": "Descargar GoAnime",
  "hero.download.windows": "Descargar para Windows",
  "hero.download.macos": "Descargar para macOS",
  "hero.download.linux": "Descargar para Linux",
  "hero.github": "Ver en GitHub",
  "hero.stars": "estrellas en GitHub",

  "demo.title": "Míralo en acción",
  "demo.subtitle":
    "Una sesión real: la búsqueda, la lista de resultados con detalles y el episodio reproduciéndose en mpv.",
  "demo.caption": "Grabado con cortos de animación japoneses de dominio público, de 1917 a 1929.",
  "demo.fallback": "Tu navegador no puede reproducir este video.",

  "features.title": "Qué hace",
  "features.subtitle": "Todo desde la terminal, en un solo binario.",
  "features.sources.title": "Varias fuentes a la vez",
  "features.sources.body": "Busca en todas las fuentes activas en paralelo y pasa a otra cuando una falla.",
  "features.languages.title": "Inglés y portugués",
  "features.languages.body": "Anime subtitulado y doblado en ambos idiomas, además de películas y series en portugués.",
  "features.download.title": "Mira o descarga",
  "features.download.body":
    "Elige la calidad y mira en mpv, o descarga un episodio, un rango o la serie completa, con nombres listos para Plex.",
  "features.resume.title": "Sigue donde lo dejaste",
  "features.resume.body": "Guarda tu progreso en cada episodio y salta aperturas y cierres automáticamente.",
  "features.discord.title": "Discord Rich Presence",
  "features.discord.body": "Muestra en tu perfil de Discord lo que estás viendo.",
  "features.upscale.title": "Escalado con Anime4K",
  "features.upscale.body": "Mejora la resolución de videos e imágenes descargados.",

  "install.title": "Instalación",
  "install.subtitle":
    "GoAnime reproduce video con mpv. El instalador de Windows ya lo incluye; en otros sistemas, instala mpv antes.",
  "install.tabs": "Sistema",
  "install.windows.body": "Descarga y ejecuta el instalador. Instala GoAnime y mpv y agrega ambos al PATH.",
  "install.windows.button": "Descargar el instalador",
  "install.windows.note": "¿Prefieres sin instalador? Hay una versión portátil en .zip en la página de descarga.",
  "install.macos.body":
    "Instala mpv con Homebrew y luego el binario universal de GoAnime, que funciona en Apple Silicon e Intel.",
  "install.linux.body": "Instala mpv con el gestor de paquetes de tu distribución y luego GoAnime:",
  "install.linux.note": "En ARM64, cambia amd64 por arm64.",
  "install.arch.body": "GoAnime está en el AUR. Con yay o paru:",
  "install.go.body": "Con Go 1.27 o posterior:",
  "install.go.note":
    "El historial de progreso usa SQLite y necesita un compilador C (CGO). Los binarios de las releases ya lo incluyen.",
  "install.after": "Una vez instalado, ejecuta",
  "install.update": "Para actualizar:",

  "copy.copy": "Copiar",
  "copy.copied": "Copiado",

  "usage.title": "Uso",
  "usage.subtitle": "Los comandos más comunes.",
  "usage.help": "Ejecuta goanime -h para ver todas las opciones.",
  "usage.want": "Lo que quieres",
  "usage.command": "Comando",
  "usage.interactive": "Abrir la búsqueda interactiva",
  "usage.direct": "Buscar directamente por nombre",
  "usage.episode": "Descargar un episodio",
  "usage.range": "Descargar un rango",
  "usage.all": "Descargar todos los episodios",
  "usage.quality": "Elegir la calidad",
  "usage.source": "Usar una fuente específica",
  "usage.movie": "Descargar una película",
  "usage.upscale": "Mejorar un video con Anime4K",
  "usage.update": "Actualizar GoAnime",

  "community.title": "Participa",
  "community.subtitle":
    "GoAnime lo hace su comunidad. Toda ayuda cuenta, desde reportar un error hasta arreglar una fuente que dejó de funcionar.",
  "community.github.title": "Contribuye en GitHub",
  "community.github.body":
    "Los sitios cambian y las fuentes se rompen: arreglar una es la contribución más útil. La guía de desarrollo explica cómo empezar.",
  "community.github.cta": "Abrir el repositorio",
  "community.discord.title": "Discord",
  "community.discord.body": "Haz preguntas, envía sugerencias y sigue las nuevas versiones.",
  "community.discord.cta": "Unirse al servidor",
  "community.mobile.title": "GoAnime Mobile",
  "community.mobile.body": "La versión de GoAnime para Android.",
  "community.mobile.cta": "Ver el proyecto",
  "community.star": "Si GoAnime te resulta útil, una estrella en GitHub ayuda a que otras personas lo encuentren.",
  "community.star.cta": "Dar una estrella",

  "footer.tagline": "Anime en la terminal.",
  "footer.by": "Desarrollado por",
  "footer.contributors": "y colaboradores.",
  "footer.logo": "Logo creado por un miembro de la comunidad.",
  "footer.license": "Licencia MIT",
  "footer.releases": "Releases",
  "footer.project": "Proyecto",
  "footer.community": "Comunidad",
  "footer.devguide": "Guía de desarrollo",
  "footer.disclaimer":
    "GoAnime no aloja, sube ni distribuye ningún contenido. Accede a contenido que sitios de terceros ponen a disposición del público y no está afiliado a ninguno de ellos.",

  "download.back": "Volver al inicio",
  "download.title": "Descargar GoAnime",
  "download.subtitle": "Elige tu sistema. Los archivos vienen directo de la última versión publicada en GitHub.",
  "download.version": "Versión",
  "download.published": "Publicada el",
  "download.notes": "Notas de la versión",
  "download.prerelease": "Prelanzamiento",
  "download.loading": "Consultando la última versión en GitHub…",
  "download.error": "No se pudo consultar GitHub ahora. Los botones de abajo llevan siempre a la última versión.",
  "download.recommended": "Recomendado para ti",
  "download.architecture": "Arquitectura",
  "download.size": "Tamaño",
  "download.windows.body": "Windows 10 o posterior, 64 bits. El instalador ya incluye mpv.",
  "download.windows.primary": "Descargar el instalador",
  "download.windows.secondary": "Versión portátil (.zip)",
  "download.macos.body": "Un solo binario para Apple Silicon e Intel. Requiere mpv.",
  "download.macos.primary": "Descargar para macOS",
  "download.macos.secondary": "Archivo .tar.gz",
  "download.linux.body": "Distribuciones de 64 bits, en x86_64 o ARM64. Requiere mpv.",
  "download.linux.primary": "Descargar el .tar.gz",
  "download.linux.secondary": "Binario suelto",
  "download.checksums": "Verificar las descargas (SHA-256)",
  "download.after.title": "Después de descargar",
  "download.after.windows":
    "Ejecuta el instalador y abre una terminal nueva para que se cargue el PATH actualizado. Luego ejecuta",
  "download.after.macos": "En una terminal, en la carpeta de descarga:",
  "download.after.linux": "Instala mpv con tu gestor de paquetes y, en la carpeta de descarga:",
  "download.other.title": "Otras formas de instalar",
  "download.other.aur": "Arch Linux (AUR)",
  "download.other.go": "Con Go",
  "download.other.source": "Código fuente",
  "download.other.source.body": "Clona el repositorio y compílalo. La guía de desarrollo tiene los detalles.",
}

const dictionaries: Record<Language, Dictionary> = { pt, en, es }

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = "language"

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("pt")

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && saved in dictionaries) setLanguageState(saved as Language)
    } catch {
      // Storage can be unavailable (private mode); Portuguese stays the default.
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = LANGUAGES.find((l) => l.code === language)?.htmlLang ?? "pt-BR"
  }, [language])

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Not persisted; the choice still applies to this visit.
    }
  }, [])

  const value = useMemo<LanguageContextType>(
    () => ({ language, setLanguage, t: (key) => dictionaries[language][key] }),
    [language, setLanguage],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
