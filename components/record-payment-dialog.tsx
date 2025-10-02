"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DollarSign } from "lucide-react"

interface RecordPaymentDialogProps {
  workerId: string
  workerName: string
  currentBalance: number
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
    "٧": "7",
    "٨": "8",
    "٩": "9",
  }
  return String(str).replace(/[٠-٩]/g, (d) => arabicToLatin[d] || d)
}

export function RecordPaymentDialog({ workerId, workerName, currentBalance }: RecordPaymentDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [paymentType, setPaymentType] = useState("daily")
  const [note, setNote] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would save the payment to your database
    console.log("Recording payment:", { workerId, amount, paymentType, note })
    setOpen(false)
    // Reset form
    setAmount("")
    setPaymentType("daily")
    setNote("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <DollarSign className="h-5 w-5" />
          تسجيل دفعة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>تسجيل دفعة جديدة</DialogTitle>
            <DialogDescription>
              تسجيل دفعة للعامل: <span className="font-bold">{workerName}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Balance Info */}
            <div className="rounded-lg bg-muted p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">الرصيد الحالي:</span>
                <span
                  className={`text-lg font-bold ${currentBalance > 0 ? "text-orange-600" : currentBalance < 0 ? "text-red-600" : "text-gray-600"}`}
                >
                  {toLatinNumbers(Math.abs(currentBalance).toFixed(2))} ر.س
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {currentBalance > 0 ? "مستحق للعامل" : currentBalance < 0 ? "مدفوع زيادة" : "متوازن"}
              </p>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">المبلغ (ر.س) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="text-lg"
              />
            </div>

            {/* Payment Type */}
            <div className="space-y-2">
              <Label htmlFor="paymentType">نوع الدفعة *</Label>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger id="paymentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">دفعة يومية</SelectItem>
                  <SelectItem value="weekly">راتب أسبوعي</SelectItem>
                  <SelectItem value="partial">دفعة جزئية</SelectItem>
                  <SelectItem value="advance">سلفة</SelectItem>
                  <SelectItem value="bonus">مكافأة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note">ملاحظات</Label>
              <Textarea
                id="note"
                placeholder="أضف ملاحظات إضافية (اختياري)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={!amount || Number.parseFloat(amount) <= 0}>
              تسجيل الدفعة
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
