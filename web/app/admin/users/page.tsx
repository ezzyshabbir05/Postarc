"use client"

import { useState } from "react"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading, Text } from "@astryxdesign/core/Text"
import { Card } from "@astryxdesign/core/Card"
import { Button } from "@astryxdesign/core/Button"
import { Banner } from "@astryxdesign/core/Banner"
import { Table, type TableColumn, pixel, proportional } from "@astryxdesign/core/Table"
import { Dialog } from "@astryxdesign/core/Dialog"
import { TextInput } from "@astryxdesign/core/TextInput"
import { Switch } from "@astryxdesign/core/Switch"
import { Avatar } from "@astryxdesign/core/Avatar"
import { DropdownMenu } from "@astryxdesign/core/DropdownMenu"
import { Plus, MoreHorizontal, Search } from "lucide-react"
import { mockCompanyUsers, mockTenant, mockOrganization, mockDomains } from "@/lib/mock-data"
import type { MailboxUser, UserStatus } from "@/types/mailbox"
import { formatDate } from "@/lib/format-date"
import { AdminPageLayout } from "@/components/admin-page-layout"

interface UserRow extends MailboxUser, Record<string, unknown> {}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>(mockCompanyUsers as UserRow[])
  const [searchQuery, setSearchQuery] = useState("")

  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [isEditQuotaOpen, setIsEditQuotaOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null)

  // Add User Form state
  const [newFullName, setNewFullName] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("TempPass#2026!")
  const [newDomain, setNewDomain] = useState(mockDomains[0].name)
  const [newQuotaGB, setNewQuotaGB] = useState(15)
  const [newMustChangePassword, setNewMustChangePassword] = useState(true)
  const [newAllowImapSmtp, setNewAllowImapSmtp] = useState(true)
  const [newIsAdmin, setNewIsAdmin] = useState(false)

  // Reset Password State
  const [tempPassword, setTempPassword] = useState("")
  const [resetMustChange, setResetMustChange] = useState(true)
  const [auditSuccessBanner, setAuditSuccessBanner] = useState<string | null>(null)

  // Edit Quota State
  const [editedQuotaGB, setEditedQuotaGB] = useState(15)

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    )
  })

  const handleAddUser = () => {
    if (!newFullName.trim() || !newUsername.trim() || !newPassword) return

    const email = `${newUsername.trim().toLowerCase()}@${newDomain}`
    const newUser: UserRow = {
      id: `usr_${Date.now()}`,
      fullName: newFullName.trim(),
      email,
      role: newIsAdmin ? "admin" : "member",
      status: newMustChangePassword ? "pending_password_change" : "active",
      avatarUrl: null,
      storageUsedBytes: 0,
      storageTotalBytes: newQuotaGB * 1024 * 1024 * 1024,
      allowImapSmtp: newAllowImapSmtp,
      mustChangePassword: newMustChangePassword,
      lastLoginAt: null,
      createdAt: new Date().toISOString(),
      organization: mockOrganization,
      tenant: mockTenant,
      aliases: [],
      appPasswords: [],
    }

    setUsers((prev) => [newUser, ...prev])
    setAuditSuccessBanner(
      `User ${email} provisioned with ${newQuotaGB} GB storage quota. Temporary credentials active.`
    )
    setIsAddUserOpen(false)
    setNewFullName("")
    setNewUsername("")
    setNewPassword("TempPass#2026!")
  }

  const handleOpenResetPassword = (user: UserRow) => {
    setSelectedUser(user)
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#"
    const randomPass = Array.from({ length: 12 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("")
    setTempPassword(randomPass)
    setResetMustChange(true)
    setIsResetPasswordOpen(true)
  }

  const handleConfirmResetPassword = () => {
    if (!selectedUser) return
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? { ...u, mustChangePassword: resetMustChange, status: "pending_password_change" }
          : u
      )
    )
    setAuditSuccessBanner(
      `Admin [admin@enterprise.corp] reset password for [${selectedUser.email}] on ${formatDate(new Date())} from IP 192.168.1.5 (Audit Entry #AUD-${Date.now().toString().slice(-4)}).`
    )
    setIsResetPasswordOpen(false)
  }

  const handleOpenEditQuota = (user: UserRow) => {
    setSelectedUser(user)
    setEditedQuotaGB(Math.round(user.storageTotalBytes / (1024 * 1024 * 1024)))
    setIsEditQuotaOpen(true)
  }

  const handleConfirmEditQuota = () => {
    if (!selectedUser) return
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? { ...u, storageTotalBytes: editedQuotaGB * 1024 * 1024 * 1024 }
          : u
      )
    )
    setAuditSuccessBanner(
      `Quota for ${selectedUser.email} adjusted to ${editedQuotaGB} GB.`
    )
    setIsEditQuotaOpen(false)
  }

  const handleToggleSuspend = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus: UserStatus = u.status === "suspended" ? "active" : "suspended"
          return {
            ...u,
            status: nextStatus,
            allowImapSmtp: nextStatus === "active",
          }
        }
        return u
      })
    )
  }

  const handleToggleImap = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, allowImapSmtp: !u.allowImapSmtp } : u))
    )
  }

  const columns: TableColumn<UserRow>[] = [
    {
      key: "fullName",
      header: "Employee & Mailbox",
      width: proportional(1, { minWidth: 240 }),
      renderCell: (item) => (
        <HStack gap={3} vAlign="center">
          <Avatar name={item.fullName} size="sm" />
          <VStack gap={0}>
            <HStack gap={2} vAlign="center">
              <Text type="body" weight="medium">
                {item.fullName}
              </Text>
              {item.role === "admin" && (
                <Text type="supporting" weight="medium" color="secondary">
                  (Admin)
                </Text>
              )}
            </HStack>
            <Text type="supporting" color="secondary">
              {item.email}
            </Text>
          </VStack>
        </HStack>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: pixel(150),
      renderCell: (item) => (
        <Text
          type="body"
          color={item.status === "suspended" ? "secondary" : "primary"}
        >
          {item.status === "suspended"
            ? "Suspended"
            : item.status === "pending_password_change" || item.mustChangePassword
            ? "Pending Password"
            : "Active"}
        </Text>
      ),
    },
    {
      key: "storage",
      header: "Storage",
      width: pixel(180),
      renderCell: (item) => {
        const usedGB = (item.storageUsedBytes / (1024 * 1024 * 1024)).toFixed(1)
        const totalGB = (item.storageTotalBytes / (1024 * 1024 * 1024)).toFixed(0)
        const pct = Math.round((item.storageUsedBytes / item.storageTotalBytes) * 100)

        return (
          <Text type="body" color={pct >= 95 ? "primary" : "secondary"} weight={pct >= 95 ? "bold" : "normal"}>
            {usedGB} / {totalGB} GB ({pct}%)
          </Text>
        )
      },
    },
    {
      key: "allowImapSmtp",
      header: "IMAP/SMTP",
      width: pixel(120),
      renderCell: (item) => (
        <Switch
          label="IMAP Sync"
          isLabelHidden
          size="sm"
          value={item.allowImapSmtp}
          isDisabled={item.status === "suspended"}
          onChange={() => handleToggleImap(item.id)}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      width: pixel(100),
      align: "end",
      renderCell: (item) => (
        <DropdownMenu
          alignment="end"
          renderTrigger={(triggerProps) => (
            <Button
              variant="ghost"
              size="sm"
              icon={<MoreHorizontal size={18} />}
              label="Options"
              isIconOnly
              {...triggerProps}
            />
          )}
          items={[
            {
              label: "Reset Password (Audited)",
              onClick: () => handleOpenResetPassword(item),
            },
            {
              label: "Adjust Storage Quota",
              onClick: () => handleOpenEditQuota(item),
            },
            { type: "divider" },
            {
              label: item.status === "suspended" ? "Reactivate Account" : "Suspend Account",
              variant: item.status === "suspended" ? "default" : "destructive",
              onClick: () => handleToggleSuspend(item.id),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <AdminPageLayout
      title="Users & Mailboxes"
      actions={
        <Button
          label="Add User"
          variant="primary"
          size="sm"
          icon={<Plus size={16} />}
          onClick={() => setIsAddUserOpen(true)}
        />
      }
    >
      {/* ── Audit notification banner ── */}
      {auditSuccessBanner && (
        <Banner
          status="success"
          title="Security Audit Logged"
          description={auditSuccessBanner}
          container="card"
          isDismissable
          onDismiss={() => setAuditSuccessBanner(null)}
        />
      )}

      {/* ── Users Table Card ── */}
      <Card padding={5} width="100%">
        <VStack gap={4} width="100%">
          <HStack hAlign="between" vAlign="center" width="100%">
            <TextInput
              label="Filter users"
              isLabelHidden
              type="search"
              placeholder="Filter mailboxes by name or email..."
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              startIcon={<Search size={16} />}
              hasClear
              width={340}
              size="sm"
            />
            <Text type="body" color="secondary">
              {filteredUsers.length} mailboxes
            </Text>
          </HStack>

          <Table
            data={filteredUsers}
            columns={columns}
            idKey="id"
          />
        </VStack>
      </Card>

      {/* ── Dialog: Add New User ── */}
      <Dialog
        isOpen={isAddUserOpen}
        onOpenChange={(open) => {
          if (!open) setIsAddUserOpen(false)
        }}
        width={500}
        purpose="form"
      >
        <VStack gap={4} padding={4} width="100%">
          <Heading level={3}>Add Mailbox</Heading>

          <VStack gap={1}>
            <Text type="supporting" weight="medium">
              Domain
            </Text>
            <HStack gap={2}>
              {mockDomains.map((dom) => (
                <Button
                  key={dom.id}
                  label={`@${dom.name}`}
                  variant={newDomain === dom.name ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setNewDomain(dom.name)}
                />
              ))}
            </HStack>
          </VStack>

          <TextInput
            label="Full Name"
            placeholder="e.g. Rachel Green"
            value={newFullName}
            onChange={(val) => setNewFullName(val)}
            isRequired
            width="100%"
          />

          <TextInput
            label="Mailbox Username"
            placeholder="rachel"
            value={newUsername}
            onChange={(val) => setNewUsername(val)}
            isRequired
            width="100%"
          />

          <TextInput
            label="Initial Password"
            value={newPassword}
            onChange={(val) => setNewPassword(val)}
            isRequired
            width="100%"
          />

          <VStack gap={2}>
            <Text type="supporting" weight="medium">
              Mailbox Storage Quota
            </Text>
            <HStack gap={2}>
              {[5, 15, 25, 50].map((gb) => (
                <Button
                  key={gb}
                  label={`${gb} GB`}
                  variant={newQuotaGB === gb ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setNewQuotaGB(gb)}
                />
              ))}
            </HStack>
          </VStack>

          <Switch
            label="Must change password on first login"
            value={newMustChangePassword}
            onChange={(checked) => setNewMustChangePassword(checked)}
          />

          <Switch
            label="Allow IMAP / SMTP client access"
            value={newAllowImapSmtp}
            onChange={(checked) => setNewAllowImapSmtp(checked)}
          />

          <Switch
            label="Administrator role"
            value={newIsAdmin}
            onChange={(checked) => setNewIsAdmin(checked)}
          />

          <HStack hAlign="end" gap={2}>
            <Button
              label="Cancel"
              variant="ghost"
              onClick={() => setIsAddUserOpen(false)}
            />
            <Button
              label="Provision Mailbox"
              variant="primary"
              isDisabled={!newFullName.trim() || !newUsername.trim() || !newPassword}
              onClick={handleAddUser}
            />
          </HStack>
        </VStack>
      </Dialog>

      {/* ── Dialog: Reset Password (With Audit Log Notice) ── */}
      <Dialog
        isOpen={isResetPasswordOpen}
        onOpenChange={(open) => {
          if (!open) setIsResetPasswordOpen(false)
        }}
        width={480}
        purpose="form"
      >
        <VStack gap={4} padding={4} width="100%">
          <Heading level={3}>Reset Password</Heading>

          <Card padding={3} variant="muted" width="100%">
            <VStack gap={1}>
              <Text type="supporting" color="secondary">
                Temporary Password
              </Text>
              <Text type="code" size="lg" weight="bold">
                {tempPassword}
              </Text>
            </VStack>
          </Card>

          <Switch
            label="Must change password on first login"
            value={resetMustChange}
            onChange={(checked) => setResetMustChange(checked)}
          />

          <HStack hAlign="end" gap={2}>
            <Button
              label="Cancel"
              variant="ghost"
              onClick={() => setIsResetPasswordOpen(false)}
            />
            <Button
              label="Confirm Reset"
              variant="primary"
              onClick={handleConfirmResetPassword}
            />
          </HStack>
        </VStack>
      </Dialog>

      {/* ── Dialog: Adjust Storage Quota ── */}
      <Dialog
        isOpen={isEditQuotaOpen}
        onOpenChange={(open) => {
          if (!open) setIsEditQuotaOpen(false)
        }}
        width={440}
        purpose="form"
      >
        <VStack gap={4} padding={4} width="100%">
          <Heading level={3}>Adjust Storage Quota</Heading>

          <VStack gap={2}>
            <Text type="supporting" color="secondary">
              Mailbox Quota
            </Text>
            <HStack gap={2}>
              {[5, 10, 15, 25, 50].map((gb) => (
                <Button
                  key={gb}
                  label={`${gb} GB`}
                  variant={editedQuotaGB === gb ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setEditedQuotaGB(gb)}
                />
              ))}
            </HStack>
          </VStack>

          <HStack hAlign="end" gap={2}>
            <Button
              label="Cancel"
              variant="ghost"
              onClick={() => setIsEditQuotaOpen(false)}
            />
            <Button
              label="Save Quota"
              variant="primary"
              onClick={handleConfirmEditQuota}
            />
          </HStack>
        </VStack>
      </Dialog>
    </AdminPageLayout>
  )
}
