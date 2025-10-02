import { DashboardLayout } from "@/components/dashboard-layout"
import { NewSaleForm } from "@/components/new-sale-form"
import Link from "next/link"

export default function NewSalePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Link href="/clients" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
            ← العودة إلى العملاء
          </Link>
          <h1 className="text-3xl font-bold text-balance">إضافة عملية بيع جديدة</h1>
          <p className="text-muted-foreground mt-2">تسجيل عملية بيع جديدة للعميل</p>
        </div>

        <NewSaleForm />
      </div>
    </DashboardLayout>
  )
}
