// "use client"

// import { useEffect, useRef, useState } from "react"
// import Link from "next/link"
// import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
// import { Github, Terminal, Download, Play, Code, Sparkles, ChevronRight, Zap, Layers } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import ParticleBackground from "@/components/particle-background"
// import { CommandMenu } from "@/components/command-menu"
// import Image from "next/image"
// import { LanguageSwitcher } from "@/components/language-switcher"
// import { useLanguage } from "@/contexts/language-context"

// export default function Home() {
//   const [showCommand, setShowCommand] = useState(false)
//   const heroRef = useRef<HTMLDivElement>(null)
//   const featuresRef = useRef<HTMLDivElement>(null)
//   const { scrollYProgress } = useScroll()
//   const { t } = useLanguage()
//   const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)

//   const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
//   const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])

//   // Terminal typing animation state
//   const terminalLines = [
//     `$ ${t("terminal.demo.command")}`,
//     t("terminal.demo.searching"),
//     `${t("terminal.demo.found")} ${t("terminal.demo.anime")}`,
//     t("terminal.demo.loading"),
//     `1. ${t("terminal.demo.episode1")}`,
//     `2. ${t("terminal.demo.episode2")}`,
//     `3. ${t("terminal.demo.episode3")}`,
//     `${t("terminal.demo.select")} 1`,
//     t("terminal.demo.starting"),
//     `${t("terminal.demo.playing")} ${t("terminal.demo.playing.ep")}`,
//   ]
//   const [typedLines, setTypedLines] = useState<string[]>([""])
//   const [typing, setTyping] = useState(true)
//   const lineRef = useRef(0)
//   const charRef = useRef(0)
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null)

//   useEffect(() => {
//     let cancelled = false
//     lineRef.current = 0
//     charRef.current = 0
//     setTypedLines([""])
//     setTyping(true)
//     function typeNext() {
//       if (cancelled) return
//       if (lineRef.current >= terminalLines.length) {
//         setTyping(false)
//         return
//       }
//       setTypedLines((prev) => {
//         if (cancelled) return prev
//         const newLines = prev.slice(0, lineRef.current + 1)
//         newLines[lineRef.current] = terminalLines[lineRef.current].slice(0, charRef.current + 1)
//         return newLines
//       })
//       if (charRef.current < terminalLines[lineRef.current].length - 1) {
//         charRef.current++
//         timeoutRef.current = setTimeout(typeNext, 18)
//       } else {
//         charRef.current = 0
//         lineRef.current++
//         timeoutRef.current = setTimeout(typeNext, 350)
//       }
//     }
//     timeoutRef.current = setTimeout(typeNext, 0)
//     return () => {
//       cancelled = true
//       if (timeoutRef.current) clearTimeout(timeoutRef.current)
//     }
//     // eslint-disable-next-line
//   }, [t])

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
//         e.preventDefault()
//         setShowCommand((prev) => { return !prev; })
//       }
//     }

//     const handleMouseMove = (e: MouseEvent) => {
//       setMousePos({ x: e.clientX, y: e.clientY })
//     }
//     const handleMouseLeave = () => {
//       setMousePos(null)
//     }

//     window.addEventListener("keydown", handleKeyDown)
//     window.addEventListener("mousemove", handleMouseMove)
//     window.addEventListener("mouseleave", handleMouseLeave)

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown)
//       window.removeEventListener("mousemove", handleMouseMove)
//       window.removeEventListener("mouseleave", handleMouseLeave)
//     }
//   }, [])

//   return (
//     <div className="min-h-screen bg-black text-white overflow-hidden">
//       {/* Mouse-following purple blur */}
//       {mousePos && (
//         <div
//           style={{
//             position: "fixed",
//             left: mousePos.x - 200, // center the blur
//             top: mousePos.y - 200,
//             width: 400,
//             height: 400,
//             pointerEvents: "none",
//             zIndex: 0,
//             background: "radial-gradient(circle, rgba(168,85,247,0.35) 0%, rgba(168,85,247,0.15) 70%, transparent 100%)",
//             filter: "blur(120px)",
//             borderRadius: "50%",
//             transition: "left 0.1s linear, top 0.1s linear"
//           }}
//         />
//       )}

//       <ParticleBackground />

//       {/* Command Menu */}
//       <AnimatePresence>{showCommand && (<CommandMenu onClose={() => { setShowCommand(false); }} />)}</AnimatePresence>

//       {/* Header */}
//       <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
//         <div className="container flex h-16 items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="relative">
//               <div className="absolute inset-0 rounded-full bg-teal-500 blur-md opacity-70"></div>
//               <Terminal className="h-6 w-6 text-white relative z-10" />
//             </div>
//             <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
//               GoAnime
//             </span>
//           </div>

//           <nav className="hidden md:flex gap-6">
//             <Link href="#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
//               {t("nav.features")}
//             </Link>
//             <Link href="#installation" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
//               {t("nav.installation")}
//             </Link>
//             <Link href="#usage" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
//               {t("nav.usage")}
//             </Link>
//             <Link href="/download" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
//               {t("nav.download")}
//             </Link>
//           </nav>

//           <div className="flex items-center gap-4">
//             <LanguageSwitcher />

//             <Button
//               variant="outline"
//               size="sm"
//               className="hidden md:flex border-white/20 text-white/70 hover:text-white hover:border-white/50"
//               onClick={() => { setShowCommand(true); }}
//             >
//               <span className="text-xs">{t("nav.press")}</span>
//               <kbd className="pointer-events-none mx-1 inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-black px-1.5 font-mono text-[10px] font-medium text-white/70">
//                 <span className="text-xs">⌘/Ctrl</span>K
//               </kbd>
//             </Button>

//             <Button
//               asChild
//               className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 border-0"
//               size="sm"
//             >
//               <Link href="https://github.com/alvarorichard/GoAnime" target="_blank" rel="noopener noreferrer">
//                 <Github className="mr-2 h-4 w-4" />
//                 GitHub
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
//         <motion.div style={{ opacity, scale }} className="absolute inset-0 z-0">
//           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob"></div>
//           <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
//           <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>
//         </motion.div>

//         <div className="container px-4 md:px-6 relative z-10">
//           <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
//             <div className="flex flex-col items-start text-left md:w-1/2">
//               <div
//                 data-aos="fade-up"
//                 data-aos-duration="800"
//                 className="mb-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm backdrop-blur"
//               >
//                 <Sparkles className="h-3.5 w-3.5 text-teal-400" />
//                 <span>{t("hero.tagline")}</span>
//               </div>

//               <h1
//                 data-aos="fade-up"
//                 data-aos-duration="800"
//                 data-aos-delay="100"
//                 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500"
//               >
//                 GoAnime
//               </h1>

//               <p
//                 data-aos="fade-up"
//                 data-aos-duration="800"
//                 data-aos-delay="200"
//                 className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl"
//               >
//                 {t("hero.description")}
//               </p>

//               <div
//                 data-aos="fade-up"
//                 data-aos-duration="800"
//                 data-aos-delay="300"
//                 className="flex flex-col sm:flex-row gap-4"
//               >
//                 <Button
//                   asChild
//                   size="lg"
//                   className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 border-0 h-12 px-6"
//                 >
//                   <Link href="https://github.com/alvarorichard/GoAnime" target="_blank" rel="noopener noreferrer">
//                     <Github className="mr-2 h-5 w-5" />
//                     {t("hero.github")}
//                   </Link>
//                 </Button>

//                 <Button
//                   asChild
//                   variant="outline"
//                   size="lg"
//                   className="border-white/20 text-white hover:bg-white/10 h-12 px-6"
//                 >
//                   <Link href="/download" className="flex items-center">
//                     <Download className="mr-2 h-5 w-5" />
//                     {t("hero.install")}
//                   </Link>
//                 </Button>
//               </div>
//             </div>

//             <div
//               data-aos="fade-left"
//               data-aos-duration="1000"
//               data-aos-delay="400"
//               className="md:w-1/2 flex justify-center"
//             >
//               <div className="relative">
//                 <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/30 to-purple-600/30 rounded-full blur-xl opacity-75 animate-pulse"></div>
//                 <motion.div
//                   initial={{ y: 0 }}
//                   animate={{ y: [0, -10, 0] }}
//                   transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
//                   className="relative"
//                 >
//                   <Image
//                     src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gofer-05790W7KTaKKhRqGEFvzlWLN89LB06.png"
//                     alt="GoAnime mascote"
//                     width={300}
//                     height={300}
//                     className="relative z-10 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]"
//                     priority
//                   />
//                 </motion.div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent"></div>
//       </section>

//       {/* Star on GitHub CTA */}
//       <section className="w-full flex justify-center mt-8">
//         <a
//           href="https://github.com/alvarorichard/GoAnime"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-purple-600 text-white font-semibold shadow-lg hover:from-teal-600 hover:to-purple-700 transition-colors"
//         >
//           <Github className="h-5 w-5" />
//           {t("star.cta")}
//         </a>
//       </section>

//       {/* Features Section */}
//       <section id="features" ref={featuresRef} className="py-20 md:py-32 relative">
//         <div className="container px-4 md:px-6 relative z-10">
//           <div className="text-center mb-16">
//             <div
//               data-aos="fade-up"
//               data-aos-duration="800"
//               className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-white/70 backdrop-blur border border-white/10 mb-4"
//             >
//               <span>{t("features.badge")}</span>
//             </div>

//             <h2
//               data-aos="fade-up"
//               data-aos-duration="800"
//               data-aos-delay="100"
//               className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500"
//             >
//               {t("features.title")}
//             </h2>

//             <p
//               data-aos="fade-up"
//               data-aos-duration="800"
//               data-aos-delay="200"
//               className="text-white/70 max-w-2xl mx-auto"
//             >
//               {t("features.subtitle")}
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div
//               data-aos="fade-up"
//               data-aos-duration="800"
//               data-aos-delay="100"
//             >
//               <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
//                 <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 <CardContent className="p-6 relative z-10">
//                   <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br from-teal-500 to-purple-600">
//                     <Terminal className="h-6 w-6 text-white" />
//                   </div>
//                   <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors">
//                     {t("features.cli.title")}
//                   </h3>
//                   <p className="text-white/70">{t("features.cli.description")}</p>
//                 </CardContent>
//               </Card>
//             </div>

//             <div
//               data-aos="fade-up"
//               data-aos-duration="800"
//               data-aos-delay="200"
//             >
//               <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
//                 <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 <CardContent className="p-6 relative z-10">
//                   <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br from-teal-500 to-purple-600">
//                     <Play className="h-6 w-6 text-white" />
//                   </div>
//                   <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors">
//                     {t("features.playback.title")}
//                   </h3>
//                   <p className="text-white/70">{t("features.playback.description")}</p>
//                 </CardContent>
//               </Card>
//             </div>

//             <div
//               data-aos="fade-up"
//               data-aos-duration="800"
//               data-aos-delay="300"
//             >
//               <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
//                 <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 <CardContent className="p-6 relative z-10">
//                   <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br from-teal-500 to-purple-600">
//                     <Zap className="h-6 w-6 text-white" />
//                   </div>
//                   <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors">
//                     {t("features.fast.title")}
//                   </h3>
//                   <p className="text-white/70">{t("features.fast.description")}</p>
//                 </CardContent>
//               </Card>
//             </div>

//             <div
//               data-aos="fade-up"
//               data-aos-duration="800"
//               data-aos-delay="400"
//             >
//               <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
//                 <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 <CardContent className="p-6 relative z-10">
//                   <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br from-teal-500 to-purple-600">
//                     <Layers className="h-6 w-6 text-white" />
//                   </div>
//                   <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors">
//                     {t("features.sources.title")}
//                   </h3>
//                   <p className="text-white/70">{t("features.sources.description")}</p>
//                 </CardContent>
//               </Card>
//             </div>

//             <div
//               data-aos="fade-up"
//               data-aos-duration="800"
//               data-aos-delay="500"
//             >
//               <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
//                 <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 <CardContent className="p-6 relative z-10">
//                   <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br from-teal-500 to-purple-600">
//                     <Code className="h-6 w-6 text-white" />
//                   </div>
//                   <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors">
//                     {t("features.opensource.title")}
//                   </h3>
//                   <p className="text-white/70">{t("features.opensource.description")}</p>
//                 </CardContent>
//               </Card>
//             </div>

//             <div
//               data-aos="fade-up"
//               data-aos-duration="800"
//               data-aos-delay="600"
//             >
//               <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
//                 <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 <CardContent className="p-6 relative z-10">
//                   <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br from-teal-500 to-purple-600">
//                     <Download className="h-6 w-6 text-white" />
//                   </div>
//                   <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors">
//                     {t("features.download.title")}
//                   </h3>
//                   <p className="text-white/70">{t("features.download.description")}</p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Installation Section */}
//       <section id="installation" className="py-20 md:py-32 relative">
//         <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0">
//           <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
//           <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
//         </div>

//         <div className="container px-4 md:px-6 relative z-10">
//           <div className="text-center mb-16">
//             <div
//               data-aos="fade-up"
//               data-aos-duration="800"
//               className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-white/70 backdrop-blur border border-white/10 mb-4"
//             >
//               <span>{t("install.badge")}</span>
//             </div>

//             <h2
//               data-aos="fade-up"
//               data-aos-duration="800"
//               data-aos-delay="100"
//               className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500"
//             >
//               {t("install.title")}
//             </h2>

//             <p
//               data-aos="fade-up"
//               data-aos-duration="800"
//               data-aos-delay="200"
//               className="text-white/70 max-w-2xl mx-auto"
//             >
//               {t("install.subtitle")}
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div
//               data-aos="fade-up"
//               data-aos-duration="800"
//               data-aos-delay="100"
//             >
//               <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
//                 <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 <CardContent className="p-6 relative z-10">
//                   <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors flex items-center">
//                     <Terminal className="h-5 w-5 text-teal-400 mr-2" />
//                     {t("install.universal.title")}
//                   </h3>
//                   <p className="text-white/70 mb-4">{t("install.universal.description")}</p>
//                   <div className="bg-black/50 rounded-lg border border-white/10 p-4 font-mono text-sm overflow-x-auto">
//                     <div className="whitespace-pre">{t("terminal.universal.command")}</div>
//                   </div>
//                   <Button variant="link" className="mt-4 text-teal-400 hover:text-teal-300 p-0 h-auto">
//                     <Link
//                       href="https://github.com/alvarorichard/GoAnime"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center"
//                     >
//                       {t("install.learnmore")}
//                       <ChevronRight className="ml-1 h-4 w-4" />
//                     </Link>
//                   </Button>
//                 </CardContent>
//               </Card>
//             </div>

//             <div
//               data-aos="fade-up"
//               data-aos-duration="800"
//               data-aos-delay="200"
//             >
//               <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
//                 <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 <CardContent className="p-6 relative z-10">
//                   <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors flex items-center">
//                     <Code className="h-5 w-5 text-teal-400 mr-2" />
//                     {t("install.manual.title")}
//                   </h3>
//                   <p className="text-white/70 mb-4">{t("install.manual.description")}</p>
//                   <div className="bg-black/50 rounded-lg border border-white/10 p-4 font-mono text-sm overflow-x-auto">
//                     <div className="whitespace-pre">{t("terminal.manual.clone")}</div>
//                     <div className="whitespace-pre">{t("terminal.manual.cd")}</div>
//                     <div className="whitespace-pre">{t("terminal.manual.install")}</div>
//                   </div>
//                   <Button variant="link" className="mt-4 text-teal-400 hover:text-teal-300 p-0 h-auto">
//                     <Link
//                       href="https://github.com/alvarorichard/GoAnime"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center"
//                     >
//                       {t("install.learnmore")}
//                       <ChevronRight className="ml-1 h-4 w-4" />
//                     </Link>
//                   </Button>
//                 </CardContent>
//               </Card>
//             </div>

//             <div
//               data-aos="fade-up"
//               data-aos-duration="800"
//               data-aos-delay="300"
//             >
//               <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
//                 <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 <CardContent className="p-6 relative z-10">
//                   <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors flex items-center">
//                     <Layers className="h-5 w-5 text-teal-400 mr-2" />
//                     {t("install.arch.title")}
//                   </h3>
//                   <p className="text-white/70 mb-4">{t("install.arch.description")}</p>
//                   <div className="bg-black/50 rounded-lg border border-white/10 p-4 font-mono text-sm overflow-x-auto">
//                     <div className="whitespace-pre">{t("terminal.arch.paru")}</div>
//                     <div className="whitespace-pre">{t("terminal.arch.paru.command")}</div>
//                     <div className="whitespace-pre"></div>
//                     <div className="whitespace-pre">{t("terminal.arch.yay")}</div>
//                     <div className="whitespace-pre">{t("terminal.arch.yay.command")}</div>
//                   </div>
//                   <Button variant="link" className="mt-4 text-teal-400 hover:text-teal-300 p-0 h-auto">
//                     <Link
//                       href="https://github.com/alvarorichard/GoAnime"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center"
//                     >
//                       {t("install.learnmore")}
//                       <ChevronRight className="ml-1 h-4 w-4" />
//                     </Link>
//                   </Button>
//                 </CardContent>
//               </Card>
//             </div>

//             <div
//               data-aos="fade-up"
//               data-aos-duration="800"
//               data-aos-delay="400"
//             >
//               <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
//                 <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 <CardContent className="p-6 relative z-10">
//                   <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors flex items-center">
//                     <Sparkles className="h-5 w-5 text-teal-400 mr-2" />
//                     {t("install.nixos.title")}
//                   </h3>
//                   <p className="text-white/70 mb-4">{t("install.nixos.description")}</p>
//                   <div className="bg-black/50 rounded-lg border border-white/10 p-4 font-mono text-sm overflow-x-auto">
//                     <div className="whitespace-pre">{t("terminal.nixos.comment")}</div>
//                     <div className="whitespace-pre">{t("terminal.nixos.command")}</div>
//                   </div>
//                   <Button variant="link" className="mt-4 text-teal-400 hover:text-teal-300 p-0 h-auto">
//                     <Link
//                       href="https://github.com/alvarorichard/GoAnime"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center"
//                     >
//                       {t("install.learnmore")}
//                       <ChevronRight className="ml-1 h-4 w-4" />
//                     </Link>
//                   </Button>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Usage Section */}
//       <section id="usage" className="py-20 md:py-32 relative">
//         <div className="container px-4 md:px-6 relative z-10">
//           <div className="text-center mb-16">
//             <div
//               data-aos="fade-up"
//               data-aos-duration="800"
//               className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-white/70 backdrop-blur border border-white/10 mb-4"
//             >
//               <span>{t("usage.badge")}</span>
//             </div>

//             <h2
//               data-aos="fade-up"
//               data-aos-duration="800"
//               data-aos-delay="100"
//               className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500"
//             >
//               {t("usage.title")}
//             </h2>

//             <p
//               data-aos="fade-up"
//               data-aos-duration="800"
//               data-aos-delay="200"
//               className="text-white/70 max-w-2xl mx-auto"
//             >
//               {t("usage.subtitle")}
//             </p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
//             <div
//               data-aos="fade-up"
//               data-aos-duration="800"
//               data-aos-delay="300"
//               className="order-2 lg:order-1"
//             >
//               <div className="space-y-6">
//                 <div className="flex gap-4">
//                   <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-bold">
//                     1
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold text-white mb-1">{t("usage.step1.title")}</h3>
//                     <p className="text-white/70">{t("usage.step1.description")}</p>
//                     <div className="mt-2 bg-black/50 rounded-lg border border-white/10 p-3 font-mono text-sm overflow-x-auto">
//                       <code className="text-teal-400">{t("terminal.usage.command")}</code>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex gap-4">
//                   <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-bold">
//                     2
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold text-white mb-1">{t("usage.step2.title")}</h3>
//                     <p className="text-white/70">{t("usage.step2.description")}</p>
//                     <div className="mt-2 bg-black/50 rounded-lg border border-white/10 p-3 font-mono text-sm overflow-x-auto">
//                       <code className="text-teal-400">{t("terminal.usage.search")}</code>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex gap-4">
//                   <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-bold">
//                     3
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold text-white mb-1">{t("usage.step3.title")}</h3>
//                     <p className="text-white/70">{t("usage.step3.description")}</p>
//                   </div>
//                 </div>

//                 <div className="flex gap-4">
//                   <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-bold">
//                     4
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold text-white mb-1">{t("usage.step4.title")}</h3>
//                     <p className="text-white/70">{t("usage.step4.description")}</p>
//                   </div>
//                 </div>

//                 <div className="flex gap-4">
//                   <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-bold">
//                     5
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold text-white mb-1">{t("usage.step5.title")}</h3>
//                     <p className="text-white/70">{t("usage.step5.description")}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div
//               data-aos="fade-up"
//               data-aos-duration="800"
//               data-aos-delay="400"
//               className="order-1 lg:order-2"
//             >
//               <div className="relative">
//                 {/* Animated border */}
//                 <div className="absolute inset-0 rounded-xl pointer-events-none z-10 animate-terminal-border" style={{
//                   background: "conic-gradient(from 0deg, #14b8a6, #a855f7, #ec4899, #14b8a6 100%)",
//                   maskImage: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
//                   WebkitMaskImage: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
//                   padding: 0,
//                   opacity: 0.7,
//                   filter: "blur(2px)",
//                 }} />
//                 <style>{`
//                   @keyframes terminal-border-flow {
//                     0% { filter: hue-rotate(0deg); }
//                     100% { filter: hue-rotate(360deg); }
//                   }
//                   .animate-terminal-border {
//                     animation: terminal-border-flow 3s linear infinite;
//                   }
//                 `}</style>
//                 {/* Inner black div with padding to reveal only the border animation */}
//                 <div className="relative rounded-xl bg-black p-1">
//                   <div className="relative bg-black rounded-lg overflow-hidden border border-white/10">
//                     <div className="h-8 w-full bg-gray-900/80 flex items-center px-4 gap-2">
//                       <div className="h-3 w-3 rounded-full bg-red-500"></div>
//                       <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
//                       <div className="h-3 w-3 rounded-full bg-green-500"></div>
//                       <div className="ml-4 text-xs text-white/70">demo</div>
//                     </div>
//                     <div className="p-4 font-mono text-sm min-h-[320px]">
//                       {typedLines.map((line, idx) => (
//                         <p key={idx} className={
//                           idx === 0 ? "text-gray-400" :
//                           idx === 1 || idx === 3 || idx === 8 ? "mt-2 text-teal-400" :
//                           idx === 2 || idx === 9 ? "mt-2 text-white" :
//                           idx === 4 || idx === 5 || idx === 6 ? "mt-2 text-white" :
//                           idx === 7 ? "mt-2 text-gray-400" :
//                           idx === 10 ? "mt-2 text-white" :
//                           ""
//                         }>
//                           {line}
//                           {typing && idx === typedLines.length - 1 && <span className="inline-block w-2 h-4 bg-white/70 animate-pulse align-middle ml-1" />}
//                         </p>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 md:py-32 relative">
//         <div className="absolute inset-0 z-0">
//           <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 to-purple-900/20"></div>
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20"></div>
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-teal-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20"></div>
//         </div>

//         <div className="container px-4 md:px-6 relative z-10">
//           <div
//             data-aos="fade-up"
//             data-aos-duration="800"
//             data-aos-delay="100"
//             className="max-w-3xl mx-auto text-center"
//           >
//             <div className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-white/70 backdrop-blur border border-white/10 mb-4">
//               <span>{t("cta.badge")}</span>
//             </div>

//             <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500">
//               {t("cta.title")}
//             </h2>

//             <p className="text-white/70 mb-8 text-lg">{t("cta.subtitle")}</p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button
//                 asChild
//                 size="lg"
//                 className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 border-0 h-12 px-8"
//               >
//                 <Link href="https://github.com/alvarorichard/GoAnime" target="_blank" rel="noopener noreferrer">
//                   <Github className="mr-2 h-5 w-5" />
//                   {t("hero.github")}
//                 </Link>
//               </Button>

//               <Button
//                 asChild
//                 variant="outline"
//                 size="lg"
//                 className="border-white/20 text-white hover:bg-white/10 h-12 px-8"
//               >
//                 <Link href="#installation">
//                   <Download className="mr-2 h-5 w-5" />
//                   {t("hero.install")}
//                 </Link>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-white/10 py-8 relative z-10">
//         <div className="container px-4 md:px-6">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <div className="flex items-center gap-2">
//               <Terminal className="h-5 w-5 text-teal-400" />
//               <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
//                 GoAnime
//               </span>
//             </div>

//             <p className="text-sm text-white/50">
//               {t("footer.developed")}{" "}
//               <Link
//                 href="https://github.com/alvarorichard"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-teal-400 hover:text-teal-300"
//               >
//                 alvarorichard
//               </Link>
//             </p>

//             <div className="flex items-center gap-4">
//               <Link
//                 href="https://github.com/alvarorichard/GoAnime"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-white/50 hover:text-white transition-colors"
//               >
//                 <Github className="h-5 w-5" />
//                 <span className="sr-only">GitHub</span>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }



"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Github, Terminal, Download, Play, Code, Sparkles, ChevronRight, Zap, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ParticleBackground from "@/components/particle-background"
import { CommandMenu } from "@/components/command-menu"
import Image from "next/image"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/contexts/language-context"

export default function Home() {
  const [showCommand, setShowCommand] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const { t } = useLanguage()
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])

  // Terminal typing animation state
  const terminalLines = [
    `$ ${t("terminal.demo.command")}`,
    t("terminal.demo.searching"),
    `${t("terminal.demo.found")} ${t("terminal.demo.anime")}`,
    t("terminal.demo.loading"),
    `1. ${t("terminal.demo.episode1")}`,
    `2. ${t("terminal.demo.episode2")}`,
    `3. ${t("terminal.demo.episode3")}`,
    `${t("terminal.demo.select")} 1`,
    t("terminal.demo.starting"),
    `${t("terminal.demo.playing")} ${t("terminal.demo.playing.ep")}`,
  ]
  const [typedLines, setTypedLines] = useState<string[]>([""])
  const [typing, setTyping] = useState(true)
  const lineRef = useRef(0)
  const charRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let cancelled = false
    lineRef.current = 0
    charRef.current = 0
    setTypedLines([""])
    setTyping(true)

    function typeNext() {
      if (cancelled) return

      if (lineRef.current >= terminalLines.length) {
        setTyping(false)
        return
      }

      const currentLine = terminalLines[lineRef.current].slice(0, charRef.current + 1)

      setTypedLines((prev) => {
        const newLines = [...prev]
        if (lineRef.current >= newLines.length) {
          newLines.push("")
        }
        newLines[lineRef.current] = currentLine
        return newLines
      })

      if (charRef.current < terminalLines[lineRef.current].length - 1) {
        charRef.current++
        timeoutRef.current = setTimeout(typeNext, 18)
      } else {
        charRef.current = 0
        lineRef.current++
        timeoutRef.current = setTimeout(typeNext, 350)
      }
    }

    timeoutRef.current = setTimeout(typeNext, 0)

    return () => {
      cancelled = true
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line
  }, [t])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setShowCommand((prev) => {
          return !prev
        })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    const handleMouseLeave = () => {
      setMousePos(null)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Mouse-following purple blur */}
      {mousePos && (
        <div
          style={{
            position: "fixed",
            left: mousePos.x - 200, // center the blur
            top: mousePos.y - 200,
            width: 400,
            height: 400,
            pointerEvents: "none",
            zIndex: 0,
            background:
              "radial-gradient(circle, rgba(168,85,247,0.35) 0%, rgba(168,85,247,0.15) 70%, transparent 100%)",
            filter: "blur(120px)",
            borderRadius: "50%",
            transition: "left 0.1s linear, top 0.1s linear",
          }}
        />
      )}

      <ParticleBackground />

      {/* Command Menu */}
      <AnimatePresence>
        {showCommand && (
          <CommandMenu
            onClose={() => {
              setShowCommand(false)
            }}
          />
        )}
      </AnimatePresence>

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
              {t("nav.features")}
            </Link>
            <Link href="#installation" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              {t("nav.installation")}
            </Link>
            <Link href="#usage" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              {t("nav.usage")}
            </Link>
            <Link href="/download" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              {t("nav.download")}
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex border-white/20 text-white/70 hover:text-white hover:border-white/50"
              onClick={() => {
                setShowCommand(true)
              }}
            >
              <span className="text-xs">{t("nav.press")}</span>
              <kbd className="pointer-events-none mx-1 inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-black px-1.5 font-mono text-[10px] font-medium text-white/70">
                <span className="text-xs">⌘/Ctrl</span>K
              </kbd>
            </Button>

            <Button
              asChild
              className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 border-0"
              size="sm"
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
              <div
                data-aos="fade-up"
                data-aos-duration="800"
                className="mb-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm backdrop-blur"
              >
                <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                <span>{t("hero.tagline")}</span>
              </div>

              <h1
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay="100"
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500"
              >
                GoAnime
              </h1>

              <p
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay="200"
                className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl"
              >
                {t("hero.description")}
              </p>

              <div
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay="300"
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 border-0 h-12 px-6"
                >
                  <Link href="https://github.com/alvarorichard/GoAnime" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    {t("hero.github")}
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 h-12 px-6"
                >
                  <Link href="/download" className="flex items-center">
                    <Download className="mr-2 h-5 w-5" />
                    {t("hero.install")}
                  </Link>
                </Button>
              </div>
            </div>

            <div
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-delay="400"
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
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent"></div>
      </section>

      {/* Star on GitHub CTA */}
      <section className="w-full flex justify-center mt-8">
        <a
          href="https://github.com/alvarorichard/GoAnime"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-purple-600 text-white font-semibold shadow-lg hover:from-teal-600 hover:to-purple-700 transition-colors"
        >
          <Github className="h-5 w-5" />
          {t("star.cta")}
        </a>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-20 md:py-32 relative">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <div
              data-aos="fade-up"
              data-aos-duration="800"
              className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-white/70 backdrop-blur border border-white/10 mb-4"
            >
              <span>{t("features.badge")}</span>
            </div>

            <h2
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="100"
              className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500"
            >
              {t("features.title")}
            </h2>

            <p
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="200"
              className="text-white/70 max-w-2xl mx-auto"
            >
              {t("features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
              <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br from-teal-500 to-purple-600">
                    <Terminal className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors">
                    {t("features.cli.title")}
                  </h3>
                  <p className="text-white/70">{t("features.cli.description")}</p>
                </CardContent>
              </Card>
            </div>

            <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
              <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br from-teal-500 to-purple-600">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors">
                    {t("features.playback.title")}
                  </h3>
                  <p className="text-white/70">{t("features.playback.description")}</p>
                </CardContent>
              </Card>
            </div>

            <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="300">
              <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br from-teal-500 to-purple-600">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors">
                    {t("features.fast.title")}
                  </h3>
                  <p className="text-white/70">{t("features.fast.description")}</p>
                </CardContent>
              </Card>
            </div>

            <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="400">
              <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br from-teal-500 to-purple-600">
                    <Layers className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors">
                    {t("features.sources.title")}
                  </h3>
                  <p className="text-white/70">{t("features.sources.description")}</p>
                </CardContent>
              </Card>
            </div>

            <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="500">
              <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br from-teal-500 to-purple-600">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors">
                    {t("features.opensource.title")}
                  </h3>
                  <p className="text-white/70">{t("features.opensource.description")}</p>
                </CardContent>
              </Card>
            </div>

            <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="600">
              <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br from-teal-500 to-purple-600">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors">
                    {t("features.download.title")}
                  </h3>
                  <p className="text-white/70">{t("features.download.description")}</p>
                </CardContent>
              </Card>
            </div>
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
            <div
              data-aos="fade-up"
              data-aos-duration="800"
              className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-white/70 backdrop-blur border border-white/10 mb-4"
            >
              <span>{t("install.badge")}</span>
            </div>

            <h2
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="100"
              className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500"
            >
              {t("install.title")}
            </h2>

            <p
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="200"
              className="text-white/70 max-w-2xl mx-auto"
            >
              {t("install.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
              <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-6 relative z-10">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors flex items-center">
                    <Terminal className="h-5 w-5 text-teal-400 mr-2" />
                    {t("install.universal.title")}
                  </h3>
                  <p className="text-white/70 mb-4">{t("install.universal.description")}</p>
                  <div className="bg-black/50 rounded-lg border border-white/10 p-4 font-mono text-sm overflow-x-auto">
                    <div className="whitespace-pre">{t("terminal.universal.command")}</div>
                  </div>
                  <Button variant="link" className="mt-4 text-teal-400 hover:text-teal-300 p-0 h-auto">
                    <Link
                      href="https://github.com/alvarorichard/GoAnime"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      {t("install.learnmore")}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
              <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-6 relative z-10">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors flex items-center">
                    <Code className="h-5 w-5 text-teal-400 mr-2" />
                    {t("install.manual.title")}
                  </h3>
                  <p className="text-white/70 mb-4">{t("install.manual.description")}</p>
                  <div className="bg-black/50 rounded-lg border border-white/10 p-4 font-mono text-sm overflow-x-auto">
                    <div className="whitespace-pre">{t("terminal.manual.clone")}</div>
                    <div className="whitespace-pre">{t("terminal.manual.cd")}</div>
                    <div className="whitespace-pre">{t("terminal.manual.install")}</div>
                  </div>
                  <Button variant="link" className="mt-4 text-teal-400 hover:text-teal-300 p-0 h-auto">
                    <Link
                      href="https://github.com/alvarorichard/GoAnime"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      {t("install.learnmore")}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="300">
              <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-6 relative z-10">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors flex items-center">
                    <Layers className="h-5 w-5 text-teal-400 mr-2" />
                    {t("install.arch.title")}
                  </h3>
                  <p className="text-white/70 mb-4">{t("install.arch.description")}</p>
                  <div className="bg-black/50 rounded-lg border border-white/10 p-4 font-mono text-sm overflow-x-auto">
                    <div className="whitespace-pre">{t("terminal.arch.paru")}</div>
                    <div className="whitespace-pre">{t("terminal.arch.paru.command")}</div>
                    <div className="whitespace-pre"></div>
                    <div className="whitespace-pre">{t("terminal.arch.yay")}</div>
                    <div className="whitespace-pre">{t("terminal.arch.yay.command")}</div>
                  </div>
                  <Button variant="link" className="mt-4 text-teal-400 hover:text-teal-300 p-0 h-auto">
                    <Link
                      href="https://github.com/alvarorichard/GoAnime"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      {t("install.learnmore")}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="400">
              <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-6 relative z-10">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors flex items-center">
                    <Sparkles className="h-5 w-5 text-teal-400 mr-2" />
                    {t("install.nixos.title")}
                  </h3>
                  <p className="text-white/70 mb-4">{t("install.nixos.description")}</p>
                  <div className="bg-black/50 rounded-lg border border-white/10 p-4 font-mono text-sm overflow-x-auto">
                    <div className="whitespace-pre">{t("terminal.nixos.comment")}</div>
                    <div className="whitespace-pre">{t("terminal.nixos.command")}</div>
                  </div>
                  <Button variant="link" className="mt-4 text-teal-400 hover:text-teal-300 p-0 h-auto">
                    <Link
                      href="https://github.com/alvarorichard/GoAnime"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      {t("install.learnmore")}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Section */}
      <section id="usage" className="py-20 md:py-32 relative">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <div
              data-aos="fade-up"
              data-aos-duration="800"
              className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-white/70 backdrop-blur border border-white/10 mb-4"
            >
              <span>{t("usage.badge")}</span>
            </div>

            <h2
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="100"
              className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500"
            >
              {t("usage.title")}
            </h2>

            <p
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="200"
              className="text-white/70 max-w-2xl mx-auto"
            >
              {t("usage.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="300" className="order-2 lg:order-1">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{t("usage.step1.title")}</h3>
                    <p className="text-white/70">{t("usage.step1.description")}</p>
                    <div className="mt-2 bg-black/50 rounded-lg border border-white/10 p-3 font-mono text-sm overflow-x-auto">
                      <code className="text-teal-400">{t("terminal.usage.command")}</code>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{t("usage.step2.title")}</h3>
                    <p className="text-white/70">{t("usage.step2.description")}</p>
                    <div className="mt-2 bg-black/50 rounded-lg border border-white/10 p-3 font-mono text-sm overflow-x-auto">
                      <code className="text-teal-400">{t("terminal.usage.search")}</code>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{t("usage.step3.title")}</h3>
                    <p className="text-white/70">{t("usage.step3.description")}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{t("usage.step4.title")}</h3>
                    <p className="text-white/70">{t("usage.step4.description")}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{t("usage.step5.title")}</h3>
                    <p className="text-white/70">{t("usage.step5.description")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="400" className="order-1 lg:order-2">
              <div className="terminal-wrapper">
                <div className="terminal-container">
                  <div className="terminal-header">
                    <div className="terminal-buttons">
                      <div className="terminal-button close"></div>
                      <div className="terminal-button minimize"></div>
                      <div className="terminal-button maximize"></div>
                    </div>
                    <div className="terminal-title">demo</div>
                  </div>
                  <div className="terminal-body">
                    {typedLines.map((line, idx) => (
                      <p
                        key={idx}
                        className={
                          idx === 0
                            ? "terminal-line command"
                            : idx === 1 || idx === 3 || idx === 8
                              ? "terminal-line system"
                              : idx === 2 || idx === 9
                                ? "terminal-line result"
                                : idx === 4 || idx === 5 || idx === 6
                                  ? "terminal-line list"
                                  : idx === 7
                                    ? "terminal-line input"
                                    : "terminal-line"
                        }
                      >
                        {line}
                        {typing && idx === typedLines.length - 1 && <span className="terminal-cursor" />}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <style jsx>{`
                .terminal-wrapper {
                  position: relative;
                  padding: 3px;
                  border-radius: 16px;
                  background: linear-gradient(90deg, #14b8a6, #a855f7, #ec4899);
                  background-size: 300% 300%;
                  animation: gradientRotate 3s linear infinite;
                  overflow: hidden;
                }

                .terminal-container {
                  background-color: #000;
                  border-radius: 14px;
                  overflow: hidden;
                  position: relative;
                  z-index: 1;
                }

                .terminal-header {
                  display: flex;
                  align-items: center;
                  padding: 10px 15px;
                  background-color: rgba(31, 41, 55, 0.8);
                  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .terminal-buttons {
                  display: flex;
                  gap: 8px;
                  margin-right: 15px;
                }

                .terminal-button {
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                }

                .close {
                  background-color: #ff5f56;
                }

                .minimize {
                  background-color: #ffbd2e;
                }

                .maximize {
                  background-color: #27c93f;
                }

                .terminal-title {
                  color: rgba(255, 255, 255, 0.7);
                  font-size: 12px;
                  flex-grow: 1;
                  text-align: center;
                }

                .terminal-body {
                  padding: 16px;
                  font-family: monospace;
                  font-size: 14px;
                  line-height: 1.5;
                  min-height: 320px;
                  background-color: #000;
                  color: #fff;
                }

                .terminal-line {
                  margin-top: 8px;
                  white-space: pre-wrap;
                  word-break: break-word;
                }

                .terminal-line:first-child {
                  margin-top: 0;
                }

                .terminal-line.command {
                  color: #aaa;
                }

                .terminal-line.system {
                  color: #14b8a6;
                }

                .terminal-line.result {
                  color: #fff;
                }

                .terminal-line.list {
                  color: #fff;
                }

                .terminal-line.input {
                  color: #aaa;
                }

                .terminal-cursor {
                  display: inline-block;
                  width: 8px;
                  height: 16px;
                  background-color: rgba(255, 255, 255, 0.7);
                  vertical-align: middle;
                  margin-left: 4px;
                  animation: blink 1s step-end infinite;
                }

                @keyframes blink {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0; }
                }

                @keyframes gradientRotate {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
              `}</style>
            </div>
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
          <div
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="100"
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-white/70 backdrop-blur border border-white/10 mb-4">
              <span>{t("cta.badge")}</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500">
              {t("cta.title")}
            </h2>

            <p className="text-white/70 mb-8 text-lg">{t("cta.subtitle")}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 border-0 h-12 px-8"
              >
                <Link href="https://github.com/alvarorichard/GoAnime" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  {t("hero.github")}
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
                  {t("hero.install")}
                </Link>
              </Button>
            </div>
          </div>
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
              {t("footer.developed")}{" "}
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
