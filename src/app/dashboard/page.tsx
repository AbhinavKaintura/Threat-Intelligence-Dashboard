"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/Header"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { FilterPanel } from "@/components/dashboard/FilterPanel"
import { IOCTable } from "@/components/dashboard/IOCTable"
import { useIOCStore } from "@/store/iocStore"

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
}

export default function DashboardPage() {
  const { refreshData, iocs } = useIOCStore()

  // Load initial data
  useEffect(() => {
    if (iocs.length === 0) {
      refreshData()
    }
  }, [])

  // console.log("Rendering DashboardPage with IOCs:", iocs)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <motion.main 
        className="container mx-auto px-6 py-8"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor and analyze threat intelligence indicators from multiple sources
            </p>
          </div>

          {/* Statistics Cards */}
          <StatsCards />

          {/* Filters */}
          <FilterPanel />

          {/* Main Data Table */}
          <IOCTable />
        </div>
      </motion.main>
    </div>
  )
}
