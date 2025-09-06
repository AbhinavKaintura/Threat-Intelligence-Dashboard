"use client"

import { Header } from "@/components/layout/Header"
import { ConfigPanel } from "@/components/config/ConfigPanel"

export default function ConfigPage() {
  const handleConfigSave = (config: any) => {
    console.log('Saving config:', config)
    // Here you would typically save to your backend or localStorage
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <ConfigPanel onSave={handleConfigSave} />
      </main>
    </div>
  )
}
