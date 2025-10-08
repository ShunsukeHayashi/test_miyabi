"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Image, Wand2, Grid3x3, History, Settings, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const navigationItems = [
  {
    title: "Generate",
    href: "/",
    icon: Wand2,
    description: "Text-to-Image generation"
  },
  {
    title: "Edit",
    href: "/edit",
    icon: Image,
    description: "Image-to-Image editing"
  },
  {
    title: "Batch",
    href: "/batch",
    icon: Grid3x3,
    description: "Bulk generation"
  },
  {
    title: "History",
    href: "/history",
    icon: History,
    description: "View generations"
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Configure defaults"
  }
]

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 border-r bg-background transition-transform duration-300 lg:translate-x-0 lg:static lg:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="text-lg font-bold">Byteflow</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <Separator className="lg:hidden" />

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <div className="mb-4 hidden lg:block">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Quick Access
              </h2>
            </div>
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item.title}</div>
                    <div className={cn(
                      "text-xs truncate",
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              )
            })}
          </nav>

          <Separator />

          {/* Footer info */}
          <div className="p-4 text-xs text-muted-foreground">
            <p>Powered by BytePlus AI</p>
            <p className="mt-1">SEEDREAM 4.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}
