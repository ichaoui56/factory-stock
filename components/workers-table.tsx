"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EditWorkerDialog } from "@/components/edit-worker-dialog"
import Link from "next/link"

const workers = [
  {
    id: "001",
    name: "محمد أحمد علي",
    weeklySalary: 1200,
    weeklyPayment: 1200,
    status: "active",
    workType: "lafso-mahdi",
    active: true, // Added active field
  },
  {
    id: "002",
    name: "فاطمة حسن محمود",
    weeklySalary: 1000,
    weeklyPayment: 833,
    status: "active",
    workType: "al-fasala",
    active: true, // Added active field
  },
  {
    id: "003",
    name: "خالد عبدالله",
    weeklySalary: 1500,
    weeklyPayment: 1500,
    status: "active",
    workType: "lafso-mahdi",
    active: true,
  },
  {
    id: "004",
    name: "سارة محمد",
    weeklySalary: 900,
    weeklyPayment: 750,
    status: "active",
    workType: "al-fasala",
    active: false,
  }, // Added active field - inactive worker example
  {
    id: "005",
    name: "عمر يوسف",
    weeklySalary: 1100,
    weeklyPayment: 1100,
    status: "active",
    workType: "lafso-mahdi",
    active: true,
  }, // Added active field
  {
    id: "006",
    name: "نور الدين",
    weeklySalary: 1300,
    weeklyPayment: 1083,
    status: "active",
    workType: "al-fasala",
    active: true,
  }, // Added active field
  {
    id: "007",
    name: "ليلى أحمد",
    weeklySalary: 950,
    weeklyPayment: 950,
    status: "active",
    workType: "lafso-mahdi",
    active: true,
  }, // Added active field
  {
    id: "008",
    name: "حسن علي",
    weeklySalary: 1400,
    weeklyPayment: 1400,
    status: "active",
    workType: "al-fasala",
    active: true,
  }, // Added active field
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

export function WorkersTable({ workTypeFilter }: { workTypeFilter?: string }) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) || worker.id.includes(searchQuery)
    const matchesWorkType = !workTypeFilter || worker.workType === workTypeFilter
    return matchesSearch && matchesWorkType
  })

  const getWorkTypeLabel = (workType: string) => {
    return workType === "lafso-mahdi" ? "لافصو مهدي" : "الفصالة"
  }

  const getWorkerBalance = (workerId: string) => {
    // Mock calculation - in real app, fetch from database
    const earned = 1200
    const paid = 950
    return earned - paid
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg md:text-xl">قائمة العمال</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                type="search"
                placeholder="بحث عن عامل..."
                className="pr-10 w-full sm:w-64 text-sm md:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right whitespace-nowrap text-xs md:text-sm">الإجراءات</TableHead>
                <TableHead className="text-right whitespace-nowrap text-xs md:text-sm">الحالة</TableHead>
                <TableHead className="text-right whitespace-nowrap text-xs md:text-sm">الرصيد</TableHead>
                <TableHead className="text-right whitespace-nowrap text-xs md:text-sm">الراتب الأسبوعي</TableHead>
                <TableHead className="text-right whitespace-nowrap text-xs md:text-sm">نوع العمل</TableHead>
                <TableHead className="text-right whitespace-nowrap text-xs md:text-sm">الاسم</TableHead>
                <TableHead className="text-right whitespace-nowrap text-xs md:text-sm">رقم العامل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.map((worker) => {
                const balance = getWorkerBalance(worker.id)
                return (
                  <TableRow key={worker.id}>
                    <TableCell>
                      <div className="flex gap-1 md:gap-2">
                        <Link href={`/workers/${worker.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </Button>
                        </Link>
                        <EditWorkerDialog worker={worker} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          worker.active
                            ? "bg-primary/10 text-primary border-primary/20 text-xs whitespace-nowrap"
                            : "bg-gray-100 text-gray-600 border-gray-200 text-xs whitespace-nowrap"
                        }
                      >
                        {worker.active ? "نشط" : "غير نشط"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">
                      <span
                        className={`font-bold ${balance > 0 ? "text-orange-600" : balance < 0 ? "text-red-600" : "text-gray-600"}`}
                      >
                        {toLatinNumbers(Math.abs(balance).toFixed(2))} د.م.
                      </span>
                      <div className="text-[10px] text-muted-foreground">
                        {balance > 0 ? "مستحق" : balance < 0 ? "زيادة" : "متوازن"}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">
                      {toLatinNumbers(worker.weeklySalary)} د.م.
                    </TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">
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
                    </TableCell>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">{worker.name}</TableCell>
                    <TableCell className="font-medium text-xs md:text-sm whitespace-nowrap">
                      {toLatinNumbers(worker.id)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
