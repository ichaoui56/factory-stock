"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

const workers = [
  { id: "#1", name: "أحمد محمد علي", dailyRate: 200, workType: "لافصو مهدي" },
  { id: "#2", name: "فاطمة أحمد حسن", dailyRate: 166.667, workType: "الفصالة" },
  { id: "#3", name: "محمد سالم القاسمي", dailyRate: 233.333, workType: "لافصو مهدي" },
]

type AttendanceStatus = "full" | "half" | "oneAndHalf" | "absent"

interface AttendanceRecord {
  workerId: string
  workerName: string
  workType: string
  date: string
  status: AttendanceStatus
  payment: number
}

interface DayAttendance {
  date: string
  records: AttendanceRecord[]
  totalPayment: number
  presentCount: number
  absentCount: number
}

function toLatinNumbers(str: string | number): string {
  const arabicToLatin: Record<string, string> = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٢": "7",
    "٨": "8",
    "٩": "9",
  }
  return String(str).replace(/[٠-٩]/g, (d) => arabicToLatin[d] || d)
}

function generateMockHistory(): AttendanceRecord[] {
  const records: AttendanceRecord[] = []
  const statuses: AttendanceStatus[] = ["full", "half", "oneAndHalf", "absent"]

  // Generate 30 days of history
  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    workers.forEach((worker) => {
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      let payment = 0

      switch (status) {
        case "full":
          payment = worker.dailyRate
          break
        case "half":
          payment = worker.dailyRate * 0.5
          break
        case "oneAndHalf":
          payment = worker.dailyRate * 1.5
          break
        case "absent":
          payment = 0
          break
      }

      records.push({
        workerId: worker.id,
        workerName: worker.name,
        workType: worker.workType,
        date: date.toISOString().split("T")[0],
        status,
        payment,
      })
    })
  }

  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function groupByDate(records: AttendanceRecord[]): DayAttendance[] {
  const grouped = new Map<string, AttendanceRecord[]>()

  records.forEach((record) => {
    if (!grouped.has(record.date)) {
      grouped.set(record.date, [])
    }
    grouped.get(record.date)!.push(record)
  })

  return Array.from(grouped.entries())
    .map(([date, dayRecords]) => ({
      date,
      records: dayRecords,
      totalPayment: dayRecords.reduce((sum, r) => sum + r.payment, 0),
      presentCount: dayRecords.filter((r) => r.status !== "absent").length,
      absentCount: dayRecords.filter((r) => r.status === "absent").length,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export default function AttendanceHistoryPage() {
  const [records] = useState<AttendanceRecord[]>(generateMockHistory())
  const [filteredDays, setFilteredDays] = useState<DayAttendance[]>([])

  const [selectedWorkType, setSelectedWorkType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  useEffect(() => {
    applyFilters()
  }, [])

  const applyFilters = () => {
    let filtered = records

    // Apply filters
    if (selectedWorkType !== "all") {
      filtered = filtered.filter((r) => r.workType === selectedWorkType)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((r) => r.status === selectedStatus)
    }

    if (startDate) {
      filtered = filtered.filter((r) => r.date >= startDate)
    }

    if (endDate) {
      filtered = filtered.filter((r) => r.date <= endDate)
    }

    if (selectedMonth && selectedMonth !== "all") {
      filtered = filtered.filter((r) => r.date.startsWith(selectedMonth))
    }

    // Group by date
    let grouped = groupByDate(filtered)

    // Apply sort order
    if (sortOrder === "oldest") {
      grouped = grouped.reverse()
    }

    setFilteredDays(grouped)
  }

  const resetFilters = () => {
    setSelectedWorkType("all")
    setSelectedStatus("all")
    setStartDate("")
    setEndDate("")
    setSearchQuery("")
    setSelectedMonth("all")
    setSortOrder("newest")
    setFilteredDays(groupByDate(records))
  }

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case "full":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs whitespace-nowrap">يوم كامل</Badge>
        )
      case "half":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs whitespace-nowrap">نصف يوم</Badge>
        )
      case "oneAndHalf":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs whitespace-nowrap">يوم ونصف</Badge>
      case "absent":
        return <Badge className="bg-red-100 text-red-700 border-red-200 text-xs whitespace-nowrap">غائب</Badge>
    }
  }

  const getMonthOptions = () => {
    const months = []
    for (let i = 0; i < 6; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStr = date.toISOString().slice(0, 7)
      months.push({
        value: monthStr,
        label: date.toLocaleDateString("ar-EG", { year: "numeric", month: "long" }),
      })
    }
    return months
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-balance">سجل الحضور</h1>
            <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">عرض سجل الحضور اليومي الكامل</p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2 md:pb-3">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Calendar className="h-4 w-4 md:h-5 md:w-5" />
              الفلاتر المتقدمة
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 md:pt-3">
            <div className="space-y-3 md:space-y-4">
              {/* Quick Filters Row */}
              <div className="grid gap-2 md:gap-3 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1 md:space-y-1.5">
                  <Label htmlFor="workType" className="text-xs md:text-sm font-medium">
                    نوع العمل
                  </Label>
                  <Select value={selectedWorkType} onValueChange={setSelectedWorkType}>
                    <SelectTrigger id="workType" className="h-8 md:h-9 text-xs md:text-sm">
                      <SelectValue placeholder="اختر نوع العمل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأعمال</SelectItem>
                      <SelectItem value="لافصو مهدي">لافصو مهدي</SelectItem>
                      <SelectItem value="الفصالة">الفصالة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 md:space-y-1.5">
                  <Label htmlFor="status" className="text-xs md:text-sm font-medium">
                    حالة الحضور
                  </Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger id="status" className="h-8 md:h-9 text-xs md:text-sm">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="full">يوم كامل</SelectItem>
                      <SelectItem value="half">نصف يوم</SelectItem>
                      <SelectItem value="oneAndHalf">يوم ونصف</SelectItem>
                      <SelectItem value="absent">غائب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 md:space-y-1.5">
                  <Label htmlFor="month" className="text-xs md:text-sm font-medium">
                    الشهر
                  </Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger id="month" className="h-8 md:h-9 text-xs md:text-sm">
                      <SelectValue placeholder="اختر الشهر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأشهر</SelectItem>
                      {getMonthOptions().map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 md:space-y-1.5">
                  <Label htmlFor="sort" className="text-xs md:text-sm font-medium">
                    الترتيب
                  </Label>
                  <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "newest" | "oldest")}>
                    <SelectTrigger id="sort" className="h-8 md:h-9 text-xs md:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">الأحدث أولاً</SelectItem>
                      <SelectItem value="oldest">الأقدم أولاً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date Range and Search Row */}
              <div className="grid gap-2 md:gap-3 md:grid-cols-3">
                <div className="space-y-1 md:space-y-1.5">
                  <Label htmlFor="search" className="text-xs md:text-sm font-medium">
                    بحث عن عامل
                  </Label>
                  <Input
                    id="search"
                    placeholder="اسم العامل أو الرقم..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 md:h-9 text-xs md:text-sm"
                  />
                </div>

                <div className="space-y-1 md:space-y-1.5">
                  <Label htmlFor="startDate" className="text-xs md:text-sm font-medium">
                    من تاريخ
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-8 md:h-9 text-xs md:text-sm"
                  />
                </div>

                <div className="space-y-1 md:space-y-1.5">
                  <Label htmlFor="endDate" className="text-xs md:text-sm font-medium">
                    إلى تاريخ
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-8 md:h-9 text-xs md:text-sm"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 md:gap-3 pt-1">
                <Button onClick={applyFilters} className="flex-1 h-8 md:h-9 text-xs md:text-sm">
                  تطبيق الفلاتر
                </Button>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="flex-1 h-8 md:h-9 text-xs md:text-sm bg-transparent"
                >
                  إعادة تعيين
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredDays.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">لا توجد سجلات حضور تطابق الفلاتر المحددة</p>
              </CardContent>
            </Card>
          ) : (
            filteredDays.map((day) => (
              <Card key={day.date}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {toLatinNumbers(
                          new Date(day.date).toLocaleDateString("ar-EG", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }),
                        )}
                      </CardTitle>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">الحاضرون:</span>
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          {toLatinNumbers(day.presentCount)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">الغائبون:</span>
                        <Badge className="bg-red-100 text-red-700 border-red-200">
                          {toLatinNumbers(day.absentCount)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">الإجمالي:</span>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                          {toLatinNumbers(day.totalPayment.toFixed(3))} ر.س
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-right p-2 md:p-3 font-bold text-xs md:text-sm whitespace-nowrap">
                            المبلغ
                          </th>
                          <th className="text-center p-2 md:p-3 font-bold text-xs md:text-sm whitespace-nowrap">
                            الحالة
                          </th>
                          <th className="text-right p-2 md:p-3 font-bold text-xs md:text-sm whitespace-nowrap">
                            نوع العمل
                          </th>
                          <th className="text-right p-2 md:p-3 font-bold text-xs md:text-sm whitespace-nowrap">
                            اسم العامل
                          </th>
                          <th className="text-right p-2 md:p-3 font-bold text-xs md:text-sm whitespace-nowrap">
                            رقم العامل
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {day.records.map((record, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="p-2 md:p-3 text-xs md:text-sm font-bold text-green-600 whitespace-nowrap">
                              {toLatinNumbers(record.payment.toFixed(3))} ر.س
                            </td>
                            <td className="p-2 md:p-3 text-center">{getStatusBadge(record.status)}</td>
                            <td className="p-2 md:p-3 text-xs md:text-sm whitespace-nowrap">
                              <Badge
                                className={
                                  record.workType === "لافصو مهدي"
                                    ? "bg-blue-100 text-blue-700 border-blue-200"
                                    : "bg-green-100 text-green-700 border-green-200"
                                }
                              >
                                {record.workType}
                              </Badge>
                            </td>
                            <td className="p-2 md:p-3 text-xs md:text-sm whitespace-nowrap">{record.workerName}</td>
                            <td className="p-2 md:p-3 text-xs md:text-sm font-medium whitespace-nowrap">
                              {toLatinNumbers(record.workerId)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
