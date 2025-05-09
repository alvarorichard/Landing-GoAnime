"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Github, Terminal, Download, Play, Code, Sparkles, ChevronRight, Zap, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ParticleBackground from "@/components/particle-background"
import { CommandMenu } from "@/components/command-menu"
import { useMobile } from "@/hooks/use-mobile"
import Image from "next/image"

export default function Home() {
  const [showCommand, setShowCommand] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const isMobile = useMobile()

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setShowCommand((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <ParticleBackground />

      {/* Command Menu */}
      <AnimatePresence>{showCommand && <CommandMenu onClose={() => setShowCommand(false)} />}</AnimatePresence>

      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-teal-500 blur-md opacity-70"></div>
              <Terminal className="h-6 w-6 text-white relative z-10" />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
              GoAnime
            </span>
          </div>

          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Recursos
            </Link>
            <Link href="#installation" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Instalação
            </Link>
            <Link href="#usage" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Como Usar
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex border-white/20 text-white/70 hover:text-white hover:border-white/50"
              onClick={() => setShowCommand(true)}
            >
              <span className="text-xs">Pressione</span>
              <kbd className="pointer-events-none mx-1 inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-black px-1.5 font-mono text-[10px] font-medium text-white/70">
                <span className="text-xs">⌘/Ctrl</span>K
              </kbd>
            </Button>

            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 border-0"
            >
              <Link href="https://github.com/alvarorichard/GoAnime" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <motion.div style={{ opacity, scale }} className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>
        </motion.div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex flex-col items-start text-left md:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm backdrop-blur"
              >
                <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                <span>Anime no terminal, simples e poderoso</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500"
              >
                GoAnime
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl"
              >
                Um player de anime para terminal construído em Go, que permite buscar, assistir e baixar episódios
                diretamente no MPV com uma experiência fluida e moderna.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 border-0 h-12 px-6"
                >
                  <Link href="https://github.com/alvarorichard/GoAnime" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    Ver no GitHub
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 h-12 px-6"
                >
                  <Link href="#installation">
                    <Download className="mr-2 h-5 w-5" />
                    Instalar Agora
                  </Link>
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4, type: "spring" }}
              className="md:w-1/2 flex justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/30 to-purple-600/30 rounded-full blur-xl opacity-75 animate-pulse"></div>
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="relative"
                >
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gofer-05790W7KTaKKhRqGEFvzlWLN89LB06.png"
                    alt="GoAnime mascote"
                    width={300}
                    height={300}
                    className="relative z-10 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                    priority
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent"></div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-20 md:py-32 relative">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-white/70 backdrop-blur border border-white/10 mb-4"
            >
              <span>Recursos Incríveis</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500"
            >
              Experiência Extraordinária
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white/70 max-w-2xl mx-auto"
            >
              Descubra o que torna o GoAnime uma ferramenta única para os amantes de anime
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br from-teal-500 to-purple-600">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-white/70">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section id="installation" className="py-20 md:py-32 relative">
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-white/70 backdrop-blur border border-white/10 mb-4"
            >
              <span>Instalação Simples</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500"
            >
              Comece em Segundos
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white/70 max-w-2xl mx-auto"
            >
              Escolha o método de instalação que funciona melhor para você
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {installations.map((install, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardContent className="p-6 relative z-10">
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors flex items-center">
                      {install.icon}
                      <span className="ml-2">{install.title}</span>
                    </h3>
                    <p className="text-white/70 mb-4">{install.description}</p>
                    <div className="bg-black/50 rounded-lg border border-white/10 p-4 font-mono text-sm overflow-x-auto">
                      {install.code.split("\n").map((line, i) => (
                        <div key={i} className="whitespace-pre">
                          {line}
                        </div>
                      ))}
                    </div>
                    <Button variant="link" className="mt-4 text-teal-400 hover:text-teal-300 p-0 h-auto">
                      <Link
                        href="https://github.com/alvarorichard/GoAnime"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        Saiba mais
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage Section */}
      <section id="usage" className="py-20 md:py-32 relative">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-white/70 backdrop-blur border border-white/10 mb-4"
            >
              <span>Como Usar</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500"
            >
              Simples e Intuitivo
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white/70 max-w-2xl mx-auto"
            >
              Comandos simples para começar a usar o GoAnime imediatamente
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1"
            >
              <div className="space-y-6">
                {usageSteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                      <p className="text-white/70">{step.description}</p>
                      {step.code && (
                        <div className="mt-2 bg-black/50 rounded-lg border border-white/10 p-3 font-mono text-sm overflow-x-auto">
                          <code className="text-teal-400">{step.code}</code>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-purple-600 rounded-xl blur-sm opacity-75"></div>
                <div className="relative bg-black rounded-xl overflow-hidden border border-white/10">
                  <div className="h-8 w-full bg-gray-900/80 flex items-center px-4 gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 text-xs text-white/70">demo</div>
                  </div>
                  <div className="p-4 font-mono text-sm">
                    <p className="text-gray-400">
                      $ <span className="text-white">go-anime "demon slayer"</span>
                    </p>
                    <p className="mt-2 text-teal-400">Buscando "demon slayer"...</p>
                    <p className="mt-2 text-white">
                      Encontrado: <span className="text-purple-400">Demon Slayer: Kimetsu no Yaiba</span>
                    </p>
                    <p className="mt-2 text-teal-400">Carregando episódios...</p>
                    <div className="mt-2 flex flex-col gap-1">
                      <p className="text-white">
                        1. <span className="text-purple-400">Episódio 1 - Crueldade</span>
                      </p>
                      <p className="text-white">
                        2. <span className="text-purple-400">Episódio 2 - O Treinador Urokodaki Sakonji</span>
                      </p>
                      <p className="text-white">
                        3. <span className="text-purple-400">Episódio 3 - Sabito e Makomo</span>
                      </p>
                    </div>
                    <p className="mt-2 text-gray-400">
                      Selecione um episódio: <span className="text-white">1</span>
                    </p>
                    <p className="mt-2 text-teal-400">Iniciando MPV...</p>
                    <p className="mt-2 text-white">
                      Reproduzindo: <span className="text-purple-400">Demon Slayer - Episódio 1 - Crueldade</span>
                    </p>
                    <div className="mt-2 flex items-center">
                      <span className="text-gray-400">$</span>
                      <span className="ml-2 h-4 w-2 bg-white/70 animate-pulse"></span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 to-purple-900/20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-teal-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-white/70 backdrop-blur border border-white/10 mb-4">
              <span>Pronto para começar?</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500">
              Experimente o GoAnime Hoje
            </h2>

            <p className="text-white/70 mb-8 text-lg">
              Junte-se a milhares de usuários que já estão aproveitando a melhor experiência de anime no terminal.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 border-0 h-12 px-8"
              >
                <Link href="https://github.com/alvarorichard/GoAnime" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  Ver no GitHub
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 h-12 px-8"
              >
                <Link href="#installation">
                  <Download className="mr-2 h-5 w-5" />
                  Instalar Agora
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 relative z-10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-teal-400" />
              <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
                GoAnime
              </span>
            </div>

            <p className="text-sm text-white/50">
              Desenvolvido por{" "}
              <Link
                href="https://github.com/alvarorichard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300"
              >
                alvarorichard
              </Link>
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/alvarorichard/GoAnime"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: <Terminal className="h-6 w-6 text-white" />,
    title: "Interface CLI Elegante",
    description: "Interface de linha de comando intuitiva e moderna para buscar e assistir animes com facilidade.",
  },
  {
    icon: <Play className="h-6 w-6 text-white" />,
    title: "Reprodução Direta",
    description: "Reproduza episódios diretamente no MPV sem precisar abrir o navegador ou outros aplicativos.",
  },
  {
    icon: <Zap className="h-6 w-6 text-white" />,
    title: "Rápido e Eficiente",
    description: "Construído em Go para oferecer desempenho excepcional e consumo mínimo de recursos.",
  },
  {
    icon: <Layers className="h-6 w-6 text-white" />,
    title: "Múltiplas Fontes",
    description: "Acesse animes de várias fontes para garantir a melhor qualidade e disponibilidade.",
  },
  {
    icon: <Code className="h-6 w-6 text-white" />,
    title: "Código Aberto",
    description: "Projeto totalmente open source, permitindo contribuições e personalizações da comunidade.",
  },
  {
    icon: <Download className="h-6 w-6 text-white" />,
    title: "Download de Episódios",
    description: "Baixe episódios para assistir offline quando e onde quiser, sem depender de conexão com a internet.",
  },
]

const installations = [
  {
    icon: <Terminal className="h-5 w-5 text-teal-400" />,
    title: "Instalação Universal",
    description: "Recomendado para a maioria dos usuários (apenas Go necessário)",
    code: "go install github.com/alvarorichard/Goanime/cmd/goanime@latest",
  },
  {
    icon: <Code className="h-5 w-5 text-teal-400" />,
    title: "Instalação Manual",
    description: "Clone o repositório e instale manualmente",
    code: "git clone https://github.com/alvarorichard/GoAnime.git\ncd GoAnime\nsudo bash install.sh",
  },
  {
    icon: <Layers className="h-5 w-5 text-teal-400" />,
    title: "Arch Linux (AUR)",
    description: "Para usuários do Arch Linux",
    code: "# Usando paru\nparu -S goanime\n\n# Usando yay\nyay -S goanime",
  },
  {
    icon: <Sparkles className="h-5 w-5 text-teal-400" />,
    title: "NixOS (Flakes)",
    description: "Para usuários do NixOS",
    code: "# Execução temporária\nnix github:alvarorichard/GoAnime",
  },
]

const usageSteps = [
  {
    title: "Inicie o GoAnime",
    description: "Abra seu terminal e execute o comando para iniciar o GoAnime.",
    code: "go-anime    # Linux/macOS\ngoanime     # Windows",
  },
  {
    title: "Busque seu anime favorito",
    description: "Digite o nome do anime que deseja assistir ou use a busca direta.",
    code: 'goanime "demon slayer"',
  },
  {
    title: "Selecione o anime",
    description: "Navegue pela lista de resultados usando as setas do teclado e pressione Enter para selecionar.",
  },
  {
    title: "Escolha o episódio",
    description: "Selecione o episódio que deseja assistir da lista apresentada.",
  },
  {
    title: "Aproveite!",
    description: "O episódio será reproduzido automaticamente no MPV. Relaxe e aproveite seu anime!",
  },
]
