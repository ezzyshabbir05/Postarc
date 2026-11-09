import type { Metadata } from "next"
import { MailProvider } from "@/components/mail-context"
import { MailShell } from "@/components/mail-shell"
import { mockMailboxUser } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Inbox — Postarc Mail",
  description: "Personal Enterprise Webmail Client",
}

export default function MailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MailProvider>
      <MailShell user={mockMailboxUser}>
        {children}
      </MailShell>
    </MailProvider>
  )
}
