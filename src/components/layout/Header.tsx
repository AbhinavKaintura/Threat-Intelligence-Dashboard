"use client"

import { Shield, Settings, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ThemeToggle } from "./ThemeToggle"
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
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Threat Intelligence</h1>
            <p className="text-xs text-muted-foreground">
              Security Operations Dashboard
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="hidden md:flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-muted-foreground">Total IOCs:</span>
              <span className="font-medium">{stats.total.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-muted-foreground">Last 24h:</span>
              <span className="font-medium">{stats.recentActivity.last24h}</span>
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
          
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
          
          <ThemeToggle />
        </div>
      </div>
      
      {/* Last Updated */}
      {lastFetch && (
        <div className="border-t px-6 py-2">
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(lastFetch).toLocaleString()}
          </p>
        </div>
      )}
    </header>
  )
}
