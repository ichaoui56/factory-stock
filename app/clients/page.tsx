import { DashboardLayout } from "@/components/dashboard-layout"
import { ClientsTable } from "@/components/clients-table"
import { Button } from "@/components/ui/button"
import { AddClientDialog } from "@/components/add-client-dialog"
import Link from "next/link"

export default function ClientsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-balance">إدارة العملاء</h1>
            <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
              عرض وإدارة بيانات العملاء والمبيعات
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <Link href="/clients/new-sale" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto min-h-[44px]">
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                إضافة عملية بيع
              </Button>
            </Link>
            <AddClientDialog />
          </div>
        </div>

        <ClientsTable />
      </div>
    </DashboardLayout>
  )
}
