"use client"

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
import { recordPayment } from "@/lib/actions/worker.actions"
import { toast } from "sonner"

interface RecordPaymentDialogProps {
  workerId: string
  workerName: string
  currentBalance: number
  onPaymentRecorded?: () => void
}

function toLatinNumbers(str: string | number): string {
  const arabicToLatin: Record<string, string> = {
    "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
    "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
  }
  return String(str).replace(/[٠-٩]/g, (d) => arabicToLatin[d] || d)
}

export function RecordPaymentDialog({ workerId, workerName, currentBalance, onPaymentRecorded }: RecordPaymentDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState("")
  const [paymentType, setPaymentType] = useState<"DAILY" | "WEEKLY" | "PARTIAL">("DAILY")
  const [note, setNote] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await recordPayment({
        workerId,
        amount: parseFloat(amount),
        paymentType,
        note,
      })

      if (result.success) {
        toast.success("تم تسجيل الدفعة بنجاح")
        setOpen(false)
        // Reset form
        setAmount("")
        setPaymentType("DAILY")
        setNote("")
        onPaymentRecorded?.()
      } else {
        toast.error(result.error || "فشل في تسجيل الدفعة")
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الدفعة")
      console.error("Error recording payment:", error)
    } finally {
      setLoading(false)
    }
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
                disabled={loading}
                className="text-lg"
              />
            </div>

            {/* Payment Type */}
            <div className="space-y-2">
              <Label htmlFor="paymentType">نوع الدفعة *</Label>
              <Select value={paymentType} onValueChange={(value: "DAILY" | "WEEKLY" | "PARTIAL") => setPaymentType(value)} disabled={loading}>
                <SelectTrigger id="paymentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">دفعة يومية</SelectItem>
                  <SelectItem value="WEEKLY">راتب أسبوعي</SelectItem>
                  <SelectItem value="PARTIAL">دفعة جزئية</SelectItem>
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
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              إلغاء
            </Button>
            <Button type="submit" disabled={!amount || parseFloat(amount) <= 0 || loading}>
              {loading ? "جاري التسجيل..." : "تسجيل الدفعة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
