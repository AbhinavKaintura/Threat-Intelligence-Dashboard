"use client"

import { Shield, Settings, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ThemeToggle } from "./ThemeToggle"
import { Navigation } from "./Navigation"
import { useIOCStore } from "@/store/iocStore"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

export function Header() {
  const { refreshData, isLoading, lastFetch, stats } = useIOCStore()

  const handleRefresh = async () => {
    await refreshData()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">ThreatIntel</h1>
              <p className="text-xs text-muted-foreground">
                Security Dashboard
              </p>
            </div>
          </div>
          
          {/* Navigation */}
          <Navigation />
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="hidden lg:flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">Active:</span>
              <span className="font-medium">{stats.total.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-muted-foreground">Critical:</span>
              <span className="font-medium text-red-600">{stats.bySeverity.critical || 0}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="hidden sm:flex"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
          
          <ThemeToggle />
        </div>
      </div>
      
      {/* Status Bar */}
      {lastFetch && (
        <div className="border-t px-6 py-2 bg-muted/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Last updated: {new Date(lastFetch).toLocaleString()}
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                System Online
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
