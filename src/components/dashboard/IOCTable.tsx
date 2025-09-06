"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  ExternalLink,
  Copy,
  Eye,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { useIOCStore } from "@/store/iocStore"
import { IOC, SortOptions } from "@/types/ioc"
import { formatRelativeTime, getSeverityBadgeClass, cn } from "@/lib/utils"
import { showToast } from "@/components/ui/Toast"

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}

export function IOCTable() {
  const { 
    paginatedIOCs, 
    isLoading, 
    sort, 
    pagination, 
    updateSort, 
    updatePagination 
  } = useIOCStore()

  const [selectedIOC, setSelectedIOC] = useState<string | null>(null)

  const handleSort = (field: keyof IOC) => {
    const newDirection = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc'
    updateSort({ field, direction: newDirection })
  }

const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast({
      type: 'success',
      title: 'Copied to clipboard',
      description: `${text.length > 50 ? text.substring(0, 50) + '...' : text}`,
      duration: 2000
    })
  } catch (err) {
    showToast({
      type: 'error',
      title: 'Failed to copy',
      description: 'Please try again or copy manually',
      duration: 3000
    })
  }
}

  const getSortIcon = (field: keyof IOC) => {
    if (sort.field !== field) return <ArrowUpDown className="h-4 w-4" />
    return sort.direction === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ip': return '🌐'
      case 'subnet': return '🌍'
      case 'url': return '🔗'
      case 'domain': return '🏠'
      case 'hash': return '#️⃣'
      default: return '❓'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-muted-foreground">Loading threat intelligence data...</span>
        </CardContent>
      </Card>
    )
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Threat Indicators
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({pagination.total.toLocaleString()} total)
            </span>
          </CardTitle>
          
          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updatePagination({ page: pagination.page - 1 })}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updatePagination({ page: pagination.page + 1 })}
              disabled={pagination.page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <motion.table 
            className="w-full"
            variants={tableVariants}
            initial="hidden"
            animate="visible"
          >
            <thead className="border-b bg-muted/20">
              <tr>
                {/* Sortable Headers */}
                {[
                  { key: 'type', label: 'Type' },
                  { key: 'value', label: 'Value' },
                  { key: 'source', label: 'Source' },
                  { key: 'severity', label: 'Severity' },
                  { key: 'timestamp', label: 'Last Seen' },
                ].map((header) => (
                  <th
                    key={header.key}
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => handleSort(header.key as keyof IOC)}
                  >
                    <div className="flex items-center gap-2">
                      {header.label}
                      {getSortIcon(header.key as keyof IOC)}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border bg-background">
              {paginatedIOCs.map((ioc, index) => (
                <motion.tr
                  key={ioc.id}
                  variants={rowVariants}
                  className={cn(
                    "hover:bg-muted/5 transition-colors",
                    selectedIOC === ioc.id && "bg-muted/10"
                  )}
                  onClick={() => setSelectedIOC(selectedIOC === ioc.id ? null : ioc.id)}
                >
                  {/* Type */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTypeIcon(ioc.type)}</span>
                      <Badge variant="outline" className="text-xs">
                        {ioc.type.toUpperCase()}
                      </Badge>
                    </div>
                  </td>

                  {/* Value */}
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <code className="text-sm font-mono bg-muted/30 px-2 py-1 rounded break-all">
                        {ioc.value}
                      </code>
                      {ioc.description && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {ioc.description}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Source */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="secondary" className="text-xs">
                      {ioc.source}
                    </Badge>
                  </td>

                  {/* Severity */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ioc.severity ? (
                      <Badge 
                        variant={
                          ioc.severity === 'low' ? 'success' :
                          ioc.severity === 'medium' ? 'warning' :
                          ioc.severity === 'high' ? 'danger' : 'critical'
                        }
                        className="text-xs"
                      >
                        {ioc.severity.toUpperCase()}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unknown</span>
                    )}
                  </td>

                  {/* Timestamp */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {formatRelativeTime(ioc.timestamp)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopy(ioc.value)
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      
                      {ioc.type === 'url' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(ioc.value, '_blank')
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>

        {/* Empty State */}
        {paginatedIOCs.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Eye className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No indicators found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your filters or search criteria.
            </p>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updatePagination({ page: 1 })}
                disabled={pagination.page <= 1}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updatePagination({ page: pagination.page - 1 })}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updatePagination({ page: pagination.page + 1 })}
                disabled={pagination.page >= totalPages}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updatePagination({ page: totalPages })}
                disabled={pagination.page >= totalPages}
              >
                Last
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
