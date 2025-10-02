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

interface NewTransactionDialogProps {
  clientId: string
  clientName: string
}

export function NewTransactionDialog({ clientId, clientName }: NewTransactionDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    productType: "",
    quantity: "",
    unitPrice: "",
    notes: "",
  })

  const totalPrice = Number(formData.quantity) * Number(formData.unitPrice) || 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New transaction:", {
      clientId,
      ...formData,
      totalPrice,
      transactionDate: new Date().toISOString(),
    })
    // Here you would typically send the data to your backend
    setFormData({ productType: "", quantity: "", unitPrice: "", notes: "" })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          إضافة معاملة جديدة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>إضافة معاملة جديدة</DialogTitle>
          <DialogDescription>تسجيل شحنة بضاعة للعميل: {clientName}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productType">نوع المنتج</Label>
            <Input
              id="productType"
              value={formData.productType}
              onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
              placeholder="مثال: قمصان، بناطيل، إلخ"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">الكمية</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">سعر الوحدة (د.م.)</Label>
              <Input
                id="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">المبلغ الإجمالي:</span>
              <span className="text-xl font-bold text-primary">{totalPrice.toLocaleString("ar-EG")} د.م.</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات (اختياري)</Label>
            <Textarea
              id="notes"
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
            <Button type="submit">تسجيل المعاملة</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
