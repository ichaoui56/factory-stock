import { Worker, Attendance, Payment } from "@prisma/client"

export type WorkerWithRelations = Worker & {
  attendances: Attendance[]
  payments: Payment[]
}

export type FrontendWorker = {
  id: string
  name: string
  weeklySalary: number
  weeklyPayment: number
  status: string
  workType: string
  active: boolean
  phoneNumber?: string
}

export function convertWorkerToFrontend(worker: Worker): FrontendWorker {
  return {
    id: worker.id,
    name: worker.fullName,
    weeklySalary: worker.weeklyPayment,
    weeklyPayment: worker.weeklyPayment,
    status: worker.isActive ? "active" : "inactive",
    workType: mapWorkTypeToFrontend(worker.workType),
    active: worker.isActive,
    phoneNumber: worker.phoneNumber,
  }
}

function mapWorkTypeToFrontend(workType: string): string {
  switch (workType) {
    case "LAFSOW_MAHDI":
      return "lafso-mahdi"
    case "ALFASALA":
      return "al-fasala"
    case "BOTH":
      return "both"
    default:
      return "lafso-mahdi"
  }
}