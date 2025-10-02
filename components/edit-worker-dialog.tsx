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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Pencil } from "lucide-react"

interface Worker {
  id: string
  name: string
  weeklySalary: number
  workType: string
  active: boolean
}

interface EditWorkerDialogProps {
  worker: Worker
  onSave?: (updatedWorker: Worker) => void
}

export function EditWorkerDialog({ worker, onSave }: EditWorkerDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: worker.name,
    weeklySalary: worker.weeklySalary.toString(),
    workType: worker.workType,
    active: worker.active,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedWorker: Worker = {
      ...worker,
      name: formData.name,
      weeklySalary: Number.parseFloat(formData.weeklySalary),
      workType: formData.workType,
      active: formData.active,
    }

    onSave?.(updatedWorker)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>تعديل بيانات العامل</DialogTitle>
          <DialogDescription>قم بتحديث معلومات العامل وحالته</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="أدخل الاسم الكامل"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="weeklySalary">الراتب الأسبوعي (ر.س)</Label>
              <Input
                id="weeklySalary"
                type="number"
                step="0.01"
                value={formData.weeklySalary}
                onChange={(e) => setFormData({ ...formData, weeklySalary: e.target.value })}
                placeholder="1200"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>نوع العمل</Label>
              <RadioGroup
                value={formData.workType}
                onValueChange={(value) => setFormData({ ...formData, workType: value })}
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="lafso-mahdi" id="edit-lafso-mahdi" />
                  <Label htmlFor="edit-lafso-mahdi" className="cursor-pointer">
                    لافصو مهدي
                  </Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="al-fasala" id="edit-al-fasala" />
                  <Label htmlFor="edit-al-fasala" className="cursor-pointer">
                    الفصالة
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="active-toggle" className="text-base">
                  حالة العامل
                </Label>
                <p className="text-sm text-muted-foreground">
                  {formData.active ? "العامل نشط ويظهر في الحضور اليومي" : "العامل غير نشط ولن يظهر في الحضور اليومي"}
                </p>
              </div>
              <Switch
                id="active-toggle"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit">حفظ التغييرات</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
