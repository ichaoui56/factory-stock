"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NewTransactionDialog } from "@/components/new-transaction-dialog"
import { AddPaymentDialog } from "@/components/add-payment-dialog"
import { EditClientDialog } from "@/components/edit-client-dialog"
import Link from "next/link"

// Mock data - replace with actual data fetching
const clientData = {
  id: "C001",
  name: "شركة النور للملابس",
  location: "القاهرة",
  contact: "01012345678",
  balance: 15000,
  totalSales: 50000,
  totalPayments: 35000,
  transactions: [
    {
      id: "T001",
      type: "sale",
      productType: "قمصان قطنية",
      quantity: 100,
      unitPrice: 150,
      totalAmount: 15000,
      date: "2025-01-15",
      notes: "شحنة عادية",
    },
    {
      id: "T002",
      type: "payment",
      amount: 10000,
      date: "2025-01-20",
      notes: "دفعة نقدية",
    },
    {
      id: "T003",
      type: "sale",
      productType: "بناطيل جينز",
      quantity: 50,
      unitPrice: 200,
      totalAmount: 10000,
      date: "2025-01-25",
      notes: "",
    },
    {
      id: "T004",
      type: "payment",
      amount: 5000,
      date: "2025-01-28",
      notes: "دفعة بنكية",
    },
    {
      id: "T005",
      type: "sale",
      productType: "جاكيتات شتوية",
      quantity: 30,
      unitPrice: 350,
      totalAmount: 10500,
      date: "2025-02-01",
      notes: "طلب خاص",
    },
  ],
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    calendar: "gregory",
  })
}

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const client = clientData // In real app, fetch based on id

  const salesTransactions = client.transactions.filter((t) => t.type === "sale")
  const paymentTransactions = client.transactions.filter((t) => t.type === "payment")

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">تفاصيل العميل</h1>
        </div>

        {/* Client Info Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-xl md:text-2xl">{client.name}</CardTitle>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {client.location}
                  </span>
                  <span className="flex items-center gap-1" dir="ltr">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {client.contact}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <EditClientDialog client={client} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">الرصيد الحالي</p>
                <p
                  className={`text-2xl font-bold ${client.balance > 0 ? "text-destructive" : client.balance < 0 ? "text-primary" : "text-green-600"}`}
                >
                  {client.balance.toLocaleString("en-US")} د.م.
                </p>
                {client.balance > 0 && <p className="text-xs text-muted-foreground mt-1">مدين لنا</p>}
                {client.balance < 0 && <p className="text-xs text-muted-foreground mt-1">دائن (دفعة مقدمة)</p>}
                {client.balance === 0 && <p className="text-xs text-green-600 mt-1">متساوي</p>}
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">إجمالي المبيعات</p>
                <p className="text-2xl font-bold">{client.totalSales.toLocaleString("en-US")} د.م.</p>
                <p className="text-xs text-muted-foreground mt-1">{salesTransactions.length} معاملة</p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">إجمالي الدفعات</p>
                <p className="text-2xl font-bold text-primary">{client.totalPayments.toLocaleString("en-US")} د.م.</p>
                <p className="text-xs text-muted-foreground mt-1">{paymentTransactions.length} دفعة</p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">نسبة السداد</p>
                <p className="text-2xl font-bold">
                  {client.totalSales > 0 ? Math.round((client.totalPayments / client.totalSales) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">من إجمالي المبيعات</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <NewTransactionDialog clientId={client.id} clientName={client.name} />
          <AddPaymentDialog clientId={client.id} clientName={client.name} currentBalance={client.balance} />
        </div>

        {/* Transactions Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">جميع المعاملات</TabsTrigger>
            <TabsTrigger value="sales">المبيعات</TabsTrigger>
            <TabsTrigger value="payments">الدفعات</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>سجل المعاملات الكامل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">#</TableHead>
                        <TableHead className="text-right">الملاحظات</TableHead>
                        <TableHead className="text-right">المبلغ</TableHead>
                        <TableHead className="text-right">التفاصيل</TableHead>
                        <TableHead className="text-right">النوع</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">رقم المعاملة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {client.transactions.map((transaction, index) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="text-sm font-medium text-muted-foreground" dir="ltr">
                            {(index + 1).toLocaleString("en-US")}
                          </TableCell>
                          <TableCell className="text-sm">{transaction.notes || "-"}</TableCell>
                          <TableCell>
                            {transaction.type === "sale" ? (
                              <span className="font-bold text-destructive">
                                +{transaction.totalAmount?.toLocaleString("en-US")} د.م.
                              </span>
                            ) : (
                              <span className="font-bold text-primary">
                                -{transaction.amount?.toLocaleString("en-US")} د.م.
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {transaction.type === "sale"
                              ? `${transaction.productType} - ${transaction.quantity} قطعة × ${transaction.unitPrice} د.م.`
                              : "دفعة مالية"}
                          </TableCell>
                          <TableCell>
                            {transaction.type === "sale" ? (
                              <Badge variant="destructive">بيع</Badge>
                            ) : (
                              <Badge variant="default" className="bg-primary">
                                دفعة
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm whitespace-nowrap">{formatDate(transaction.date)}</TableCell>
                          <TableCell className="font-medium">{transaction.id}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>سجل المبيعات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">#</TableHead>
                        <TableHead className="text-right">الملاحظات</TableHead>
                        <TableHead className="text-right">المبلغ الإجمالي</TableHead>
                        <TableHead className="text-right">سعر الوحدة</TableHead>
                        <TableHead className="text-right">الكمية</TableHead>
                        <TableHead className="text-right">نوع المنتج</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">رقم المعاملة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesTransactions.map((transaction, index) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="text-sm font-medium text-muted-foreground" dir="ltr">
                            {(index + 1).toLocaleString("en-US")}
                          </TableCell>
                          <TableCell className="text-sm">{transaction.notes || "-"}</TableCell>
                          <TableCell className="font-bold text-destructive">
                            {transaction.totalAmount?.toLocaleString("en-US")} د.م.
                          </TableCell>
                          <TableCell className="text-sm">
                            {transaction.unitPrice?.toLocaleString("en-US")} د.م.
                          </TableCell>
                          <TableCell className="text-sm">{transaction.quantity}</TableCell>
                          <TableCell className="text-sm">{transaction.productType}</TableCell>
                          <TableCell className="text-sm whitespace-nowrap">{formatDate(transaction.date)}</TableCell>
                          <TableCell className="font-medium">{transaction.id}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>سجل الدفعات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">#</TableHead>
                        <TableHead className="text-right">الملاحظات</TableHead>
                        <TableHead className="text-right">المبلغ</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">رقم المعاملة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentTransactions.map((transaction, index) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="text-sm font-medium text-muted-foreground" dir="ltr">
                            {(index + 1).toLocaleString("en-US")}
                          </TableCell>
                          <TableCell className="text-sm">{transaction.notes || "-"}</TableCell>
                          <TableCell className="font-bold text-primary">
                            {transaction.amount?.toLocaleString("en-US")} د.م.
                          </TableCell>
                          <TableCell className="text-sm whitespace-nowrap">{formatDate(transaction.date)}</TableCell>
                          <TableCell className="font-medium">{transaction.id}</TableCell>
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
    </div>
  )
}
