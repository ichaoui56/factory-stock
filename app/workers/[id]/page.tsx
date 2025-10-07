"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RecordPaymentDialog } from "@/components/record-payment-dialog"
import { EditWorkerDialog } from "@/components/edit-worker-dialog"
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Calendar, Clock, CheckCircle, XCircle, MinusCircle, ArrowUp, ArrowDown, Check } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getWorkerById, getWorkerBalance, getWorkerAttendance, getWorkerPayments } from "@/lib/actions/worker.actions"
import type { Worker, WeeklyAttendance, Payment, AttendanceType, PaymentType, WorkType } from "@prisma/client"
import { toast } from "sonner"
import { EditPaymentDialog } from "@/components/EditPaymentDialog"

function toLatinNumbers(str: string | number): string {
  const arabicToLatin: Record<string, string> = {
    "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
    "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
  }
  return String(str).replace(/[٠-٩]/g, (d) => arabicToLatin[d] || d)
}

function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) {
    return "غير محدد"
  }

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) {
    return "تاريخ غير صالح"
  }

  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ]
  return `${toLatinNumbers(date.getDate())} ${months[date.getMonth()]} ${toLatinNumbers(date.getFullYear())}`
}

// Convert weekly attendance to daily records for display
interface DailyAttendance {
  id: string
  date: string
  dayName: string
  type: AttendanceType
  earned: number
  weekNumber: string
  year: number
}

// Convert weekly attendance to daily records for display - ONLY show marked days
interface DailyAttendance {
  id: string
  date: string
  dayName: string
  type: AttendanceType
  earned: number
  weekNumber: string
  year: number
}

// Convert weekly attendance to daily records for display - FIXED VERSION
function convertToDailyAttendance(weeklyAttendances: WeeklyAttendance[], dailyRate: number): DailyAttendance[] {
  const dailyRecords: DailyAttendance[] = []

  const dayNames = ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]

  weeklyAttendances.forEach((attendance) => {
    const days = [
      { type: attendance.monday, dayName: dayNames[0], field: 'monday' },
      { type: attendance.tuesday, dayName: dayNames[1], field: 'tuesday' },
      { type: attendance.wednesday, dayName: dayNames[2], field: 'wednesday' },
      { type: attendance.thursday, dayName: dayNames[3], field: 'thursday' },
      { type: attendance.friday, dayName: dayNames[4], field: 'friday' },
      { type: attendance.saturday, dayName: dayNames[5], field: 'saturday' },
    ]

    // Get the actual Monday date for this week based on week number and year
    const mondayDate = getMondayDateFromWeekNumber(attendance.weekNumber, attendance.year)
    
    days.forEach((day, index) => {
      // Skip unrecorded days (null or undefined)
      if (day.type === null || day.type === undefined) {
        return
      }

      let earned = 0
      switch (day.type) {
        case "FULL_DAY":
          earned = dailyRate
          break
        case "DAY_AND_NIGHT":
          earned = dailyRate * 1.5
          break
        case "HALF_DAY":
          earned = dailyRate * 0.5
          break
        case "ABSENCE":
          earned = 0
          break
      }

      // Calculate date for this day starting from Monday
      const dayDate = new Date(mondayDate)
      dayDate.setDate(mondayDate.getDate() + index)

      dailyRecords.push({
        id: `${attendance.id}-${day.field}`,
        date: dayDate.toISOString(),
        dayName: day.dayName,
        type: day.type,
        earned,
        weekNumber: attendance.weekNumber,
        year: attendance.year
      })
    })
  })

  // Sort by date descending (newest first)
  return dailyRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Helper function to get Monday date from week number and year
function getMondayDateFromWeekNumber(weekNumber: string, year: number): Date {
  // Extract week number from string like "W39"
  const weekNo = parseInt(weekNumber.replace('W', ''))
  
  // Create a date for January 1st of the year
  const janFirst = new Date(year, 0, 1)
  
  // Calculate the day of week for January 1st (0 = Sunday, 1 = Monday, etc.)
  const janFirstDay = janFirst.getDay()
  
  // Calculate the first Monday of the year
  let firstMonday: Date
  if (janFirstDay <= 1) {
    // If Jan 1 is Sunday (0) or Monday (1)
    firstMonday = new Date(year, 0, 1 + (1 - janFirstDay))
  } else {
    // If Jan 1 is Tuesday-Saturday
    firstMonday = new Date(year, 0, 1 + (8 - janFirstDay))
  }
  
  // Calculate the Monday of the target week
  const targetMonday = new Date(firstMonday)
  targetMonday.setDate(firstMonday.getDate() + (weekNo - 1) * 7)
  
  return targetMonday
}

// Get icon for attendance type
function getAttendanceIcon(type: AttendanceType) {
  switch (type) {
    case "FULL_DAY":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "DAY_AND_NIGHT":
      return <CheckCircle className="h-4 w-4 text-blue-600" />
    case "HALF_DAY":
      return <MinusCircle className="h-4 w-4 text-yellow-600" />
    case "ABSENCE":
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <MinusCircle className="h-4 w-4 text-gray-400" />
  }
}

export default function WorkerDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [worker, setWorker] = useState<Worker | null>(null)
  const [balance, setBalance] = useState(0)
  const [totalEarned, setTotalEarned] = useState(0)
  const [totalPaid, setTotalPaid] = useState(0)
  const [attendanceHistory, setAttendanceHistory] = useState<WeeklyAttendance[]>([])
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const workerResult = await getWorkerById(id)
      if (workerResult.success && workerResult.data) {
        setWorker(workerResult.data)
      } else {
        throw new Error(workerResult.error || "Worker not found")
      }

      const balanceResult = await getWorkerBalance(id)
      if (balanceResult.success && balanceResult.data) {
        setBalance(balanceResult.data.balance)
        setTotalEarned(balanceResult.data.totalEarned)
        setTotalPaid(balanceResult.data.totalPaid)
      } else {
        toast.error(balanceResult.error || "Failed to fetch balance")
      }

      const attendanceResult = await getWorkerAttendance(id)
      if (attendanceResult.success && attendanceResult.data) {
        setAttendanceHistory(attendanceResult.data)
      } else {
        toast.error(attendanceResult.error || "Failed to fetch attendance history")
      }

      const paymentResult = await getWorkerPayments(id)
      if (paymentResult.success && paymentResult.data) {
        setPaymentHistory(paymentResult.data)
      } else {
        toast.error(paymentResult.error || "Failed to fetch payment history")
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast.error(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const getWorkTypeLabel = (workType: WorkType) => {
    switch (workType) {
      case "LAFSOW_MAHDI": return "لافصو مهدي"
      case "ALFASALA": return "الفصالة"
      default: return workType
    }
  }

  const getAttendanceStatusLabel = (status: AttendanceType) => {
    switch (status) {
      case "FULL_DAY": return "يوم كامل"
      case "HALF_DAY": return "نصف يوم"
      case "DAY_AND_NIGHT": return "يوم ونصف"
      case "ABSENCE": return "غائب"
      default: return status
    }
  }

  const getAttendanceBadgeVariant = (status: AttendanceType) => {
    switch (status) {
      case "FULL_DAY": return "default"
      case "HALF_DAY": return "secondary"
      case "DAY_AND_NIGHT": return "default"
      case "ABSENCE": return "destructive"
      default: return "outline"
    }
  }

  const getPaymentTypeLabel = (type: PaymentType) => {
    switch (type) {
      case "DAILY": return "دفعة يومية"
      case "WEEKLY": return "راتب أسبوعي"
      case "PARTIAL": return "دفعة جزئية"
      default: return type
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <Link href="/workers">
            <Button>العودة إلى قائمة العمال</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  if (!worker) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">العامل غير موجود</h1>
          <Link href="/workers">
            <Button>العودة إلى قائمة العمال</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const dailyRate = worker.weeklyPayment / 6
  const dailyAttendance = convertToDailyAttendance(attendanceHistory, dailyRate)

  // Calculate attendance statistics
  // Calculate attendance statistics - ONLY for marked days
  const markedAttendance = dailyAttendance.filter(day => day.type !== null && day.type !== undefined)
  const totalDays = markedAttendance.length
  const presentDays = markedAttendance.filter(day => day.type !== "ABSENCE").length
  const absenceDays = markedAttendance.filter(day => day.type === "ABSENCE").length
  const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/workers">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{worker.fullName}</h1>
              <p className="text-muted-foreground mt-1">رقم العامل: {toLatinNumbers(worker.id)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <EditWorkerDialog worker={worker} onWorkerUpdated={fetchData} />
            <RecordPaymentDialog workerId={worker.id} workerName={worker.fullName} currentBalance={balance} onPaymentRecorded={fetchData} />
          </div>
        </div>

        {/* Worker Info Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1"> شحال خاصو يتخلص </p>
                  <p className="text-2xl font-bold text-primary">{toLatinNumbers(totalEarned.toFixed(2))} .د.م</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1"> شحال تخلص </p>
                  <p className="text-2xl font-bold text-green-600">{toLatinNumbers(totalPaid.toFixed(2))} .د.م</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`
            h-2 w-2 rounded-full
            ${Math.abs(balance) > 0.01 ? (balance > 0 ? 'bg-orange-500' : 'bg-green-500') : 'bg-gray-400'}
          `} />
                    <span className={`
            text-sm font-medium
            ${Math.abs(balance) > 0.01 ? (balance > 0 ? 'text-orange-600' : 'text-green-600') : 'text-gray-600'}
          `}>
                      {Math.abs(balance) > 0.01 ?
                        (balance > 0 ? 'كيتسال' : 'زايدو في لخلاص ') :
                        'مخلص في كلشي '}
                    </span>
                  </div>

                  {/* Amount */}
                  <p className={`
          text-2xl md:text-3xl font-bold mb-1
          ${Math.abs(balance) > 0.01 ? (balance > 0 ? 'text-orange-600' : 'text-green-600') : 'text-gray-600'}
        `}>
                    {toLatinNumbers(Math.abs(balance).toFixed(2))} .د.م
                  </p>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground">
                    {Math.abs(balance) > 0.01 ?
                      (balance > 0 ? 'مبلغ مستحق للعامل' : 'مبلغ مدفوع زيادة') :
                      'لا يوجد رصيد'}
                  </p>
                </div>

                {/* Visual Icon */}
                <div className={`
        h-12 w-12 rounded-lg flex items-center justify-center
        ${Math.abs(balance) > 0.01 ? (balance > 0 ? 'bg-orange-500/10' : 'bg-green-500/10') : 'bg-gray-500/10'}
      `}>
                  {Math.abs(balance) > 0.01 ? (
                    balance > 0 ? (
                      <ArrowUp className="h-5 w-5 text-orange-600" />
                    ) : (
                      <ArrowDown className="h-5 w-5 text-green-600" />
                    )
                  ) : (
                    <Check className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">الأجر اليومي</p>
                  <p className="text-2xl font-bold">{toLatinNumbers(dailyRate.toFixed(2))} .د.م</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Worker Details */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات العامل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">نوع العمل</span>
                <Badge
                  variant="outline"
                  className={
                    worker.workType === "LAFSOW_MAHDI"
                      ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                      : worker.workType === "ALFASALA"
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : "bg-purple-500/10 text-purple-600 border-purple-500/20"
                  }
                >
                  {getWorkTypeLabel(worker.workType)}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">الحالة</span>
                <Badge
                  variant="outline"
                  className={
                    worker.isActive
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }
                >
                  {worker.isActive ? "نشط" : "غير نشط"}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">الراتب الأسبوعي</span>
                <span className="font-bold">{toLatinNumbers(worker.weeklyPayment.toFixed(2))} .د.م</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">رقم الهاتف</span>
                <span className="font-bold">{toLatinNumbers(worker.phoneNumber)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">تاريخ الانضمام</span>
                <span className="font-bold">{formatDate(worker.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">آخر تحديث</span>
                <span className="font-bold">{formatDate(worker.updatedAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History Tabs */}
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attendance">سجل الحضور اليومي</TabsTrigger>
            <TabsTrigger value="payments">سجل المدفوعات</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>سجل الحضور اليومي</CardTitle>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>أيام كاملة: {markedAttendance.filter(d => d.type === "FULL_DAY").length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>يوم ونصف: {markedAttendance.filter(d => d.type === "DAY_AND_NIGHT").length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MinusCircle className="h-4 w-4 text-yellow-600" />
                      <span>أنصاف أيام: {markedAttendance.filter(d => d.type === "HALF_DAY").length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>غياب: {absenceDays}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">الحالة</TableHead>
                        <TableHead className="text-left">الأجر المستحق</TableHead>
                        <TableHead className="text-left">اليوم</TableHead>
                        <TableHead className="text-left">التاريخ</TableHead>
                        <TableHead className="text-left">الأسبوع</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {markedAttendance.length > 0 ? (
                        markedAttendance.map((record) => (
                          <TableRow key={record.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center justify-start gap-2">
                                <Badge
                                  variant={getAttendanceBadgeVariant(record.type)}
                                  className="flex items-center gap-1 min-w-[100px] justify-center"
                                >
                                  {getAttendanceIcon(record.type)}
                                  {getAttendanceStatusLabel(record.type)}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="font-bold text-primary text-lg">
                              {toLatinNumbers(record.earned.toFixed(2))} .د.م
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="text-left">
                                <div className="font-semibold">{record.dayName}</div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center justify-start gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {formatDate(record.date)}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              الأسبوع {record.weekNumber} - {record.year}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-12">
                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                              <Calendar className="h-12 w-12 opacity-50" />
                              <p className="text-lg">لا توجد سجلات حضور</p>
                              <p className="text-sm">سيظهر سجل الحضور هنا عند تسجيل الحضور</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>سجل المدفوعات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">الإجراءات</TableHead>
                        <TableHead className="text-left">ملاحظات</TableHead>
                        <TableHead className="text-left">النوع</TableHead>
                        <TableHead className="text-left">المبلغ</TableHead>
                        <TableHead className="text-left">الأسبوع</TableHead>
                        <TableHead className="text-left">التاريخ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentHistory.length > 0 ? (
                        paymentHistory.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>
                              <EditPaymentDialog
                                payment={payment}
                                workerName={worker.fullName}
                                onPaymentUpdated={fetchData}
                              />
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {payment.note ? (
                                <div className="max-w-[200px] truncate" title={payment.note}>
                                  {payment.note}
                                </div>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  payment.paymentType === "WEEKLY"
                                    ? "bg-blue-100 text-blue-700 border-blue-200"
                                    : payment.paymentType === "DAILY"
                                      ? "bg-green-100 text-green-700 border-green-200"
                                      : "bg-purple-100 text-purple-700 border-purple-200"
                                }
                              >
                                {getPaymentTypeLabel(payment.paymentType)}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-bold text-green-600 text-lg">
                              {toLatinNumbers(payment.amount.toFixed(2))} .د.م
                            </TableCell>
                            <TableCell className="font-medium">
                              الأسبوع {payment.weekNumber} - {payment.year}
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2 justify-start">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {formatDate(payment.createdAt)}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12">
                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                              <DollarSign className="h-12 w-12 opacity-50" />
                              <p className="text-lg">لا توجد سجلات مدفوعات</p>
                              <p className="text-sm">سيظهر سجل المدفوعات هنا عند تسجيل الدفعات</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}