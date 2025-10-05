"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getRecentWorkersWithBalance } from "@/lib/actions/dashboard.actions"
import { toLatinNumbers } from "@/lib/utils"

interface WorkerBalance {
  id: string
  name: string
  workType: string
  balance: number
  totalEarned: number
  totalPaid: number
}

export function WorkersBalance() {
  const [workers, setWorkers] = useState<WorkerBalance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWorkers()
  }, [])

  const loadWorkers = async () => {
    try {
      const result = await getRecentWorkersWithBalance()
      if (result.success && result.data) {
        setWorkers(result.data)
      }
    } catch (error) {
      console.error("Error loading workers:", error)
    } finally {
      setLoading(false)
    }
  }

  const getWorkTypeLabel = (workType: string) => {
    switch (workType) {
      case "LAFSOW_MAHDI":
        return "لافصو مهدي"
      case "ALFASALA":
        return "الفصالة"
      default:
        return workType
    }
  }

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "text-green-600"
    if (balance < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getBalanceText = (balance: number) => {
    if (balance > 0) return "مدين"
    if (balance < 0) return "دائن"
    return "متوازن"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            أرصدة العمال
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-32"></div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
                <div className="h-6 bg-muted rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          أرصدة العمال
        </CardTitle>
      </CardHeader>
      <CardContent>
        {workers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>لا توجد بيانات للعرض</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workers.map((worker) => (
              <div key={worker.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{worker.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {getWorkTypeLabel(worker.workType)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>كسب: {toLatinNumbers(worker.totalEarned.toFixed(3))} د.م</span>
                    <span>دفع: {toLatinNumbers(worker.totalPaid.toFixed(3))} د.م</span>
                  </div>
                </div>
                <div className={`text-right ${getBalanceColor(worker.balance)}`}>
                  <div className="font-bold">{toLatinNumbers(Math.abs(worker.balance).toFixed(3))} د.م</div>
                  <div className="text-xs capitalize">{getBalanceText(worker.balance)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {workers.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">إجمالي الأرصدة:</span>
              <span className={`font-bold ${getBalanceColor(workers.reduce((sum, w) => sum + w.balance, 0))}`}>
                {toLatinNumbers(Math.abs(workers.reduce((sum, w) => sum + w.balance, 0)).toFixed(3))} د.م
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}