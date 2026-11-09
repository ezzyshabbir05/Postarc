"use client"

import { useState, useEffect } from "react"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading, Text } from "@astryxdesign/core/Text"
import { Card } from "@astryxdesign/core/Card"
import { Switch } from "@astryxdesign/core/Switch"
import { Banner } from "@astryxdesign/core/Banner"
import { TextInput } from "@astryxdesign/core/TextInput"
import { Table, type TableColumn, pixel, proportional } from "@astryxdesign/core/Table"
import { ShieldCheck, Search } from "lucide-react"
import type { AuditLogEntry } from "@/types/mailbox"
import { formatDateTime } from "@/lib/format-date"
import { AdminPageLayout } from "@/components/admin-page-layout"
import { postarcApi } from "@/lib/postarc-api"

interface AuditRow extends AuditLogEntry, Record<string, unknown> {}

export default function AdminSecurityPage() {
  const [enforce2FA, setEnforce2FA] = useState(false)
  const [globalImapSmtp, setGlobalImapSmtp] = useState(true)
  const [bannerMessage, setBannerMessage] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [auditLogs, setAuditLogs] = useState<AuditRow[]>([])

  useEffect(() => {
    postarcApi.getSecuritySettings().then((s) => {
      setEnforce2FA(Boolean(s.enforce2FA))
      setGlobalImapSmtp(Boolean(s.allowImapSmtpGlobal))
    }).catch(console.error)

    postarcApi.getAuditLogs().then((logs) => {
      if (logs) setAuditLogs(logs as AuditRow[])
    }).catch(console.error)
  }, [])

  const handleToggle2FA = (checked: boolean) => {
    setEnforce2FA(checked)
    postarcApi.updateSecuritySettings({ enforce2fa: checked }).catch(console.error)
    setBannerMessage(
      checked
        ? "Two-Factor Authentication policy enforced for all organization members on Postarc Engine."
        : "Two-Factor Authentication policy relaxed to optional."
    )
  }

  const handleToggleImap = (checked: boolean) => {
    setGlobalImapSmtp(checked)
    postarcApi.updateSecuritySettings({ requireTlsForOutbound: checked }).catch(console.error)
    setBannerMessage(
      checked
        ? "Third-party IMAP/SMTP access enabled company-wide."
        : "Third-party IMAP/SMTP access disabled company-wide."
    )
  }

  const filteredLogs = auditLogs.filter((log) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      log.action.toLowerCase().includes(q) ||
      log.targetEmail.toLowerCase().includes(q) ||
      log.actorEmail.toLowerCase().includes(q) ||
      (log.details || "").toLowerCase().includes(q)
    )
  })

  const columns: TableColumn<AuditRow>[] = [
    {
      key: "action",
      header: "Action",
      width: pixel(180),
      renderCell: (item) => (
        <Text type="body" weight="medium">
          {item.action === "password_reset"
            ? "Password Reset"
            : item.action === "quota_updated"
            ? "Quota Adjusted"
            : item.action === "user_suspended"
            ? "User Suspended"
            : item.action === "dns_checked"
            ? "DNS Verified"
            : item.action === "domain_added"
            ? "Domain Added"
            : "Security Event"}
        </Text>
      ),
    },
    {
      key: "targetEmail",
      header: "Target Account",
      width: pixel(220),
      renderCell: (item) => (
        <Text type="body">
          {item.targetEmail}
        </Text>
      ),
    },
    {
      key: "details",
      header: "Details",
      width: proportional(1, { minWidth: 260 }),
      renderCell: (item) => (
        <Text type="body" color="secondary">
          {item.details || "Administrative modification logged."}
        </Text>
      ),
    },
    {
      key: "actorEmail",
      header: "Actor (IP Address)",
      width: pixel(220),
      renderCell: (item) => (
        <Text type="body" color="secondary">
          {item.actorEmail} ({item.ipAddress})
        </Text>
      ),
    },
    {
      key: "timestamp",
      header: "Timestamp",
      width: pixel(180),
      align: "end",
      renderCell: (item) => (
        <Text type="body" color="secondary">
          {formatDateTime(item.timestamp)}
        </Text>
      ),
    },
  ]

  return (
    <AdminPageLayout
      title="Security & Audit"
      description="Authentication policies, client access settings, and audit logs."
    >
      {/* ── Policy Change Banner ── */}
      {bannerMessage && (
        <Banner
          status="info"
          title="Policy Updated"
          description={bannerMessage}
          container="card"
          isDismissable
          onDismiss={() => setBannerMessage(null)}
        />
      )}

      {/* ── Security Policy Switches ── */}
      <Card padding={5} width="100%">
        <VStack gap={4} width="100%">
          <Heading level={3}>Access Policies</Heading>

          <Switch
            label="Enforce Two-Factor Authentication (2FA)"
            description="Require all users to authenticate with a TOTP app on login."
            value={enforce2FA}
            onChange={handleToggle2FA}
          />

          <Switch
            label="Allow IMAP / SMTP Access"
            description="Permit desktop and mobile mail clients via App Passwords."
            value={globalImapSmtp}
            onChange={handleToggleImap}
          />
        </VStack>
      </Card>

      {/* ── Employee Privacy Notice ── */}
      <Card padding={4} variant="muted" width="100%">
        <HStack gap={3} vAlign="center">
          <ShieldCheck size={20} />
          <Text type="body" color="secondary">
            Postarc enforces zero-backdoor mailbox privacy: administrators cannot view or export employee email contents.
          </Text>
        </HStack>
      </Card>

      {/* ── Security Audit Log Card ── */}
      <Card padding={5} width="100%">
        <VStack gap={4} width="100%">
          <Heading level={3}>Audit Trail</Heading>

          <HStack hAlign="between" vAlign="center" width="100%">
            <TextInput
              label="Filter audit logs"
              isLabelHidden
              type="search"
              placeholder="Filter logs by actor, target, or action..."
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              startIcon={<Search size={16} />}
              hasClear
              width={340}
              size="sm"
            />
            <Text type="body" color="secondary">
              {filteredLogs.length} events
            </Text>
          </HStack>

          <Table
            data={filteredLogs as AuditRow[]}
            columns={columns}
            idKey="id"
          />
        </VStack>
      </Card>
    </AdminPageLayout>
  )
}
