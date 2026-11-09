import type { Metadata } from "next"
import { AdminShell } from "@/components/admin-shell"
import { mockAdminUser } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Console — Postarc Admin",
  description: "Enterprise Organization Administration Console",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminShell admin={mockAdminUser}>
      {children}
    </AdminShell>
  )
}

