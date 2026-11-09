import type { Metadata } from "next"
import { MailProvider } from "@/components/mail-context"
import { MailShell } from "@/components/mail-shell"

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
      <MailShell>
        {children}
      </MailShell>
    </MailProvider>
  )
}
