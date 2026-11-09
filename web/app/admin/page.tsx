"use client"

import { useState, useEffect } from "react"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading, Text } from "@astryxdesign/core/Text"
import { Card } from "@astryxdesign/core/Card"
import { Button } from "@astryxdesign/core/Button"
import { Banner } from "@astryxdesign/core/Banner"
import { Grid } from "@astryxdesign/core/Grid"
import { Table, type TableColumn, pixel, proportional } from "@astryxdesign/core/Table"
import {
  Users,
  Database,
  Globe,
  Plus,
  ArrowRight,
} from "lucide-react"
import type { AuditLogEntry, MailboxUser, CustomDomain } from "@/types/mailbox"
import { formatDate } from "@/lib/format-date"
import { AdminPageLayout } from "@/components/admin-page-layout"
import { postarcApi } from "@/lib/postarc-api"

interface AuditRow extends AuditLogEntry, Record<string, unknown> {}

function formatActionName(action: string): string {
  switch (action) {
    case "password_reset":
      return "Password Reset"
    case "quota_updated":
      return "Quota Adjusted"
    case "user_suspended":
      return "User Suspended"
    case "user_created":
      return "User Created"
    case "dns_checked":
      return "DNS Check"
    case "domain_added":
      return "Domain Added"
    default:
      return "Security Event"
  }
}

export default function AdminOverviewPage() {
  const [users, setUsers] = useState<MailboxUser[]>([])
  const [domains, setDomains] = useState<CustomDomain[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditRow[]>([])

  useEffect(() => {
    postarcApi.getUsers().then((u) => setUsers(u || [])).catch(() => {})
    postarcApi.getDomains().then((d) => setDomains(d || [])).catch(() => {})
    postarcApi.getAuditLogs().then((l) => setAuditLogs((l as AuditRow[]) || [])).catch(() => {})
  }, [])

  const totalUsedBytes = users.reduce((acc, u) => acc + (u.storageUsedBytes || 0), 0)
  const usedGB = (totalUsedBytes / (1024 * 1024 * 1024)).toFixed(1)

  const criticalUsers = users.filter(
    (u) => u.storageTotalBytes > 0 && u.storageUsedBytes / u.storageTotalBytes >= 0.95
  )

  const auditColumns: TableColumn<AuditRow>[] = [
    {
      key: "action",
      header: "Action",
      width: pixel(160),
      renderCell: (item) => (
        <Text type="body" weight="medium">
          {formatActionName(item.action)}
        </Text>
      ),
    },
    {
      key: "targetEmail",
      header: "Target Account",
      width: pixel(200),
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
      header: "Initiated By",
      width: pixel(180),
      renderCell: (item) => (
        <Text type="body" color="secondary">
          {item.actorEmail}
        </Text>
      ),
    },
    {
      key: "timestamp",
      header: "Date",
      width: pixel(120),
      align: "end",
      renderCell: (item) => (
        <Text type="body" color="secondary">
          {formatDate(item.timestamp)}
        </Text>
      ),
    },
  ]

  return (
    <AdminPageLayout
      title="Overview"
      actions={
        <HStack gap={2}>
          <Button
            label="Add User"
            variant="primary"
            size="sm"
            icon={<Plus size={16} />}
            href="/admin/users"
          />
          <Button
            label="Storage"
            variant="secondary"
            size="sm"
            icon={<Database size={16} />}
            href="/admin/storage"
          />
        </HStack>
      }
    >
      {/* ── Near-Capacity Warning Banner ── */}
      {criticalUsers.length > 0 && (
        <Banner
          status="warning"
          title={`${criticalUsers.length} mailbox is at 95% capacity.`}
          endContent={
            <Button
              label="Adjust Quota"
              variant="secondary"
              size="sm"
              href="/admin/storage"
            />
          }
          container="card"
          isDismissable
        />
      )}

      {/* ── Metric Cards ── */}
      <Grid columns={{ minWidth: 200, max: 3 }} gap={4} width="100%">
        <Card padding={4} width="100%">
          <VStack gap={1} width="100%">
            <HStack hAlign="between" vAlign="center">
              <Text type="supporting" color="secondary">
                Mailboxes
              </Text>
              <Users size={18} />
            </HStack>
            <Heading level={2}>{users.length}</Heading>
          </VStack>
        </Card>

        <Card padding={4} width="100%">
          <VStack gap={1} width="100%">
            <HStack hAlign="between" vAlign="center">
              <Text type="supporting" color="secondary">
                Storage Used
              </Text>
              <Database size={18} />
            </HStack>
            <Heading level={2}>{usedGB} GB</Heading>
          </VStack>
        </Card>

        <Card padding={4} width="100%">
          <VStack gap={1} width="100%">
            <HStack hAlign="between" vAlign="center">
              <Text type="supporting" color="secondary">
                Domains
              </Text>
              <Globe size={18} />
            </HStack>
            <Heading level={2}>{domains.length}</Heading>
          </VStack>
        </Card>
      </Grid>

      {/* ── Recent Events ── */}
      <Card padding={5} width="100%">
        <VStack gap={4} width="100%">
          <HStack hAlign="between" vAlign="center" width="100%">
            <Heading level={3}>Recent Events</Heading>
            <Button
              label="View All"
              variant="ghost"
              size="sm"
              icon={<ArrowRight size={16} />}
              href="/admin/security"
            />
          </HStack>

          <Table
            data={auditLogs.slice(0, 5)}
            columns={auditColumns}
            idKey="id"
          />
        </VStack>
      </Card>
    </AdminPageLayout>
  )
}
