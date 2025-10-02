import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const stats = [
  {
    title: "إجمالي العمال",
    value: "124",
    change: "+12 من الشهر الماضي",
    changeType: "increase" as const,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    bgColor: "bg-primary",
  },
  {
    title: "الحضور اليوم",
    value: "98",
    change: "+5 من الأمس",
    changeType: "increase" as const,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    bgColor: "bg-card",
  },
  {
    title: "إجمالي العملاء",
    value: "45",
    change: "+3 من الشهر الماضي",
    changeType: "increase" as const,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    bgColor: "bg-card",
  },
  {
    title: "المبيعات المعلقة",
    value: "12",
    change: "قيد المناقشة",
    changeType: "neutral" as const,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    bgColor: "bg-card",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={stat.title} className={index === 0 ? "bg-primary text-primary-foreground border-primary" : ""}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p
                  className={`text-xs md:text-sm font-medium ${index === 0 ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                >
                  {stat.title}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">{stat.value}</h3>
                <div className="flex items-center gap-2 mt-2 md:mt-3">
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full ${
                      index === 0 ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
                    }`}
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    {stat.change}
                  </span>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className={`rounded-full flex-shrink-0 ${index === 0 ? "text-primary-foreground hover:bg-primary-foreground/20" : ""}`}
              >
                {stat.icon}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
