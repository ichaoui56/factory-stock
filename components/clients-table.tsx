"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EditClientDialog } from "@/components/edit-client-dialog"
import Link from "next/link"

const clients = [
  {
    id: "C001",
    name: "شركة النور للملابس",
    location: "القاهرة",
    contact: "01012345678",
    balance: 15000, // Changed from outstandingBalance to balance (positive = they owe us)
    totalSales: 50000,
    totalPayments: 35000,
  },
  {
    id: "C002",
    name: "متجر الأمل",
    location: "الإسكندرية",
    contact: "01123456789",
    balance: -5000, // Negative balance means prepayment (we owe them)
    totalSales: 30000,
    totalPayments: 35000,
  },
  {
    id: "C003",
    name: "شركة الفجر التجارية",
    location: "الجيزة",
    contact: "01234567890",
    balance: 8500,
    totalSales: 42000,
    totalPayments: 33500,
  },
  {
    id: "C004",
    name: "محلات السلام",
    location: "المنصورة",
    contact: "01098765432",
    balance: 0, // Zero balance means fully settled
    totalSales: 38000,
    totalPayments: 38000,
  },
  {
    id: "C005",
    name: "مؤسسة النجاح",
    location: "طنطا",
    contact: "01187654321",
    balance: 5000,
    totalSales: 25000,
    totalPayments: 20000,
  },
]

export function ClientsTable() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.id.includes(searchQuery) ||
      client.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg md:text-xl">قائمة العملاء</CardTitle>
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
                placeholder="بحث عن عميل..."
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
                <TableHead className="text-right whitespace-nowrap text-xs md:text-sm">#</TableHead>
                <TableHead className="text-right whitespace-nowrap text-xs md:text-sm">الإجراءات</TableHead>
                <TableHead className="text-right whitespace-nowrap text-xs md:text-sm">الرصيد</TableHead>
                <TableHead className="text-right whitespace-nowrap text-xs md:text-sm">إجمالي الدفعات</TableHead>
                <TableHead className="text-right whitespace-nowrap text-xs md:text-sm">إجمالي المبيعات</TableHead>
                <TableHead className="text-right whitespace-nowrap text-xs md:text-sm">رقم الاتصال</TableHead>
                <TableHead className="text-right whitespace-nowrap text-xs md:text-sm">الموقع</TableHead>
                <TableHead className="text-right whitespace-nowrap text-xs md:text-sm">اسم العميل</TableHead>
                <TableHead className="text-right whitespace-nowrap text-xs md:text-sm">رقم العميل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client, index) => (
                <TableRow key={client.id}>
                  <TableCell className="text-xs md:text-sm font-medium text-muted-foreground" dir="ltr">
                    {(index + 1).toLocaleString("en-US")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 md:gap-2">
                      <Link href={`/clients/${client.id}`}>
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
                      <EditClientDialog client={client} />
                    </div>
                  </TableCell>
                  <TableCell>
                    {client.balance > 0 ? (
                      <Badge variant="destructive" className="text-xs whitespace-nowrap">
                        مدين {client.balance.toLocaleString("en-US")} د.م.
                      </Badge>
                    ) : client.balance < 0 ? (
                      <Badge variant="default" className="text-xs whitespace-nowrap bg-primary">
                        دائن {Math.abs(client.balance).toLocaleString("en-US")} د.م.
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 text-xs whitespace-nowrap"
                      >
                        متساوي
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs md:text-sm whitespace-nowrap">
                    {client.totalPayments.toLocaleString("en-US")} د.م.
                  </TableCell>
                  <TableCell className="text-xs md:text-sm whitespace-nowrap">
                    {client.totalSales.toLocaleString("en-US")} د.م.
                  </TableCell>
                  <TableCell dir="ltr" className="text-right text-xs md:text-sm whitespace-nowrap">
                    {client.contact}
                  </TableCell>
                  <TableCell className="text-xs md:text-sm whitespace-nowrap">{client.location}</TableCell>
                  <TableCell className="text-xs md:text-sm whitespace-nowrap">{client.name}</TableCell>
                  <TableCell className="font-medium text-xs md:text-sm whitespace-nowrap">{client.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
