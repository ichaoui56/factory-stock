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
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getWorkerById, getWorkerBalance, getWorkerAttendance, getWorkerPayments } from "@/lib/actions/worker.actions"
import type { Worker, Attendance, Payment, AttendanceType, PaymentType, WorkType } from "@prisma/client"
import { toast } from "sonner"

function toLatinNumbers(str: string | number): string {
  const arabicToLatin: Record<string, string> = {
    "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
    "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
  }
  return String(str).replace(/[٠-٩]/g, (d) => arabicToLatin[d] || d)
}

function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ]
  return `${toLatinNumbers(date.getDate())} ${months[date.getMonth()]} ${toLatinNumbers(date.getFullYear())}`
}

export default function WorkerDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [worker, setWorker] = useState<Worker | null>(null)
  const [balance, setBalance] = useState(0)
  const [totalEarned, setTotalEarned] = useState(0)
  const [totalPaid, setTotalPaid] = useState(0)
  const [attendanceHistory, setAttendanceHistory] = useState<Attendance[]>([])
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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

    fetchData()
  }, [id])

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

      const attendanceResult = await getWorkerAttendance(id);
      if (attendanceResult.success && attendanceResult.data) {
        setAttendanceHistory(attendanceResult.data);
      } else {
        toast.error(attendanceResult.error || "Failed to fetch attendance history");
      }

      const paymentResult = await getWorkerPayments(id);
      if (paymentResult.success && paymentResult.data) {
        setPaymentHistory(paymentResult.data);
      } else {
        toast.error(paymentResult.error || "Failed to fetch payment history");
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
      case "BOTH": return "كلاهما"
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
    return null; // Should be handled by the error state
  }
  
  const dailyRate = worker.weeklyPayment / 6;

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
                  <p className="text-sm text-muted-foreground mb-1">إجمالي المستحق</p>
                  <p className="text-2xl font-bold text-primary">{toLatinNumbers(totalEarned.toFixed(2))} ر.س</p>
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
                  <p className="text-sm text-muted-foreground mb-1">إجمالي المدفوع</p>
                  <p className="text-2xl font-bold text-green-600">{toLatinNumbers(totalPaid.toFixed(2))} ر.س</p>
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
                <div>
                  <p className="text-sm text-muted-foreground mb-1">الرصيد</p>
                  <p
                    className={`text-2xl font-bold ${balance > 0 ? "text-orange-600" : balance < 0 ? "text-red-600" : "text-gray-600"}`}
                  >
                    {toLatinNumbers(Math.abs(balance).toFixed(2))} ر.س
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {balance > 0 ? "مستحق للعامل" : balance < 0 ? "مدفوع زيادة" : "متوازن"}
                  </p>
                </div>
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${balance > 0 ? "bg-orange-500/10" : balance < 0 ? "bg-red-500/10" : "bg-gray-500/10"}`}
                >
                  <TrendingDown
                    className={`h-6 w-6 ${balance > 0 ? "text-orange-600" : balance < 0 ? "text-red-600" : "text-gray-600"}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">الأجر اليومي</p>
                  <p className="text-2xl font-bold">{toLatinNumbers(dailyRate.toFixed(2))} ر.س</p>
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
                <span className="font-bold">{toLatinNumbers(worker.weeklyPayment)} ر.س</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">تاريخ الانضمام</span>
                <span className="font-bold">{formatDate(worker.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History Tabs */}
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attendance">سجل الحضور</TabsTrigger>
            <TabsTrigger value="payments">سجل المدفوعات</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>سجل الحضور اليومي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الأجر المستحق</TableHead>
                        <TableHead className="text-right">الحضور</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceHistory.map((record) => {
                        let earned = 0;
                        switch (record.type) {
                          case "FULL_DAY": earned = dailyRate; break;
                          case "DAY_AND_NIGHT": earned = dailyRate * 1.5; break;
                          case "HALF_DAY": earned = dailyRate * 0.5; break;
                          case "ABSENCE": earned = 0; break;
                        }
                        return (
                          <TableRow key={record.id}>
                            <TableCell className="font-bold text-primary">
                              {toLatinNumbers(earned.toFixed(2))} ر.س
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  record.type === "ABSENCE"
                                    ? "bg-red-100 text-red-700 border-red-200"
                                    : record.type === "HALF_DAY"
                                      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                      : "bg-green-100 text-green-700 border-green-200"
                                }
                              >
                                {getAttendanceStatusLabel(record.type)}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{formatDate(record.date)}</TableCell>
                          </TableRow>
                        )
                      })}
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
                        <TableHead className="text-right">ملاحظات</TableHead>
                        <TableHead className="text-right">النوع</TableHead>
                        <TableHead className="text-right">المبلغ</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentHistory.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="text-muted-foreground">{payment.note || "-"}</TableCell>
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
                            {toLatinNumbers(payment.amount.toFixed(2))} ر.س
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {formatDate(payment.createdAt)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
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
