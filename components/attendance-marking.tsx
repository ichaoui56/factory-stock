"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

const workers = [
  { id: "#1", name: "أحمد محمد علي", dailyRate: 200, workType: "لافصو مهدي" as const, active: true },
  { id: "#2", name: "فاطمة أحمد حسن", dailyRate: 166.667, workType: "الفصالة" as const, active: true },
  { id: "#3", name: "محمد سالم القاسمي", dailyRate: 233.333, workType: "لافصو مهدي" as const, active: false },
]

type AttendanceStatus = "full" | "half" | "oneAndHalf" | "absent" | "notRecorded"
type WorkType = "لافصو مهدي" | "الفصالة"

function getWeekDates(weekOffset = 0) {
  const today = new Date()
  const currentDay = today.getDay() // 0 = Sunday, 1 = Monday, etc.

  // Calculate Monday of current week
  const monday = new Date(today)
  const daysFromMonday = currentDay === 0 ? -6 : 1 - currentDay
  monday.setDate(today.getDate() + daysFromMonday)

  // Add week offset
  monday.setDate(monday.getDate() + weekOffset * 7)

  // Generate 6 days (Monday to Saturday)
  const weekDays = []
  for (let i = 0; i < 6; i++) {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    weekDays.push(day)
  }

  return weekDays
}

function toLatinNumbers(str: string | number): string {
  const arabicToLatin: Record<string, string> = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٢": "7",
    "٨": "8",
    "٩": "9",
  }

  return String(str).replace(/[٠-٩]/g, (d) => arabicToLatin[d] || d)
}

function formatGregorianDate(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return toLatinNumbers(`${year}/${month}/${day}`)
}

function getRelativeDayLabel(date: Date): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)

  const diffTime = compareDate.getTime() - today.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === -1) return "أمس"
  if (diffDays === 0) return "اليوم"
  if (diffDays === 1) return "غداً"
  return dayNames[compareDate.getDay() === 0 ? 6 : compareDate.getDay() - 1]
}

const dayNames = ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]

function getArabicMonth(monthIndex: number): string {
  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ]
  return months[monthIndex]
}

function calculatePayment(dailyRate: number, status: AttendanceStatus) {
  switch (status) {
    case "full":
      return dailyRate
    case "half":
      return dailyRate * 0.5
    case "oneAndHalf":
      return dailyRate * 1.5
    case "absent":
      return 0
    default:
      return 0
  }
}

export function AttendanceMarking() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [selectedWorkType, setSelectedWorkType] = useState<WorkType>("لافصو مهدي")
  const [attendance, setAttendance] = useState<Record<string, Record<string, AttendanceStatus>>>({})

  const weekDates = getWeekDates(weekOffset)
  const selectedDate = weekDates[selectedDayIndex]

  const isCurrentWeek = weekOffset === 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isToday = selectedDate.getTime() === today.getTime()

  const filteredWorkers = workers.filter((worker) => worker.workType === selectedWorkType && worker.active)

  const getDateKey = (date: Date): string => {
    return date.toISOString().split("T")[0]
  }

  const navigateDay = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (selectedDayIndex === 0) {
        setWeekOffset(weekOffset - 1)
        setSelectedDayIndex(5)
      } else {
        setSelectedDayIndex(selectedDayIndex - 1)
      }
    } else {
      if (selectedDayIndex === 5) {
        setWeekOffset(weekOffset + 1)
        setSelectedDayIndex(0)
      } else {
        setSelectedDayIndex(selectedDayIndex + 1)
      }
    }
  }

  const goToCurrentWeek = () => {
    setWeekOffset(0)
  }

  const goToToday = () => {
    setWeekOffset(0)
    const today = new Date()
    const currentDay = today.getDay()
    const dayIndex = currentDay === 0 ? 5 : currentDay - 1
    setSelectedDayIndex(Math.min(dayIndex, 5))
  }

  const handleAttendanceChange = (workerId: string, status: AttendanceStatus) => {
    const dateKey = getDateKey(selectedDate)
    setAttendance((prev) => ({
      ...prev,
      [workerId]: {
        ...prev[workerId],
        [dateKey]: status,
      },
    }))
  }

  const getAttendanceStatus = (workerId: string, date: Date): AttendanceStatus => {
    const dateKey = getDateKey(date)
    return attendance[workerId]?.[dateKey] || "notRecorded"
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Week Navigation */}
      <Card>
        <CardContent className="p-2 md:p-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setWeekOffset(weekOffset - 1)}
                className="h-7 w-7 md:h-9 md:w-9 flex-shrink-0"
              >
                <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>

              <div className="text-center flex-1 min-w-0">
                <h2 className="text-sm md:text-lg font-bold mb-0.5">{isCurrentWeek ? "الأسبوع الحالي" : "الأسبوع"}</h2>
                <p className="text-muted-foreground text-[10px] md:text-xs break-words">
                  الاثنين، {formatGregorianDate(weekDates[0])} - السبت، {formatGregorianDate(weekDates[5])} (6 أيام عمل)
                </p>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setWeekOffset(weekOffset + 1)}
                className="h-7 w-7 md:h-9 md:w-9 flex-shrink-0"
              >
                <ChevronLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            </div>

            {!isCurrentWeek && (
              <Button variant="secondary" onClick={goToCurrentWeek} className="w-full text-xs md:text-sm h-7 md:h-8">
                <Calendar className="ml-1.5 h-3 w-3 md:h-3.5 md:w-3.5" />
                الذهاب إلى الأسبوع الحالي
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Day Navigation */}
      <Card>
        <CardContent className="p-2 md:p-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDay("prev")}
                className="h-7 w-7 md:h-8 md:w-8 flex-shrink-0"
              >
                <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>

              <div className="text-center flex-1 min-w-0">
                <h2 className="text-sm md:text-base font-bold">{getRelativeDayLabel(selectedDate)}</h2>
                <p className="text-muted-foreground text-[10px] md:text-xs">{formatGregorianDate(selectedDate)}</p>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDay("next")}
                className="h-7 w-7 md:h-8 md:w-8 flex-shrink-0"
              >
                <ChevronLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            </div>

            {!isToday && (
              <Button variant="secondary" onClick={goToToday} className="w-full text-xs md:text-sm h-7 md:h-8">
                <Calendar className="ml-1.5 h-3 w-3 md:h-3.5 md:w-3.5" />
                الذهاب إلى اليوم
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs to switch between work types */}
      <Tabs value={selectedWorkType} onValueChange={(value) => setSelectedWorkType(value as WorkType)}>
        <TabsList className="grid w-full grid-cols-2 h-8 md:h-9">
          <TabsTrigger value="لافصو مهدي" className="text-xs md:text-sm py-1 md:py-1.5">
            لافصو مهدي
          </TabsTrigger>
          <TabsTrigger value="الفصالة" className="text-xs md:text-sm py-1 md:py-1.5">
            الفصالة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="لافصو مهدي" className="mt-3 md:mt-4">
          <AttendanceContent
            workers={filteredWorkers}
            selectedDate={selectedDate}
            attendance={attendance}
            onAttendanceChange={handleAttendanceChange}
            getAttendanceStatus={getAttendanceStatus}
            weekDates={weekDates}
          />
        </TabsContent>

        <TabsContent value="الفصالة" className="mt-3 md:mt-4">
          <AttendanceContent
            workers={filteredWorkers}
            selectedDate={selectedDate}
            attendance={attendance}
            onAttendanceChange={handleAttendanceChange}
            getAttendanceStatus={getAttendanceStatus}
            weekDates={weekDates}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AttendanceContent({
  workers,
  selectedDate,
  attendance,
  onAttendanceChange,
  getAttendanceStatus,
  weekDates,
}: {
  workers: typeof workers
  selectedDate: Date
  attendance: Record<string, Record<string, AttendanceStatus>>
  onAttendanceChange: (workerId: string, status: AttendanceStatus) => void
  getAttendanceStatus: (workerId: string, date: Date) => AttendanceStatus
  weekDates: Date[]
}) {
  return (
    <div className="space-y-3 md:space-y-4">
      {/* Daily Attendance Marking */}
      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-base md:text-xl font-bold">تسجيل الحضور - اليوم</h3>
          </div>

          {workers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm md:text-base">لا يوجد عمال في هذا القسم</p>
            </div>
          ) : (
            <div className="grid gap-2.5 md:gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {workers.map((worker) => {
                const status = getAttendanceStatus(worker.id, selectedDate)
                const todayPayment = calculatePayment(worker.dailyRate, status)

                return (
                  <Card key={worker.id} className="overflow-hidden">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex items-start justify-between mb-2.5 md:mb-3 gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm md:text-lg font-bold mb-0.5 break-words">{worker.name}</h4>
                          <p className="text-xs md:text-sm text-muted-foreground">{toLatinNumbers(worker.id)}</p>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-muted flex items-center justify-center text-base md:text-lg font-bold flex-shrink-0">
                          {worker.name.charAt(0)}
                        </div>
                      </div>

                      <div className="space-y-1.5 md:space-y-2 mb-2.5 md:mb-3">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-xs md:text-sm text-primary">الأجر اليومي</span>
                          <span className="text-xs md:text-base font-bold text-primary">
                            {toLatinNumbers(worker.dailyRate.toFixed(3))} د.م.
                          </span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-xs md:text-sm text-muted-foreground">الأجر المحسوب</span>
                          <span className="text-xs md:text-base font-bold text-green-600">
                            {toLatinNumbers(todayPayment.toFixed(3))} د.م.
                          </span>
                        </div>
                      </div>

                      {status !== "notRecorded" && (
                        <div
                          className={`text-center py-1 md:py-1.5 px-2 md:px-3 rounded-lg mb-2.5 md:mb-3 text-xs md:text-sm font-medium ${
                            status === "absent"
                              ? "bg-red-100 text-red-700"
                              : status === "half"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {status === "full" && "يوم كامل"}
                          {status === "half" && "نصف يوم"}
                          {status === "oneAndHalf" && "يوم ونصف"}
                          {status === "absent" && "غائب"}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                        <Button
                          variant={status === "full" ? "default" : "outline"}
                          onClick={() => onAttendanceChange(worker.id, "full")}
                          className="text-xs md:text-sm h-8 md:h-9"
                        >
                          يوم كامل
                        </Button>
                        <Button
                          variant={status === "half" ? "default" : "outline"}
                          onClick={() => onAttendanceChange(worker.id, "half")}
                          className="text-xs md:text-sm h-8 md:h-9"
                        >
                          نصف يوم
                        </Button>
                        <Button
                          variant={status === "oneAndHalf" ? "default" : "outline"}
                          onClick={() => onAttendanceChange(worker.id, "oneAndHalf")}
                          className="text-xs md:text-sm h-8 md:h-9"
                        >
                          يوم ونصف
                        </Button>
                        <Button
                          variant={status === "absent" ? "destructive" : "outline"}
                          onClick={() => onAttendanceChange(worker.id, "absent")}
                          className="text-xs md:text-sm h-8 md:h-9"
                        >
                          غائب
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Report Table */}
      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-3 mb-3 md:mb-4">
            <h3 className="text-base md:text-xl font-bold">التقرير الأسبوعي - الأسبوع الحالي</h3>
            <svg
              className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <p className="text-muted-foreground mb-3 md:mb-4 text-xs md:text-sm">
            من {formatGregorianDate(weekDates[0])} إلى {formatGregorianDate(weekDates[5])} ({toLatinNumbers(6)} أيام
            عمل)
          </p>

          {workers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm md:text-base">لا يوجد عمال في هذا القسم</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-3 md:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-1.5 md:p-3 font-bold text-xs md:text-base whitespace-nowrap">
                        إجمالي الأجر
                      </th>
                      {dayNames.map((day, index) => (
                        <th
                          key={index}
                          className="text-center p-1.5 md:p-3 font-bold text-xs md:text-sm whitespace-nowrap"
                        >
                          <div>{day}</div>
                          <div className="text-[10px] md:text-xs text-muted-foreground font-normal mt-0.5">
                            {toLatinNumbers(weekDates[index].getDate())} {getArabicMonth(weekDates[index].getMonth())}
                          </div>
                        </th>
                      ))}
                      <th className="text-right p-1.5 md:p-3 font-bold text-xs md:text-base sticky right-0 bg-card">
                        العامل
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map((worker) => {
                      let weeklyTotal = 0
                      weekDates.forEach((date) => {
                        const status = getAttendanceStatus(worker.id, date)
                        weeklyTotal += calculatePayment(worker.dailyRate, status)
                      })

                      return (
                        <tr key={worker.id} className="border-b hover:bg-muted/50">
                          <td className="p-1.5 md:p-3 text-right">
                            <span className="text-xs md:text-base font-bold text-green-600 whitespace-nowrap">
                              {toLatinNumbers(weeklyTotal.toFixed(3))} د.م.
                            </span>
                          </td>
                          {weekDates.map((date, dayIndex) => {
                            const status = getAttendanceStatus(worker.id, date)
                            return (
                              <td key={dayIndex} className="text-center p-1.5 md:p-3">
                                {status === "notRecorded" && (
                                  <span className="text-muted-foreground text-[10px] md:text-xs whitespace-nowrap">
                                    لم يسجل
                                  </span>
                                )}
                                {status === "full" && (
                                  <span className="inline-block px-1.5 md:px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] md:text-xs font-medium whitespace-nowrap">
                                    يوم كامل
                                  </span>
                                )}
                                {status === "half" && (
                                  <span className="inline-block px-1.5 md:px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-[10px] md:text-xs font-medium whitespace-nowrap">
                                    نصف يوم
                                  </span>
                                )}
                                {status === "oneAndHalf" && (
                                  <span className="inline-block px-1.5 md:px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] md:text-xs font-medium whitespace-nowrap">
                                    يوم ونصف
                                  </span>
                                )}
                                {status === "absent" && (
                                  <span className="inline-block px-1.5 md:px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] md:text-xs font-medium whitespace-nowrap">
                                    غائب
                                  </span>
                                )}
                              </td>
                            )
                          })}
                          <td className="p-1.5 md:p-3 sticky right-0 bg-card">
                            <div className="font-bold text-xs md:text-base break-words max-w-[100px] md:max-w-none">
                              {worker.name}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
