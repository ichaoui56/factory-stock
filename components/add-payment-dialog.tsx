"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AddPaymentDialogProps {
  clientId: string
  clientName: string
  currentBalance: number
}

export function AddPaymentDialog({ clientId, clientName, currentBalance }: AddPaymentDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    notes: "",
  })

  const paymentAmount = Number(formData.amount) || 0
  const newBalance = currentBalance - paymentAmount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New payment:", {
      clientId,
      amount: paymentAmount,
      notes: formData.notes,
      paymentDate: new Date().toISOString(),
    })
    // Here you would typically send the data to your backend
    setFormData({ amount: "", notes: "" })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          تسجيل دفعة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>تسجيل دفعة مالية</DialogTitle>
          <DialogDescription>تسجيل دفعة من العميل: {clientName}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>الرصيد الحالي:</span>
              <span
                className={`font-bold ${currentBalance > 0 ? "text-destructive" : currentBalance < 0 ? "text-primary" : ""}`}
              >
                {currentBalance.toLocaleString("ar-EG")} د.م.
              </span>
            </div>
            {currentBalance > 0 && <p className="text-xs text-muted-foreground">العميل مدين لنا بهذا المبلغ</p>}
            {currentBalance < 0 && (
              <p className="text-xs text-muted-foreground">نحن مدينون للعميل بهذا المبلغ (دفعة مقدمة)</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">المبلغ المدفوع (د.م.)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          {paymentAmount > 0 && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">الرصيد بعد الدفع:</span>
                <span
                  className={`text-lg font-bold ${newBalance > 0 ? "text-destructive" : newBalance < 0 ? "text-primary" : "text-green-600"}`}
                >
                  {newBalance.toLocaleString("ar-EG")} د.م.
                </span>
              </div>
              {newBalance === 0 && <p className="text-xs text-green-600 mt-1">سيتم تسوية الحساب بالكامل</p>}
              {newBalance < 0 && <p className="text-xs text-primary mt-1">سيصبح لدى العميل رصيد مقدم</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="payment-notes">ملاحظات (اختياري)</Label>
            <Textarea
              id="payment-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="أي ملاحظات إضافية..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit">تسجيل الدفعة</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
