"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AppShell } from "@astryxdesign/core/AppShell";
import { TopNav, TopNavHeading } from "@astryxdesign/core/TopNav";
import { SideNav, SideNavItem, SideNavSection } from "@astryxdesign/core/SideNav";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Badge } from "@astryxdesign/core/Badge";
import { Avatar } from "@astryxdesign/core/Avatar";
import { DropdownMenu } from "@astryxdesign/core/DropdownMenu";
import { Button } from "@astryxdesign/core/Button";
import { ProgressBar } from "@astryxdesign/core/ProgressBar";
import { VStack, HStack } from "@astryxdesign/core/Layout";
import { Text } from "@astryxdesign/core/Text";
import {
  Search,
  Globe,
  Settings,
  Inbox,
  Star,
  Clock,
  Send,
  FileText,
  Archive,
  AlertCircle,
  Trash2,
  Tag,
  Layers,
  SquarePen,
} from "lucide-react";
import type { MailboxUser } from "@/types/mailbox";

// ─── Top Navigation Component ───────────────────────────────────────────────

interface DashboardTopNavProps {
  user: MailboxUser | null;
}

function DashboardTopNav({ user }: DashboardTopNavProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const displayName = user?.fullName || "Alex Rivera";
  const email = user?.email || "alex@enterprise.corp";
  const domainName = user?.tenant?.domain?.name || "enterprise.corp";
  const isDomainVerified = user?.tenant?.domain?.isVerified ?? true;

  return (
    <TopNav
      label="Main navigation"
      heading={
        <TopNavHeading
          heading="Postarc Mail"
          headingHref="/dashboard"
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
          width={440}
          size="md"
        />
      }
      endContent={
        <HStack gap={3} vAlign="center">
          <Badge
            label={domainName}
            variant={isDomainVerified ? "success" : "warning"}
            icon={<Globe size={14} />}
          />
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
                src={
                  user?.avatarUrl ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJIYCuvmrPJP4avHqKlVrF8Wpkg6sCZ0Wy6WIbii-zV2NqiHKhWsKCr00&s=10"
                }
                size={32}
                tooltip={`${displayName} (${email})`}
                {...triggerProps}
              />
            )}
            items={[
              { label: "My Mailbox", href: "/dashboard" },
              { label: "Domain & DNS Setup", href: "/dashboard/settings/dns" },
              { label: "Manage Aliases", href: "/dashboard/aliases" },
              { label: "Settings", href: "/dashboard/settings" },
              { type: "divider" },
              { label: "Sign out", href: "/", variant: "destructive" },
            ]}
          />
        </HStack>
      }
    />
  );
}

// ─── Side Navigation Component ──────────────────────────────────────────────

interface DashboardSideNavProps {
  user: MailboxUser | null;
}

function DashboardSideNav({ user }: DashboardSideNavProps) {
  const pathname = usePathname();

  // Storage calculations
  const usedBytes = user?.storageUsedBytes ?? 1.45 * 1024 * 1024 * 1024;
  const totalBytes = user?.storageTotalBytes ?? 15 * 1024 * 1024 * 1024;
  const usedGB = (usedBytes / (1024 * 1024 * 1024)).toFixed(1);
  const totalGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(0);
  const percentageUsed = Math.min(
    Math.round((usedBytes / totalBytes) * 100),
    100
  );

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
            icon={<SquarePen size={18} />}
            width="100%"
          />
        </VStack>
      }
      footer={
        <VStack gap={1} width="100%" padding={2}>
          <HStack hAlign="between">
            <Text type="supporting" color="secondary">
              Storage
            </Text>
            <Text type="supporting" color="secondary">
              {usedGB} GB of {totalGB} GB
            </Text>
          </HStack>
          <ProgressBar
            label="Storage used"
            isLabelHidden
            value={percentageUsed}
            max={100}
            variant="accent"
          />
        </VStack>
      }
    >
      {/* ── Main Mailbox Folders ── */}
      <SideNavSection title="Mail" isHeaderHidden>
        <SideNavItem
          label="Inbox"
          icon={<Inbox size={18} />}
          isSelected={pathname === "/dashboard"}
          href="/dashboard"
          endContent={<Badge label="12" variant="neutral" />}
        />
        <SideNavItem
          label="Starred"
          icon={<Star size={18} />}
          isSelected={pathname === "/dashboard/starred"}
          href="/dashboard/starred"
        />
        <SideNavItem
          label="Snoozed"
          icon={<Clock size={18} />}
          isSelected={pathname === "/dashboard/snoozed"}
          href="/dashboard/snoozed"
        />
        <SideNavItem
          label="Sent"
          icon={<Send size={18} />}
          isSelected={pathname === "/dashboard/sent"}
          href="/dashboard/sent"
        />
        <SideNavItem
          label="Drafts"
          icon={<FileText size={18} />}
          isSelected={pathname === "/dashboard/drafts"}
          href="/dashboard/drafts"
          endContent={<Badge label="2" variant="neutral" />}
        />
        <SideNavItem
          label="Archive"
          icon={<Archive size={18} />}
          isSelected={pathname === "/dashboard/archive"}
          href="/dashboard/archive"
        />
        <SideNavItem
          label="Spam"
          icon={<AlertCircle size={18} />}
          isSelected={pathname === "/dashboard/spam"}
          href="/dashboard/spam"
        />
        <SideNavItem
          label="Trash"
          icon={<Trash2 size={18} />}
          isSelected={pathname === "/dashboard/trash"}
          href="/dashboard/trash"
        />
      </SideNavSection>

      {/* ── Labels ── */}
      <SideNavSection title="Labels">
        <SideNavItem
          label="Clients"
          icon={<Tag size={18} />}
          isSelected={pathname === "/dashboard/labels/clients"}
          href="/dashboard/labels/clients"
        />
        <SideNavItem
          label="Invoices"
          icon={<Tag size={18} />}
          isSelected={pathname === "/dashboard/labels/invoices"}
          href="/dashboard/labels/invoices"
        />
        <SideNavItem
          label="Personal"
          icon={<Tag size={18} />}
          isSelected={pathname === "/dashboard/labels/personal"}
          href="/dashboard/labels/personal"
        />
      </SideNavSection>

      {/* ── Enterprise Management ── */}
      <SideNavSection title="Management">
        <SideNavItem
          label="Domain & DNS"
          icon={<Globe size={18} />}
          isSelected={pathname.startsWith("/dashboard/settings/dns")}
          href="/dashboard/settings/dns"
          endContent={<Badge label="DNS" variant="info" />}
        />
        <SideNavItem
          label="Aliases"
          icon={<Layers size={18} />}
          isSelected={pathname === "/dashboard/aliases"}
          href="/dashboard/aliases"
        />
        <SideNavItem
          label="Settings"
          icon={<Settings size={18} />}
          isSelected={pathname === "/dashboard/settings"}
          href="/dashboard/settings"
        />
      </SideNavSection>
    </SideNav>
  );
}

// ─── Unified Dashboard Shell Component ─────────────────────────────────────

interface DashboardShellProps {
  user: MailboxUser | null;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <AppShell
      height="fill"
      variant="elevated"
      contentPadding={4}
      topNav={<DashboardTopNav user={user} />}
      sideNav={<DashboardSideNav user={user} />}
    >
      {children}
    </AppShell>
  );
}
