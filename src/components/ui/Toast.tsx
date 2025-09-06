"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle, X } from "lucide-react"
import { Button } from "./Button"

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  description?: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastComponent({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id)
      }, toast.duration || 5000)
      
      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onRemove])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: AlertCircle
  }

  const colors = {
    success: "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100",
    error: "border-red-500 bg-red-50 text-red-900 dark:bg-red-900 dark:text-red-100",
    info: "border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
  }

  const Icon = icons[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`
        relative flex w-full items-center gap-3 rounded-lg border p-4 shadow-lg
        ${colors[toast.type]}
      `}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      
      <div className="flex-1">
        <h4 className="font-medium">{toast.title}</h4>
        {toast.description && (
          <p className="text-sm opacity-90">{toast.description}</p>
        )}
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(toast.id)}
        className="h-8 w-8 p-0 hover:bg-black/10"
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Global toast function (you would typically use a context for this)
  useEffect(() => {
    const handleToast = (event: CustomEvent<Toast>) => {
      setToasts(prev => [...prev, event.detail])
    }

    window.addEventListener('toast' as any, handleToast)
    return () => window.removeEventListener('toast' as any, handleToast)
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Helper function to trigger toasts
export const showToast = (toast: Omit<Toast, 'id'>) => {
  const event = new CustomEvent('toast', {
    detail: { ...toast, id: Date.now().toString() }
  })
  window.dispatchEvent(event)
}
