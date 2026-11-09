"use client"

import { usePathname } from "next/navigation"
import { useState } from "react"
import { AppShell } from "@astryxdesign/core/AppShell"
import { TopNav, TopNavHeading } from "@astryxdesign/core/TopNav"
import { SideNav, SideNavItem, SideNavSection } from "@astryxdesign/core/SideNav"
import { TextInput } from "@astryxdesign/core/TextInput"
import { Badge } from "@astryxdesign/core/Badge"
import { Avatar } from "@astryxdesign/core/Avatar"
import { DropdownMenu } from "@astryxdesign/core/DropdownMenu"
import { Button } from "@astryxdesign/core/Button"
import { ProgressBar } from "@astryxdesign/core/ProgressBar"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Text } from "@astryxdesign/core/Text"
import { Banner } from "@astryxdesign/core/Banner"
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog"
import {
  Search,
  Inbox,
  Star,
  Clock,
  Send,
  FileText,
  Archive,
  AlertCircle,
  Trash2,
  Tag,
  SquarePen,
  ShieldCheck,
  Folder,
  Plus,
  Users,
  Calendar,
} from "lucide-react"
import type { MailboxUser } from "@/types/mailbox"
import { useMail } from "@/components/mail-context"
import { MailComposer } from "@/components/mail-composer"
import { useThemeMode } from "@/components/theme-provider"
import { postarcApi } from "@/lib/postarc-api"

// ─── Webmail Top Navigation ──────────────────────────────────────────────────

interface MailTopNavProps {
  user?: MailboxUser | null
}

function MailTopNav({ user: initialUser }: MailTopNavProps) {
  const { searchQuery, setSearchQuery } = useMail()
  const { mode, toggleTheme } = useThemeMode()
  const [user, setUser] = useState<MailboxUser | null>(initialUser || null)

  useState(() => {
    if (!user && typeof window !== "undefined") {
      const cur = postarcApi.getCurrentUser()
      if (cur) setUser(cur)
    }
  })

  const displayName = user?.fullName || "My Account"
  const email = user?.email || ""
  const isAdmin = user?.role === "admin"

  return (
    <TopNav
      label="Mailbox navigation"
      heading={
        <TopNavHeading
          heading="Postarc Mail"
          headingHref="/mail"
        />
      }
      centerContent={
        <TextInput
          label="Search mail"
          isLabelHidden
          type="search"
          placeholder="Search in mail (from, to, subject)"
          value={searchQuery}
          onChange={(val) => setSearchQuery(val)}
          startIcon={<Search size={16} />}
          hasClear
          width={460}
          size="md"
        />
      }
      endContent={
        <HStack gap={3} vAlign="center">
          <Button
            label="Calendar"
            variant="ghost"
            size="sm"
            icon={<Calendar size={16} />}
            href="/mail/calendar"
          />
          <Button
            label="Contacts"
            variant="ghost"
            size="sm"
            icon={<Users size={16} />}
            href="/mail/contacts"
          />

          {/* Admin Switcher pill if this user has admin role */}
          {isAdmin && (
            <Button
              label="Admin Console"
              variant="secondary"
              size="sm"
              icon={<ShieldCheck size={16} />}
              href="/admin"
            />
          )}

          {/* User profile dropdown: identity, Settings, theme toggle, and sign out */}
          <DropdownMenu
            alignment="end"
            header={
              <VStack gap={0.5} padding={2} width="100%">
                <Text type="body" size="sm" weight="semibold" color="primary">
                  {displayName}
                </Text>
                <Text type="supporting" size="xsm" color="secondary">
                  {email}
                </Text>
              </VStack>
            }
            renderTrigger={(triggerProps) => (
              <Avatar
                name={displayName}
                src={user?.avatarUrl || undefined}
                size={32}
                tooltip={`${displayName} (${email})`}
                {...triggerProps}
              />
            )}
            items={[
              { label: "Settings", href: "/mail/settings" },
              { label: "Mail Filters (Sieve)", href: "/mail/filters" },
              {
                label: mode === "dark" ? "Light theme" : "Dark theme",
                onClick: toggleTheme,
              },
              ...(isAdmin
                ? [
                    { type: "divider" as const },
                    { label: "Admin Console", href: "/admin" },
                  ]
                : []),
              { type: "divider" as const },
              {
                label: "Sign out",
                variant: "destructive",
                onClick: () => {
                  postarcApi.logout()
                  window.location.href = "/"
                },
              },
            ]}
          />
        </HStack>
      }
    />
  )
}

// ─── Webmail Side Navigation ─────────────────────────────────────────────────

interface MailSideNavProps {
  user?: MailboxUser | null
}

function MailSideNav({ user }: MailSideNavProps) {
  const pathname = usePathname()
  const {
    openCompose,
    unreadCounts,
    activeFolder,
    setActiveFolder,
    closeEmail,
    setSearchQuery,
    customFolders,
    createCustomFolder,
    quotaInfo,
  } = useMail()

  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")

  const usedBytes = quotaInfo?.usedBytes || user?.storageUsedBytes || 0
  const totalBytes = quotaInfo?.totalBytes || user?.storageTotalBytes || 15 * 1024 * 1024 * 1024
  const usedGB = (usedBytes / (1024 * 1024 * 1024)).toFixed(1)
  const totalGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(0)
  const percentageUsed = quotaInfo?.percent ?? Math.min(
    Math.round((usedBytes / totalBytes) * 100),
    100
  )
  const isNearLimit = percentageUsed >= 80

  const handleSelectFolder = (folder: typeof activeFolder) => {
    setActiveFolder(folder)
    closeEmail()
    setSearchQuery("")
  }

  const handleSelectLabel = (label: string) => {
    setActiveFolder("inbox")
    closeEmail()
    setSearchQuery(label)
  }

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return
    createCustomFolder(newFolderName.trim())
    setNewFolderName("")
    setIsNewFolderOpen(false)
  }

  return (
    <SideNav
      resizable={{
        defaultWidth: 220,
        minWidth: 160,
        maxWidth: 400,
      }}
      topContent={
        <VStack width="100%">
          <Button
            label="Compose"
            variant="primary"
            size="md"
            icon={<SquarePen size={16} />}
            width="100%"
            onClick={openCompose}
          />
        </VStack>
      }
      footer={
        <VStack gap={1} width="100%" padding={2}>
          <HStack hAlign="between" vAlign="center">
            <Text type="supporting" color="secondary" size="xsm">
              Personal Mailbox
            </Text>
            <Text
              type="supporting"
              color={isNearLimit ? "primary" : "secondary"}
              className={isNearLimit ? "text-red-500" : undefined}
              size="xsm"
              weight="medium"
            >
              {usedGB} / {totalGB} GB ({percentageUsed}%)
            </Text>
          </HStack>
          <ProgressBar
            label="Storage used"
            isLabelHidden
            value={percentageUsed}
            max={100}
            variant={isNearLimit ? "error" : "accent"}
          />
          {isNearLimit && (
            <Text type="supporting" color="secondary" size="xsm" className="text-red-500">
              80% soft limit reached
            </Text>
          )}
        </VStack>
      }
    >
      {/* ── Mail Folders (Strictly personal mail) ── */}
      <SideNavSection title="Mail" isHeaderHidden>
        <SideNavItem
          label="Inbox"
          icon={<Inbox size={18} />}
          isSelected={pathname === "/mail" && activeFolder === "inbox"}
          href="/mail"
          onClick={() => handleSelectFolder("inbox")}
          endContent={
            unreadCounts.inbox > 0 ? (
              <Badge label={String(unreadCounts.inbox)} variant="neutral" />
            ) : undefined
          }
        />
        <SideNavItem
          label="Starred"
          icon={<Star size={18} />}
          isSelected={pathname === "/mail" && activeFolder === "starred"}
          href="/mail"
          onClick={() => handleSelectFolder("starred")}
          endContent={
            unreadCounts.starred > 0 ? (
              <Badge label={String(unreadCounts.starred)} variant="neutral" />
            ) : undefined
          }
        />
        <SideNavItem
          label="Snoozed"
          icon={<Clock size={18} />}
          isSelected={pathname === "/mail" && activeFolder === "snoozed"}
          href="/mail"
          onClick={() => handleSelectFolder("snoozed")}
        />
        <SideNavItem
          label="Sent"
          icon={<Send size={18} />}
          isSelected={pathname === "/mail" && activeFolder === "sent"}
          href="/mail"
          onClick={() => handleSelectFolder("sent")}
        />
        <SideNavItem
          label="Drafts"
          icon={<FileText size={18} />}
          isSelected={pathname === "/mail" && activeFolder === "drafts"}
          href="/mail"
          onClick={() => handleSelectFolder("drafts")}
          endContent={
            unreadCounts.drafts > 0 ? (
              <Badge label={String(unreadCounts.drafts)} variant="neutral" />
            ) : undefined
          }
        />
        <SideNavItem
          label="Archive"
          icon={<Archive size={18} />}
          isSelected={pathname === "/mail" && activeFolder === "archive"}
          href="/mail"
          onClick={() => handleSelectFolder("archive")}
        />
        <SideNavItem
          label="Spam"
          icon={<AlertCircle size={18} />}
          isSelected={pathname === "/mail" && activeFolder === "spam"}
          href="/mail"
          onClick={() => handleSelectFolder("spam")}
        />
        <SideNavItem
          label="Trash"
          icon={<Trash2 size={18} />}
          isSelected={pathname === "/mail" && activeFolder === "trash"}
          href="/mail"
          onClick={() => handleSelectFolder("trash")}
        />
      </SideNavSection>

      {/* ── Labels ── */}
      <SideNavSection title="Labels">
        <SideNavItem
          label="Clients"
          icon={<Tag size={18} className="text-blue-500" />}
          isSelected={false}
          href="/mail"
          onClick={() => handleSelectLabel("Clients")}
        />
        <SideNavItem
          label="Invoices"
          icon={<Tag size={18} className="text-emerald-500" />}
          isSelected={false}
          href="/mail"
          onClick={() => handleSelectLabel("Invoices")}
        />
        <SideNavItem
          label="Personal"
          icon={<Tag size={18} className="text-purple-500" />}
          isSelected={false}
          href="/mail"
          onClick={() => handleSelectLabel("Personal")}
        />
        <SideNavItem
          label="Work"
          icon={<Tag size={18} className="text-amber-500" />}
          isSelected={false}
          href="/mail"
          onClick={() => handleSelectLabel("Work")}
        />
      </SideNavSection>

      {/* ── Custom Folders (Roundcube Suite) ── */}
      <SideNavSection
        title="Folders"
        endContent={
          <Button
            variant="ghost"
            size="sm"
            icon={<Plus size={14} />}
            label="New"
            onClick={() => setIsNewFolderOpen(true)}
          />
        }
      >
        {customFolders.map((cf) => (
          <SideNavItem
            key={cf.id}
            label={cf.name}
            icon={<Folder size={18} style={{ color: cf.color || "#6366F1" }} />}
            isSelected={pathname === "/mail" && activeFolder === cf.id}
            href="/mail"
            onClick={() => handleSelectFolder(cf.id)}
            endContent={
              cf.unreadCount > 0 ? (
                <Badge label={String(cf.unreadCount)} variant="neutral" />
              ) : undefined
            }
          />
        ))}
      </SideNavSection>

      {/* Create Folder Dialog */}
      <Dialog
        isOpen={isNewFolderOpen}
        onOpenChange={setIsNewFolderOpen}
        width={420}
      >
        <VStack gap={4} hAlign="stretch" padding={4}>
          <DialogHeader
            title="Create New Mailbox Folder"
            onOpenChange={setIsNewFolderOpen}
          />
          <TextInput
            label="Folder Name"
            placeholder="e.g. Invoices, Projects, Archive 2026"
            value={newFolderName}
            onChange={(val) => setNewFolderName(val)}
          />
          <HStack hAlign="end" gap={2}>
            <Button
              variant="ghost"
              size="sm"
              label="Cancel"
              onClick={() => setIsNewFolderOpen(false)}
            />
            <Button
              variant="primary"
              size="sm"
              label="Create Folder"
              isDisabled={!newFolderName.trim()}
              onClick={handleCreateFolder}
            />
          </HStack>
        </VStack>
      </Dialog>
    </SideNav>
  )
}

// ─── Webmail Shell Layout ───────────────────────────────────────────────────

interface MailShellProps {
  user?: MailboxUser | null
  children: React.ReactNode
}

export function MailShell({ user, children }: MailShellProps) {
  const { quotaInfo } = useMail()
  const percentageUsed = quotaInfo?.percent ?? 0
  const isNearLimit = percentageUsed >= 80

  return (
    <AppShell
      height="fill"
      variant="elevated"
      contentPadding={0}
      topNav={<MailTopNav user={user} />}
      sideNav={<MailSideNav user={user} />}
    >
      <VStack gap={0} width="100%">
        {/* Soft limit warning banner (80% threshold requirement) */}
        {isNearLimit && (
          <VStack padding={3} width="100%">
            <Banner
              status="warning"
              title={`Storage warning: You have used ${percentageUsed}% of your assigned mailbox storage.`}
              description="Your mailbox is nearing its quota. Please delete unwanted emails or empty your Trash to avoid incoming message delivery soft-bounces (SMTP 452)."
              container="card"
            />
          </VStack>
        )}
        {children}
      </VStack>

      {/* Gmail Floating Compose Dialog */}
      <MailComposer />
    </AppShell>
  )
}
