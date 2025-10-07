import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function WorkersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    return redirect("/login")
  }

  return <>{children}</>
}