import * as React from "react"
import { Link, useLocation } from "wouter"
import { cn } from "@/lib/utils"
import { Activity, ShieldAlert, TrainFront, Users, PersonStanding, Home, Menu } from "lucide-react"

const navItems = [
  { href: "/", label: "World Cup Fan Hub", icon: Home },
  { href: "/operations", label: "MetLife Command Center", icon: Activity },
  { href: "/volunteers", label: "Volunteer Hub", icon: Users },
  { href: "/transport", label: "Multi-modal Transport", icon: TrainFront },
  { href: "/alerts", label: "Live Alerts", icon: ShieldAlert },
  { href: "/accessibility", label: "Accessibility Services", icon: PersonStanding },
]

export function Sidebar() {
  const [location] = useLocation()

  return (
    <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0">
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
          SIQ
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-tight tracking-tight text-foreground">StadiumIQ AI</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">World Cup 2026</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="rounded-md bg-secondary/50 p-3 text-xs flex flex-col gap-1.5 border border-border/50">
          <span className="font-mono text-muted-foreground flex justify-between">
            <span>SYS_STATUS:</span> 
            <span className="text-green-500">ONLINE</span>
          </span>
          <span className="font-mono text-muted-foreground flex justify-between">
            <span>PING:</span> 
            <span>14ms</span>
          </span>
        </div>
      </div>
    </aside>
  )
}
