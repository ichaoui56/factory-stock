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

export function AddWorkerDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    weeklySalary: "",
    phone: "",
    address: "",
    workType: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("New worker data:", formData)
    // Reset form and close dialog
    setFormData({ name: "", weeklySalary: "", phone: "", address: "", workType: "" })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto min-h-[44px] bg-transparent" variant="outline">
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          إضافة عامل
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">إضافة عامل جديد</DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              أدخل بيانات العامل الجديد. اضغط حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm md:text-base">
                الاسم الكامل <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="أدخل اسم العامل"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="text-sm md:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workType" className="text-sm md:text-base">
                نوع العمل <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.workType}
                onValueChange={(value) => setFormData({ ...formData, workType: value })}
                required
              >
                <SelectTrigger className="text-sm md:text-base">
                  <SelectValue placeholder="اختر نوع العمل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lafso-mahdi">لافصو مهدي</SelectItem>
                  <SelectItem value="al-fasala">الفصالة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weeklySalary" className="text-sm md:text-base">
                الراتب الأسبوعي (ر.س) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="weeklySalary"
                type="number"
                step="0.01"
                placeholder="1200"
                value={formData.weeklySalary}
                onChange={(e) => setFormData({ ...formData, weeklySalary: e.target.value })}
                required
                className="text-sm md:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm md:text-base">
                رقم الهاتف
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="05xxxxxxxx"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="text-sm md:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm md:text-base">
                العنوان
              </Label>
              <Input
                id="address"
                placeholder="أدخل عنوان العامل"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="text-sm md:text-base"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="min-h-[44px]">
              إلغاء
            </Button>
            <Button type="submit" className="min-h-[44px]">
              حفظ العامل
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
