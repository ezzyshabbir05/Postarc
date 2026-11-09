"use client"

import { HStack } from "@astryxdesign/core/Layout"
import { TabList, Tab } from "@astryxdesign/core/TabList"
import { Badge } from "@astryxdesign/core/Badge"
import {
  Inbox,
  Tag,
  Users,
  Info,
} from "lucide-react"
import { useMail } from "@/components/mail-context"
import type { EmailCategory } from "@/types/email"

export function MailCategoryTabs() {
  const { activeCategory, setActiveCategory, unreadCounts } = useMail()

  return (
    <HStack width="100%" paddingInline={4}>
      <TabList
        value={activeCategory}
        onChange={(val) => setActiveCategory(val as EmailCategory)}
        hasDivider={true}
        size="md"
      >
        <Tab
          value="primary"
          label="Primary"
          icon={<Inbox size={16} />}
          selectedIcon={<Inbox size={16} />}
          endContent={
            unreadCounts.primary > 0 ? (
              <Badge label={String(unreadCounts.primary)} variant="neutral" />
            ) : undefined
          }
        />
        <Tab
          value="promotions"
          label="Promotions"
          icon={<Tag size={16} />}
          selectedIcon={<Tag size={16} />}
          endContent={
            unreadCounts.promotions > 0 ? (
              <Badge label={String(unreadCounts.promotions)} variant="neutral" />
            ) : undefined
          }
        />
        <Tab
          value="social"
          label="Social"
          icon={<Users size={16} />}
          selectedIcon={<Users size={16} />}
          endContent={
            unreadCounts.social > 0 ? (
              <Badge label={String(unreadCounts.social)} variant="neutral" />
            ) : undefined
          }
        />
        <Tab
          value="updates"
          label="Updates"
          icon={<Info size={16} />}
          selectedIcon={<Info size={16} />}
          endContent={
            unreadCounts.updates > 0 ? (
              <Badge label={String(unreadCounts.updates)} variant="neutral" />
            ) : undefined
          }
        />
      </TabList>
    </HStack>
  )
}
