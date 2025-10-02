"use client"

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

// Mock data - in real app, fetch from database
const workers = [
  {
    id: "001",
    name: "محمد أحمد علي",
    weeklySalary: 1200,
    dailyRate: 200,
    status: "active",
    workType: "lafso-mahdi",
    joinDate: "2024-01-15",
    active: true,
  },
  {
    id: "002",
    name: "فاطمة حسن محمود",
    weeklySalary: 1000,
    dailyRate: 166.667,
    status: "active",
    workType: "al-fasala",
    joinDate: "2024-02-01",
    active: true,
  },
]

// Mock attendance and payment history
const mockAttendanceHistory = [
  { date: "2025-02-10", status: "full", earned: 200, paid: 0 },
  { date: "2025-02-09", status: "full", earned: 200, paid: 200 },
  { date: "2025-02-08", status: "half", earned: 100, paid: 100 },
  { date: "2025-02-07", status: "full", earned: 200, paid: 0 },
  { date: "2025-02-06", status: "oneAndHalf", earned: 300, paid: 300 },
  { date: "2025-02-05", status: "full", earned: 200, paid: 150 },
  { date: "2025-02-04", status: "absent", earned: 0, paid: 0 },
]

const mockPaymentHistory = [
  { id: "1", date: "2025-02-09", amount: 200, type: "daily", note: "دفعة يومية" },
  { id: "2", date: "2025-02-08", amount: 100, type: "daily", note: "دفعة نصف يوم" },
  { id: "3", date: "2025-02-06", amount: 300, type: "daily", note: "دفعة يوم ونصف" },
  { id: "4", date: "2025-02-05", amount: 150, type: "partial", note: "دفعة جزئية" },
  { id: "5", date: "2025-02-01", amount: 1000, type: "weekly", note: "راتب أسبوعي" },
]

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

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ]
  return `${toLatinNumbers(date.getDate())} ${months[date.getMonth()]} ${toLatinNumbers(date.getFullYear())}`
}

export default function WorkerDetailPage() {
  const params = useParams()
  const id = params.id as string

  const worker = workers.find((w) => w.id === id)

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

  // Calculate totals
  const totalEarned = mockAttendanceHistory.reduce((sum, record) => sum + record.earned, 0)
  const totalPaid = mockPaymentHistory.reduce((sum, payment) => sum + payment.amount, 0)
  const balance = totalEarned - totalPaid

  const getWorkTypeLabel = (workType: string) => {
    return workType === "lafso-mahdi" ? "لافصو مهدي" : "الفصالة"
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "full":
        return "يوم كامل"
      case "half":
        return "نصف يوم"
      case "oneAndHalf":
        return "يوم ونصف"
      case "absent":
        return "غائب"
      default:
        return status
    }
  }

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case "daily":
        return "دفعة يومية"
      case "weekly":
        return "راتب أسبوعي"
      case "partial":
        return "دفعة جزئية"
      case "advance":
        return "سلفة"
      default:
        return type
    }
  }

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
              <h1 className="text-3xl font-bold">{worker.name}</h1>
              <p className="text-muted-foreground mt-1">رقم العامل: {toLatinNumbers(worker.id)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <EditWorkerDialog worker={worker} />
            <RecordPaymentDialog workerId={worker.id} workerName={worker.name} currentBalance={balance} />
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
                  <p className="text-2xl font-bold">{toLatinNumbers(worker.dailyRate.toFixed(2))} ر.س</p>
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
                    worker.workType === "lafso-mahdi"
                      ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                      : "bg-green-500/10 text-green-600 border-green-500/20"
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
                    worker.active
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }
                >
                  {worker.active ? "نشط" : "غير نشط"}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">الراتب الأسبوعي</span>
                <span className="font-bold">{toLatinNumbers(worker.weeklySalary)} ر.س</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">تاريخ الانضمام</span>
                <span className="font-bold">{formatDate(worker.joinDate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History Tabs */}
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attendance">سجل الحضور والأجور</TabsTrigger>
            <TabsTrigger value="payments">سجل المدفوعات</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>سجل الحضور اليومي والأجور المستحقة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">المتبقي</TableHead>
                        <TableHead className="text-right">المدفوع</TableHead>
                        <TableHead className="text-right">الأجر المستحق</TableHead>
                        <TableHead className="text-right">الحضور</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAttendanceHistory.map((record, index) => {
                        const remaining = record.earned - record.paid
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <span
                                className={`font-bold ${remaining > 0 ? "text-orange-600" : remaining < 0 ? "text-red-600" : "text-gray-600"}`}
                              >
                                {toLatinNumbers(Math.abs(remaining).toFixed(2))} ر.س
                              </span>
                            </TableCell>
                            <TableCell className="font-bold text-green-600">
                              {toLatinNumbers(record.paid.toFixed(2))} ر.س
                            </TableCell>
                            <TableCell className="font-bold text-primary">
                              {toLatinNumbers(record.earned.toFixed(2))} ر.س
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  record.status === "absent"
                                    ? "bg-red-100 text-red-700 border-red-200"
                                    : record.status === "half"
                                      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                      : "bg-green-100 text-green-700 border-green-200"
                                }
                              >
                                {getStatusLabel(record.status)}
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
                      {mockPaymentHistory.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="text-muted-foreground">{payment.note}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                payment.type === "weekly"
                                  ? "bg-blue-100 text-blue-700 border-blue-200"
                                  : payment.type === "daily"
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-purple-100 text-purple-700 border-purple-200"
                              }
                            >
                              {getPaymentTypeLabel(payment.type)}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-green-600 text-lg">
                            {toLatinNumbers(payment.amount.toFixed(2))} ر.س
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {formatDate(payment.date)}
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
