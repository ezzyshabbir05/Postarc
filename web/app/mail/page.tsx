"use client"

import { VStack } from "@astryxdesign/core/Layout"
import { useMail } from "@/components/mail-context"
import { MailToolbar } from "@/components/mail-toolbar"
import { MailCategoryTabs } from "@/components/mail-category-tabs"
import { MailList } from "@/components/mail-list"
import { MailThreadViewer } from "@/components/mail-thread-viewer"

export default function MailboxPage() {
  const { activeEmailId } = useMail()

  return (
    <VStack gap={0} width="100%">
      {activeEmailId ? (
        <MailThreadViewer />
      ) : (
        <VStack gap={0} width="100%">
          <MailToolbar />
          <MailCategoryTabs />
          <MailList />
        </VStack>
      )}
    </VStack>
  )
}
