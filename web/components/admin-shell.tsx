"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AppShell } from "@astryxdesign/core/AppShell"
import { TopNav, TopNavHeading } from "@astryxdesign/core/TopNav"
import { SideNav, SideNavItem, SideNavSection } from "@astryxdesign/core/SideNav"
import { TextInput } from "@astryxdesign/core/TextInput"
import { Avatar } from "@astryxdesign/core/Avatar"
import { DropdownMenu } from "@astryxdesign/core/DropdownMenu"
import { Button } from "@astryxdesign/core/Button"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Text } from "@astryxdesign/core/Text"
import {
  LayoutGrid,
  Users,
  Database,
  Globe,
  Layers,
  ShieldCheck,
  Settings,
  Search,
  Plus,
} from "lucide-react"
import type { MailboxUser } from "@/types/mailbox"
import { postarcApi } from "@/lib/postarc-api"
import { useThemeMode } from "@/components/theme-provider"

// ─── Admin Top Navigation ────────────────────────────────────────────────────

interface AdminTopNavProps {
  admin?: MailboxUser | null
}

function AdminTopNav({ admin: initialAdmin }: AdminTopNavProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [adminUser, setAdminUser] = useState<MailboxUser | null>(initialAdmin || null)
  const { mode, toggleTheme } = useThemeMode()

  useEffect(() => {
    if (!adminUser) {
      const current = postarcApi.getCurrentUser()
      if (current) setAdminUser(current)
    }
  }, [adminUser])

  const fullName = adminUser?.fullName || "Postarc Administrator"
  const email = adminUser?.email || "admin@postarc.local"

  return (
    <TopNav
      label="Admin Console navigation"
      heading={
        <TopNavHeading
          heading="Postarc Admin"
          headingHref="/admin"
        />
      }
      centerContent={
        <TextInput
          label="Search admin"
          isLabelHidden
          type="search"
          placeholder="Search mailboxes, domains, or audit logs"
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
          <DropdownMenu
            alignment="end"
            header={
              <VStack gap={0.5} padding={2} width="100%">
                <Text type="body" weight="semibold" color="primary">
                  {fullName}
                </Text>
                <Text type="supporting" color="secondary">
                  {email}
                </Text>
              </VStack>
            }
            renderTrigger={(triggerProps) => (
              <Avatar
                name={fullName}
                src={adminUser?.avatarUrl || undefined}
                size={32}
                tooltip={fullName}
                {...triggerProps}
              />
            )}
            items={[
              { label: "Overview", href: "/admin" },
              { label: "Users & Mailboxes", href: "/admin/users" },
              { label: "Storage & Quotas", href: "/admin/storage" },
              { label: "Domains & DNS", href: "/admin/domains" },
              { label: "Aliases & Groups", href: "/admin/aliases" },
              { label: "Security & Audit", href: "/admin/security" },
              { label: "Settings", href: "/admin/settings" },
              {
                label: mode === "dark" ? "Light theme" : "Dark theme",
                onClick: toggleTheme,
              },
              { type: "divider" },
              { label: "Switch to Webmail", href: "/mail" },
              { type: "divider" },
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

// ─── Admin Side Navigation ───────────────────────────────────────────────────

function AdminSideNav() {
  const pathname = usePathname()
  const [usedGB, setUsedGB] = useState("0.0")

  useEffect(() => {
    let isMounted = true
    async function loadStorage() {
      try {
        const quota = await postarcApi.getStorageQuota()
        if (isMounted && quota) {
          setUsedGB((quota.usedBytes / (1024 * 1024 * 1024)).toFixed(1))
        }
      } catch {
        // Fallback default
      }
    }
    loadStorage()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <SideNav
      resizable={{
        defaultWidth: 220,
        minWidth: 160,
        maxWidth: 400,
      }}
      footer={
        <VStack gap={1} width="100%" padding={3}>
          <HStack hAlign="between" vAlign="center">
            <Text type="supporting" color="secondary">
              Storage Used
            </Text>
            <Text type="supporting" color="secondary" weight="medium">
              {usedGB} GB
            </Text>
          </HStack>
        </VStack>
      }
    >
      {/* Primary Action Button */}
      <VStack padding={2} width="100%">
        <Button
          label="Add User"
          variant="primary"
          size="md"
          icon={<Plus size={18} />}
          href="/admin/users"
          width="100%"
        />
      </VStack>

      <SideNavSection title="Organization" isHeaderHidden>
        <SideNavItem
          label="Overview"
          icon={<LayoutGrid size={18} />}
          isSelected={pathname === "/admin"}
          href="/admin"
        />
        <SideNavItem
          label="Users & Mailboxes"
          icon={<Users size={18} />}
          isSelected={pathname === "/admin/users"}
          href="/admin/users"
        />
        <SideNavItem
          label="Storage & Quotas"
          icon={<Database size={18} />}
          isSelected={pathname === "/admin/storage"}
          href="/admin/storage"
        />
        <SideNavItem
          label="Domains & DNS"
          icon={<Globe size={18} />}
          isSelected={pathname === "/admin/domains"}
          href="/admin/domains"
        />
        <SideNavItem
          label="Aliases & Groups"
          icon={<Layers size={18} />}
          isSelected={pathname === "/admin/aliases"}
          href="/admin/aliases"
        />
        <SideNavItem
          label="Security & Audit"
          icon={<ShieldCheck size={18} />}
          isSelected={pathname === "/admin/security"}
          href="/admin/security"
        />
        <SideNavItem
          label="Settings & Profile"
          icon={<Settings size={18} />}
          isSelected={pathname === "/admin/settings"}
          href="/admin/settings"
        />
      </SideNavSection>
    </SideNav>
  )
}

// ─── Admin Shell Layout ──────────────────────────────────────────────────────

interface AdminShellProps {
  admin?: MailboxUser | null
  children: React.ReactNode
}

export function AdminShell({ admin, children }: AdminShellProps) {
  return (
    <AppShell
      height="fill"
      variant="elevated"
      contentPadding={0}
      topNav={<AdminTopNav admin={admin} />}
      sideNav={<AdminSideNav />}
    >
      {children}
    </AppShell>
  )
}
