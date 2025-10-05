"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { WorkType, AttendanceType, PaymentType } from "@prisma/client"

// Helper function to get week number
function getWeekNumber(date: Date): { weekNumber: string; year: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return {
    weekNumber: `W${weekNo.toString().padStart(2, "0")}`,
    year: d.getUTCFullYear(),
  }
}

// Helper function to calculate balance for a single worker
// In your server actions, update the calculateWorkerBalance function:

// Helper function to calculate balance for a single worker
function calculateWorkerBalance(worker: any) {
  const dailyRate = worker.weeklyPayment / 6

  let totalEarned = 0
  if (worker.attendances) {
    worker.attendances.forEach((attendance: any) => {
      const days = [
        attendance.monday,
        attendance.tuesday,
        attendance.wednesday,
        attendance.thursday,
        attendance.friday,
        attendance.saturday,
      ]
      days.forEach((dayType) => {
        // Skip unrecorded days (null or undefined)
        if (dayType === null || dayType === undefined) {
          return
        }
        
        switch (dayType) {
          case "FULL_DAY":
            totalEarned += dailyRate
            break
          case "DAY_AND_NIGHT":
            totalEarned += dailyRate * 1.5
            break
          case "HALF_DAY":
            totalEarned += dailyRate * 0.5
            break
          case "ABSENCE":
            totalEarned += 0
            break
        }
      })
    })
  }

  const totalPaid = worker.payments
    ? worker.payments.reduce((sum: number, payment: any) => sum + payment.amount, 0)
    : 0

  const balance = totalEarned - totalPaid

  return {
    totalEarned,
    totalPaid,
    balance,
  }
}

// ==================== Worker CRUD ====================

export async function getAllWorkers() {
  try {
    const workers = await prisma.worker.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        attendances: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    })
    return { success: true, data: workers }
  } catch (error) {
    console.error("Error fetching workers:", error)
    return { success: false, error: "فشل في جلب بيانات العمال" }
  }
}

// ✨ NEW: Get all workers with balances calculated in a single query
export async function getAllWorkersWithBalances() {
  try {
    const workers = await prisma.worker.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        attendances: true,
        payments: true,
      },
    })

    const workersWithBalances = workers.map((worker) => {
      const balanceData = calculateWorkerBalance(worker)
      return {
        ...worker,
        balance: balanceData.balance,
        totalEarned: balanceData.totalEarned,
        totalPaid: balanceData.totalPaid,
      }
    })

    return { success: true, data: workersWithBalances }
  } catch (error) {
    console.error("Error fetching workers with balances:", error)
    return { success: false, error: "فشل في جلب بيانات العمال" }
  }
}

export async function getWorkerById(id: string) {
  try {
    const worker = await prisma.worker.findUnique({
      where: { id },
      include: {
        attendances: {
          orderBy: { createdAt: "desc" },
        },
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
    })
    
    if (!worker) {
      return { success: false, error: "العامل غير موجود" }
    }
    
    return { success: true, data: worker }
  } catch (error) {
    console.error("Error fetching worker:", error)
    return { success: false, error: "فشل في جلب بيانات العامل" }
  }
}

export async function createWorker(data: {
  fullName: string
  phoneNumber: string
  weeklyPayment: number
  workType: "LAFSOW_MAHDI" | "ALFASALA"
}) {
  try {
    const worker = await prisma.worker.create({
      data: {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        weeklyPayment: data.weeklyPayment,
        workType: data.workType as WorkType,
        isActive: true,
      },
    })
    
    revalidatePath("/workers")
    return { success: true, data: worker }
  } catch (error) {
    console.error("Error creating worker:", error)
    return { success: false, error: "فشل في إضافة العامل" }
  }
}

export async function updateWorker(
  id: string,
  data: {
    fullName?: string
    phoneNumber?: string
    weeklyPayment?: number
    workType?: "LAFSOW_MAHDI" | "ALFASALA"
    isActive?: boolean
  }
) {
  try {
    const worker = await prisma.worker.update({
      where: { id },
      data: {
        ...(data.fullName && { fullName: data.fullName }),
        ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
        ...(data.weeklyPayment !== undefined && { weeklyPayment: data.weeklyPayment }),
        ...(data.workType && { workType: data.workType as WorkType }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    })
    
    revalidatePath("/workers")
    revalidatePath(`/workers/${id}`)
    return { success: true, data: worker }
  } catch (error) {
    console.error("Error updating worker:", error)
    return { success: false, error: "فشل في تحديث بيانات العامل" }
  }
}

export async function deleteWorker(id: string) {
  try {
    await prisma.worker.delete({
      where: { id },
    })
    
    revalidatePath("/workers")
    return { success: true }
  } catch (error) {
    console.error("Error deleting worker:", error)
    return { success: false, error: "فشل في حذف العامل" }
  }
}

// ==================== Worker Statistics ====================

export async function getWorkerBalance(workerId: string) {
  try {
    // Get worker with all attendances and payments
    const worker = await prisma.worker.findUnique({
      where: { id: workerId },
      include: {
        attendances: true,
        payments: true,
      },
    })

    if (!worker) {
      return { success: false, error: "العامل غير موجود" }
    }

    const balanceData = calculateWorkerBalance(worker)

    return {
      success: true,
      data: balanceData,
    }
  } catch (error) {
    console.error("Error calculating worker balance:", error)
    return { success: false, error: "فشل في حساب رصيد العامل" }
  }
}

// ==================== Attendance ====================

// This function is deprecated - use markAttendance from attendence.actions.ts instead
// Kept for backward compatibility
export async function recordAttendance(data: {
  workerId: string
  date: Date
  type: "FULL_DAY" | "DAY_AND_NIGHT" | "HALF_DAY" | "ABSENCE"
}) {
  return { success: false, error: "Use markAttendance from attendence.actions.ts" }
}

export async function getWorkerAttendance(workerId: string, startDate?: Date, endDate?: Date) {
  try {
    const where: any = { workerId }

    const attendances = await prisma.weeklyAttendance.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        worker: true,
      },
    })

    return { success: true, data: attendances }
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return { success: false, error: "فشل في جلب سجل الحضور" }
  }
}

// ==================== Payments ====================

export async function recordPayment(data: {
  workerId: string
  amount: number
  paymentType: "DAILY" | "WEEKLY" | "PARTIAL"
  note?: string
}) {
  try {
    const now = new Date()
    const { weekNumber, year } = getWeekNumber(now)

    const payment = await prisma.payment.create({
      data: {
        workerId: data.workerId,
        amount: data.amount,
        paymentType: data.paymentType as PaymentType,
        weekNumber,
        year,
        note: data.note,
      },
    })

    revalidatePath("/workers")
    revalidatePath(`/workers/${data.workerId}`)
    
    return { success: true, data: payment }
  } catch (error) {
    console.error("Error recording payment:", error)
    return { success: false, error: "فشل في تسجيل الدفعة" }
  }
}

export async function getWorkerPayments(workerId: string) {
  try {
    const payments = await prisma.payment.findMany({
      where: { workerId },
      orderBy: { createdAt: "desc" },
      include: {
        worker: true,
      },
    })

    return { success: true, data: payments }
  } catch (error) {
    console.error("Error fetching payments:", error)
    return { success: false, error: "فشل في جلب سجل المدفوعات" }
  }
}

// ==================== Weekly Reports ====================

export async function getWeeklyReport(weekNumber: string, year: number) {
  try {
    const attendances = await prisma.weeklyAttendance.findMany({
      where: { weekNumber, year },
      include: {
        worker: true,
      },
    })

    const payments = await prisma.payment.findMany({
      where: { weekNumber, year },
      include: {
        worker: true,
      },
    })

    return { success: true, data: { attendances, payments } }
  } catch (error) {
    console.error("Error fetching weekly report:", error)
    return { success: false, error: "فشل في جلب التقرير الأسبوعي" }
  }
}

// ==================== Search and Filter ====================

export async function searchWorkers(query: string, workType?: "LAFSOW_MAHDI" | "ALFASALA") {
  try {
    const where: any = {
      OR: [
        { fullName: { contains: query, mode: "insensitive" } },
        { phoneNumber: { contains: query } },
      ],
    }

    if (workType) {
      where.workType = workType
    }

    const workers = await prisma.worker.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return { success: true, data: workers }
  } catch (error) {
    console.error("Error searching workers:", error)
    return { success: false, error: "فشل في البحث عن العمال" }
  }
}

export async function getActiveWorkers(workType?: "LAFSOW_MAHDI" | "ALFASALA") {
  try {
    const where: any = { isActive: true }
    
    if (workType) {
      where.workType = workType
    }

    const workers = await prisma.worker.findMany({
      where,
      orderBy: { fullName: "asc" },
    })

    return { success: true, data: workers }
  } catch (error) {
    console.error("Error fetching active workers:", error)
    return { success: false, error: "فشل في جلب العمال النشطين" }
  }
}