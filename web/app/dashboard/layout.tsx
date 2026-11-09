import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { mockMailboxUser } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Inbox — Postarc Mail",
  description: "Enterprise Multi-Tenant Mailbox",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardShell user={mockMailboxUser}>
      {children}
    </DashboardShell>
  )
}

