"use client"

import { useState } from "react"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading, Text } from "@astryxdesign/core/Text"
import { Card } from "@astryxdesign/core/Card"
import { Button } from "@astryxdesign/core/Button"
import { Table, type TableColumn, pixel, proportional } from "@astryxdesign/core/Table"
import { Dialog } from "@astryxdesign/core/Dialog"
import { TextInput } from "@astryxdesign/core/TextInput"
import { Switch } from "@astryxdesign/core/Switch"
import { Plus, Users, AtSign, Trash2, Search } from "lucide-react"
import { mockCompanyAliases, mockDomains } from "@/lib/mock-data"
import type { Alias } from "@/types/mailbox"
import { AdminPageLayout } from "@/components/admin-page-layout"

interface AliasRow extends Alias, Record<string, unknown> {}

export default function AdminAliasesPage() {
  const [aliases, setAliases] = useState<AliasRow[]>(mockCompanyAliases as AliasRow[])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Form state
  const [selectedDomain, setSelectedDomain] = useState(mockDomains[0].name)
  const [aliasHandle, setAliasHandle] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [targetEmails, setTargetEmails] = useState("alex@enterprise.corp")
  const [isGroup, setIsGroup] = useState(false)
  const [sendAsAllowed, setSendAsAllowed] = useState(true)

  const filteredAliases = aliases.filter((a) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      a.address.toLowerCase().includes(q) ||
      a.displayName.toLowerCase().includes(q) ||
      (a.targetEmails || []).some((t) => t.toLowerCase().includes(q))
    )
  })

  const handleCreateAlias = () => {
    if (!aliasHandle.trim() || !displayName.trim()) return

    const newAlias: AliasRow = {
      id: `als_${Date.now()}`,
      address: `${aliasHandle.trim().toLowerCase()}@${selectedDomain}`,
      displayName: displayName.trim(),
      isActive: true,
      sendAsAllowed,
      type: isGroup ? "distribution_group" : "alias",
      targetEmails: targetEmails.split(",").map((s) => s.trim()),
      domainName: selectedDomain,
    }

    setAliases((prev) => [newAlias, ...prev])
    setIsCreateOpen(false)
    setAliasHandle("")
    setDisplayName("")
  }

  const handleDelete = (id: string) => {
    setAliases((prev) => prev.filter((a) => a.id !== id))
  }

  const columns: TableColumn<AliasRow>[] = [
    {
      key: "address",
      header: "Alias Address",
      width: pixel(240),
      renderCell: (item) => (
        <HStack gap={2} vAlign="center">
          {item.type === "distribution_group" ? (
            <Users size={18} />
          ) : (
            <AtSign size={18} />
          )}
          <VStack gap={0}>
            <Text type="body" weight="medium">
              {item.address}
            </Text>
            <Text type="supporting" color="secondary">
              {item.displayName}
            </Text>
          </VStack>
        </HStack>
      ),
    },
    {
      key: "type",
      header: "Routing Type",
      width: pixel(180),
      renderCell: (item) => (
        <Text type="body">
          {item.type === "distribution_group" ? "Distribution Group" : "Direct Alias"}
        </Text>
      ),
    },
    {
      key: "targets",
      header: "Delivered To Mailboxes",
      width: proportional(1, { minWidth: 240 }),
      renderCell: (item) => (
        <Text type="body" color="secondary">
          {(item.targetEmails || []).join(", ")}
        </Text>
      ),
    },
    {
      key: "sendAs",
      header: "Send As",
      width: pixel(120),
      renderCell: (item) => (
        <Text type="body" color={item.sendAsAllowed ? "primary" : "secondary"}>
          {item.sendAsAllowed ? "Allowed" : "Receive Only"}
        </Text>
      ),
    },
    {
      key: "actions",
      header: "",
      width: pixel(80),
      align: "end",
      renderCell: (item) => (
        <Button
          variant="destructive"
          size="sm"
          icon={<Trash2 size={16} />}
          label="Delete"
          isIconOnly
          onClick={() => handleDelete(item.id)}
        />
      ),
    },
  ]

  return (
    <AdminPageLayout
      title="Aliases & Groups"
      actions={
        <Button
          label="Create Alias / Group"
          variant="primary"
          size="sm"
          icon={<Plus size={16} />}
          onClick={() => setIsCreateOpen(true)}
        />
      }
    >
      {/* ── Table Card ── */}
      <Card padding={5} width="100%">
        <VStack gap={4} width="100%">
          <HStack hAlign="between" vAlign="center" width="100%">
            <TextInput
              label="Filter aliases"
              isLabelHidden
              type="search"
              placeholder="Search aliases by address or target..."
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              startIcon={<Search size={16} />}
              hasClear
              width={340}
              size="sm"
            />
            <Text type="body" color="secondary">
              {filteredAliases.length} aliases
            </Text>
          </HStack>

          <Table
            data={filteredAliases}
            columns={columns}
            idKey="id"
          />
        </VStack>
      </Card>

      {/* ── Dialog: Create Alias ── */}
      <Dialog
        isOpen={isCreateOpen}
        onOpenChange={(open) => {
          if (!open) setIsCreateOpen(false)
        }}
        width={480}
        purpose="form"
      >
        <VStack gap={4} padding={4} width="100%">
          <VStack gap={1}>
            <Heading level={3}>Create Alias or Distribution Group</Heading>
            <Text type="body" color="secondary" size="sm">
              Route incoming emails to one or multiple company employee inboxes.
            </Text>
          </VStack>

          <VStack gap={1}>
            <Text type="supporting" weight="medium" size="sm">
              Domain
            </Text>
            <HStack gap={2}>
              {mockDomains.map((dom) => (
                <Button
                  key={dom.id}
                  label={`@${dom.name}`}
                  variant={selectedDomain === dom.name ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedDomain(dom.name)}
                />
              ))}
            </HStack>
          </VStack>

          <TextInput
            label="Alias Handle"
            placeholder="e.g. sales, billing, press"
            value={aliasHandle}
            onChange={(val) => setAliasHandle(val)}
            isRequired
            width="100%"
          />

          <TextInput
            label="Display Name"
            placeholder="e.g. Global Sales Team"
            value={displayName}
            onChange={(val) => setDisplayName(val)}
            isRequired
            width="100%"
          />

          <TextInput
            label="Target Mailboxes (comma separated)"
            value={targetEmails}
            onChange={(val) => setTargetEmails(val)}
            isRequired
            width="100%"
          />

          <Switch
            label="Distribution Group (Multi-recipient delivery)"
            description="If enabled, copies of incoming messages are delivered to all listed mailboxes simultaneously."
            value={isGroup}
            onChange={(checked) => setIsGroup(checked)}
          />

          <Switch
            label="Allow Send As"
            description="Permit recipients to select this address as their outbound 'From' identity in webmail."
            value={sendAsAllowed}
            onChange={(checked) => setSendAsAllowed(checked)}
          />

          <HStack hAlign="end" gap={2}>
            <Button
              label="Cancel"
              variant="ghost"
              onClick={() => setIsCreateOpen(false)}
            />
            <Button
              label="Create Alias"
              variant="primary"
              isDisabled={!aliasHandle.trim() || !displayName.trim()}
              onClick={handleCreateAlias}
            />
          </HStack>
        </VStack>
      </Dialog>
    </AdminPageLayout>
  )
}
