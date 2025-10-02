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

export function AddClientDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contact: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("New client data:", formData)
    // Reset form and close dialog
    setFormData({ name: "", location: "", contact: "" })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto min-h-[44px] bg-transparent">
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          إضافة عميل
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">إضافة عميل جديد</DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              أدخل بيانات العميل الجديد. اضغط حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm md:text-base">
                اسم العميل <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="أدخل اسم العميل"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="text-sm md:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm md:text-base">
                الموقع / المكان <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                placeholder="أدخل موقع العميل"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="text-sm md:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact" className="text-sm md:text-base">
                رقم الهاتف <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact"
                type="tel"
                dir="ltr"
                placeholder="01012345678"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                required
                className="text-sm md:text-base"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="min-h-[44px]">
              إلغاء
            </Button>
            <Button type="submit" className="min-h-[44px]">
              حفظ العميل
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
