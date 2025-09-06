"use client"

import { motion } from "framer-motion"
import { TrendingUp, Shield, AlertTriangle, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useIOCStore } from "@/store/iocStore"
import { formatNumber } from "@/lib/utils"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function StatsCards() {
  const { stats, isLoading } = useIOCStore()

  if (!stats && !isLoading) return null

  const statCards = [
    {
      title: "Total Indicators",
      value: stats?.total || 0,
      change: "+12%",
      changeType: "positive" as const,
      icon: Shield,
      description: "All IOCs in database"
    },
    {
      title: "Critical Threats",
      value: stats?.bySeverity.critical || 0,
      change: "+3",
      changeType: "negative" as const,
      icon: AlertTriangle,
      description: "Requires immediate attention"
    },
    {
      title: "Active Sources",
      value: Object.values(stats?.bySource || {}).filter(count => count > 0).length,
      change: "3/3",
      changeType: "neutral" as const,
      icon: Activity,
      description: "Feeds currently active"
    },
    {
      title: "24h Activity",
      value: stats?.recentActivity.last24h || 0,
      change: "+8%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "New indicators today"
    }
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {statCards.map((stat, index) => (
        <motion.div key={stat.title} variants={cardVariants}>
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  formatNumber(stat.value)
                )}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {stat.description}
                </span>
                <span className={`font-medium ${
                  stat.changeType === 'positive' ? 'text-emerald-600' :
                  stat.changeType === 'negative' ? 'text-red-600' :
                  'text-muted-foreground'
                }`}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
            
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <stat.icon className="w-full h-full" />
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
