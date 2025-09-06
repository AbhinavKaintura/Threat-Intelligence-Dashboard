"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, X, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useIOCStore } from "@/store/iocStore"
import { debounce } from "@/lib/utils"

const typeOptions = [
  { value: 'ip', label: 'IP Address', count: 0 },
  { value: 'subnet', label: 'Subnet', count: 0 },
  { value: 'url', label: 'URL', count: 0 },
  { value: 'domain', label: 'Domain', count: 0 },
  { value: 'hash', label: 'Hash', count: 0 }
]

const sourceOptions = [
  { value: 'blocklist.de', label: 'Blocklist.de', count: 0 },
  { value: 'spamhaus', label: 'Spamhaus', count: 0 },
  { value: 'digitalside', label: 'Digitalside', count: 0 },
  { value: 'custom', label: 'Custom', count: 0 }
]

const severityOptions = [
  { value: 'low', label: 'Low', color: 'success' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'high', label: 'High', color: 'danger' },
  { value: 'critical', label: 'Critical', color: 'critical' }
]

export function FilterPanel() {
  const { filters, stats, updateFilters, clearFilters } = useIOCStore()
  const [isExpanded, setIsExpanded] = useState(false)

  // Update counts from stats
  const updatedTypeOptions = typeOptions.map(option => ({
    ...option,
    count: stats?.byType[option.value as keyof typeof stats.byType] || 0
  }))

  const updatedSourceOptions = sourceOptions.map(option => ({
    ...option,
    count: stats?.bySource[option.value as keyof typeof stats.bySource] || 0
  }))

  // Debounced search handler
  const handleSearchChange = debounce((value: string) => {
    updateFilters({ search: value })
  }, 300)

  const handleTypeToggle = (type: string) => {
    const currentTypes = filters.types || []
    const newTypes = currentTypes.includes(type as any)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type as any]
    updateFilters({ types: newTypes })
  }

  const handleSourceToggle = (source: string) => {
    const currentSources = filters.sources || []
    const newSources = currentSources.includes(source as any)
      ? currentSources.filter(s => s !== source)
      : [...currentSources, source as any]
    updateFilters({ sources: newSources })
  }

  const handleSeverityToggle = (severity: string) => {
    const currentSeverities = filters.severities || []
    const newSeverities = currentSeverities.includes(severity as any)
      ? currentSeverities.filter(s => s !== severity)
      : [...currentSeverities, severity as any]
    updateFilters({ severities: newSeverities })
  }

  const activeFiltersCount = (filters.types?.length || 0) + 
                           (filters.sources?.length || 0) + 
                           (filters.severities?.length || 0) +
                           (filters.search ? 1 : 0)

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search IOCs by value, description, or tags..."
            className="pl-10"
            defaultValue={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* Quick Filters - Always Visible */}
        <div className="flex flex-wrap gap-2">
          {updatedTypeOptions.slice(0, 3).map((option) => (
            <Button
              key={option.value}
              variant={filters.types?.includes(option.value as any) ? "default" : "outline"}
              size="sm"
              onClick={() => handleTypeToggle(option.value)}
              className="text-xs"
            >
              {option.label}
              <Badge variant="secondary" className="ml-2">
                {option.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Advanced Filters - Expandable */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 overflow-hidden"
            >
              {/* Type Filters */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                <div className="flex flex-wrap gap-2">
                  {updatedTypeOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.types?.includes(option.value as any) ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleTypeToggle(option.value)}
                      className="justify-between min-w-[100px]"
                    >
                      <span>{option.label}</span>
                      <Badge variant="outline" className="ml-2">
                        {option.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Source Filters */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Source</h4>
                <div className="flex flex-wrap gap-2">
                  {updatedSourceOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.sources?.includes(option.value as any) ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleSourceToggle(option.value)}
                      className="justify-between min-w-[120px]"
                    >
                      <span>{option.label}</span>
                      <Badge variant="outline" className="ml-2">
                        {option.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Severity Filters */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Severity</h4>
                <div className="flex flex-wrap gap-2">
                  {severityOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.severities?.includes(option.value as any) ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleSeverityToggle(option.value)}
                      className="justify-between min-w-[100px]"
                    >
                      <span>{option.label}</span>
                      <div className={`w-2 h-2 rounded-full ml-2 ${
                        option.color === 'success' ? 'bg-emerald-500' :
                        option.color === 'warning' ? 'bg-amber-500' :
                        option.color === 'danger' ? 'bg-red-500' :
                        'bg-red-600'
                      }`} />
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
