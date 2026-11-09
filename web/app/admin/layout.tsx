import type { Metadata } from "next"
import { AdminShell } from "@/components/admin-shell"

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
    <AdminShell>
      {children}
    </AdminShell>
  )
}
