"use client"

import { useState } from "react"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading, Text } from "@astryxdesign/core/Text"
import { Card } from "@astryxdesign/core/Card"
import { NumberInput } from "@astryxdesign/core/NumberInput"
import { ProgressBar } from "@astryxdesign/core/ProgressBar"
import { Table, type TableColumn, pixel, proportional } from "@astryxdesign/core/Table"
import { Avatar } from "@astryxdesign/core/Avatar"
import { mockCompanyUsers } from "@/lib/mock-data"
import type { MailboxUser } from "@/types/mailbox"
import { AdminPageLayout } from "@/components/admin-page-layout"

interface StorageRow extends MailboxUser, Record<string, unknown> {}

export default function AdminStoragePoolPage() {
  const [users, setUsers] = useState<StorageRow[]>(mockCompanyUsers as StorageRow[])

  const handleSetQuota = (userId: string, newGB: number) => {
    if (!newGB || newGB < 1) return
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            storageTotalBytes: newGB * 1024 * 1024 * 1024,
          }
        }
        return u
      })
    )
  }

  const columns: TableColumn<StorageRow>[] = [
    {
      key: "fullName",
      header: "Employee",
      width: proportional(1, { minWidth: 200 }),
      renderCell: (item) => (
        <HStack gap={2} vAlign="center">
          <Avatar name={item.fullName} size="sm" />
          <VStack gap={0}>
            <Text type="body" weight="medium">
              {item.fullName}
            </Text>
            <Text type="supporting" color="secondary">
              {item.email}
            </Text>
          </VStack>
        </HStack>
      ),
    },
    {
      key: "quotaGB",
      header: "Storage Limit",
      width: pixel(180),
      renderCell: (item) => {
        const quotaGB = Math.round(item.storageTotalBytes / (1024 * 1024 * 1024))
        return (
          <NumberInput
            label={`Storage limit for ${item.fullName}`}
            isLabelHidden
            value={quotaGB}
            min={1}
            max={500}
            step={5}
            units="GB"
            width={120}
            size="sm"
            isIntegerOnly
            onChange={(val) => handleSetQuota(item.id, val)}
          />
        )
      },
    },
    {
      key: "used",
      header: "Usage",
      width: pixel(200),
      renderCell: (item) => {
        const usedGB = (item.storageUsedBytes / (1024 * 1024 * 1024)).toFixed(1)
        const totalGB = (item.storageTotalBytes / (1024 * 1024 * 1024)).toFixed(0)
        const pct = Math.round((item.storageUsedBytes / item.storageTotalBytes) * 100)

        return (
          <VStack gap={1} width="100%">
            <HStack hAlign="between" vAlign="center">
              <Text type="body">
                {usedGB} GB of {totalGB} GB
              </Text>
              <Text type="supporting" color="secondary">
                {pct}%
              </Text>
            </HStack>
            <ProgressBar
              label="Storage usage"
              isLabelHidden
              value={pct}
              max={100}
              variant={pct >= 95 ? "error" : pct >= 80 ? "warning" : "accent"}
            />
          </VStack>
        )
      },
    },
    {
      key: "status",
      header: "Status",
      width: pixel(110),
      align: "end",
      renderCell: (item) => {
        const pct = Math.round((item.storageUsedBytes / item.storageTotalBytes) * 100)
        if (pct >= 95) {
          return (
            <Text type="body" weight="semibold" color="accent">
              Critical
            </Text>
          )
        }
        if (pct >= 80) {
          return (
            <Text type="body" weight="medium">
              Warning
            </Text>
          )
        }
        return (
          <Text type="body" color="secondary">
            Normal
          </Text>
        )
      },
    },
  ]

  return (
    <AdminPageLayout title="Storage & Quotas">
      {/* ── Employee Quotas Table ── */}
      <Card padding={5} width="100%">
        <VStack gap={4} width="100%">
          <Heading level={3}>Employee Mailboxes</Heading>
          <Table
            data={users}
            columns={columns}
            idKey="id"
          />
        </VStack>
      </Card>
    </AdminPageLayout>
  )
}
