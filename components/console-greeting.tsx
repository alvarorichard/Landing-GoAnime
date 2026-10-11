"use client"

import { useEffect } from "react"
import { links } from "@/lib/links"

// The GoAnime mark in ASCII, generated from public/brand/goanime-mark.png at
// 40 columns (each character covers a 1:2 cell, brightness picks the glyph).
const MARK = `
                 ::.
                  -===-#*+-
                 :+====-%@@%*-.
             :-:-%#.====+@@@@@%+.
          .-+*+*%%: -===-%@@@@@@%=
         :#%@@@@#::+:====+@@@@@@@@#.
      .=*%@@@@@@%+=..=====@@@@@@@@@#.
     +%%#%@@@@%@#-  .====+@@@@@@@@@@*
    .#@%@@*+++#@@@%-:====*@@@@@@@@@@@:
  :+#@@@%*==*%@@@@@@#====%@@@@@@@@@@@=
  =%%%#*-:-#@@@@@@@@@#==+@@@@@@@@@@@@+
  ..  :     +@@@@@@@@@*+%@@@@@@@@@@@@-
             #@@@@@@@@%%@@@@@@@@@@@@#
             #@@@@@@@@@@@@@@@@@%@@@%:
           .*@@@@@@@@##@@@@@@@%#@@%-
          -%@@@@@@%*::@@@@@@@%+%@#.
         =@@@@@%*-. :%@@@%@@+=%%-
        :%#*+-:    +%@%+*%+-**-
                .=%#+:=*=.:-.
               :-:  .:.`

let greeted = false

// Greets whoever opens the browser console, the visitors most likely to
// contribute, once per page load.
export function ConsoleGreeting() {
  useEffect(() => {
    if (greeted) return
    greeted = true
    console.log(
      `%c${MARK}\n\n%cGoAnime é código aberto. Quer ajudar? ${links.devGuide}\nGoAnime is open source. Want to help? ${links.devGuide}`,
      "color: #ff5c6c; font-family: monospace; line-height: 1.15",
      "font-size: 13px; line-height: 1.6",
    )
  }, [])

  return null
}
