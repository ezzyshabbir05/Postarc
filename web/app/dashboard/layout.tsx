import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard — Postarc",
  description: "Enterprise Mailbox System",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
