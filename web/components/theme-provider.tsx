"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { Theme } from "@astryxdesign/core/theme"
import { ToastViewport } from "@astryxdesign/core/Toast"
import { themes, defaultThemeSlug } from "../astryx-themes"

type ThemeMode = "light" | "dark"

interface ThemeContextType {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  setMode: () => {},
  toggleTheme: () => {},
})

export function useThemeMode() {
  return useContext(ThemeContext)
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("postarc-theme-mode") as ThemeMode | null
      if (saved === "light" || saved === "dark") return saved
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark"
    }
    return "light"
  })

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    try {
      localStorage.setItem("postarc-theme-mode", mode)
    } catch {
      // Ignore storage errors
    }
  }, [mode])

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"))
  }

  const activeTheme = themes[defaultThemeSlug] || themes.neutral

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleTheme }}>
      <Theme
        theme={activeTheme}
        mode={mode}
      >
        {children}
        <ToastViewport />
      </Theme>
    </ThemeContext.Provider>
  )
}
