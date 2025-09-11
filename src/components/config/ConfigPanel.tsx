"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Clock, Bell, Database, Palette, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

interface ConfigPanelProps {
  onSave?: (config: any) => void
}

export function ConfigPanel({ onSave }: ConfigPanelProps) {
  const [config, setConfig] = useState({
    refreshInterval: 5,
    autoRefresh: true,
    itemsPerPage: 25,
    enableNotifications: true,
    theme: 'system' as 'light' | 'dark' | 'system'
  })
  
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    onSave?.(config)
    setIsSaving(false)
  }

  const configSections = [
    {
      title: "Data Refresh",
      icon: Clock,
      items: [
        {
          label: "Auto Refresh",
          type: "toggle" as const,
          value: config.autoRefresh,
          onChange: (value: boolean) => setConfig(prev => ({ ...prev, autoRefresh: value }))
        },
        {
          label: "Refresh Interval (minutes)",
          type: "number" as const,
          value: config.refreshInterval,
          onChange: (value: number) => setConfig(prev => ({ ...prev, refreshInterval: value }))
        }
      ]
    },
    {
      title: "Display Settings",
      icon: Database,
      items: [
        {
          label: "Items per page",
          type: "select" as const,
          value: config.itemsPerPage,
          options: [10, 25, 50, 100],
          onChange: (value: number) => setConfig(prev => ({ ...prev, itemsPerPage: value }))
        }
      ]
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        {
          label: "Enable Notifications",
          type: "toggle" as const,
          value: config.enableNotifications,
          onChange: (value: boolean) => setConfig(prev => ({ ...prev, enableNotifications: value }))
        }
      ]
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configuration</h2>
          <p className="text-muted-foreground">
            Customize your threat intelligence dashboard settings
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      {configSections.map((section, index) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <section.icon className="h-5 w-5" />
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center justify-between">
                <label className="text-sm font-medium">{item.label}</label>
                {item.type === 'toggle' && (
                  <Button
                    variant={item.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => item.onChange(!item.value)}
                  >
                    {item.value ? "Enabled" : "Disabled"}
                  </Button>
                )}
                {item.type === 'number' && (
                  <Input
                    type="number"
                    value={item.value}
                    onChange={(e) => item.onChange(parseInt(e.target.value))}
                    className="w-24"
                  />
                )}
                {item.type === 'select' && (
                  <div className="flex gap-2">
                    {item.options?.map((option) => (
                      <Button
                        key={option}
                        variant={item.value === option ? "default" : "outline"}
                        size="sm"
                        onClick={() => item.onChange(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </motion.div>
  )
}
