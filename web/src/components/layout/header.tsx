"use client"

import Link from "next/link"
import { Moon, Sun, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Sparkles className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Byteflow
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Generate
            </Link>
            <Link
              href="/edit"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Edit
            </Link>
            <Link
              href="/batch"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Batch
            </Link>
            <Link
              href="/history"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              History
            </Link>
            <Link
              href="/settings"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
