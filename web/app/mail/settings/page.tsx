"use client"

import { useState, useEffect } from "react"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading, Text } from "@astryxdesign/core/Text"
import { Card } from "@astryxdesign/core/Card"
import { TextInput } from "@astryxdesign/core/TextInput"
import { TextArea } from "@astryxdesign/core/TextArea"
import { Button } from "@astryxdesign/core/Button"
import { Badge } from "@astryxdesign/core/Badge"
import { Banner } from "@astryxdesign/core/Banner"
import { Switch } from "@astryxdesign/core/Switch"
import { Table, type TableColumn, pixel, proportional } from "@astryxdesign/core/Table"
import { Dialog } from "@astryxdesign/core/Dialog"
import {
  Plus,
  Trash2,
  ClipboardCheck,
  Smartphone,
  Monitor,
  CheckCircle,
  Palmtree,
} from "lucide-react"
import type { AppPassword } from "@/types/mailbox"
import { formatDate } from "@/lib/format-date"
import { useMail } from "@/components/mail-context"
import { postarcApi } from "@/lib/postarc-api"

interface AppPasswordRow extends AppPassword, Record<string, unknown> {}

export default function MailboxSettingsPage() {
  const [appPasswords, setAppPasswords] = useState<AppPasswordRow[]>([])
  const [currentUserEmail, setCurrentUserEmail] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newAppName, setNewAppName] = useState("")
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const serverHost = currentUserEmail.includes("@")
    ? `mail.${currentUserEmail.split("@")[1]}`
    : (typeof window !== "undefined" ? window.location.hostname : "mail.yourdomain.com")
  useEffect(() => {
    const list = postarcApi.getAppPasswords()
    setAppPasswords(
      list.map((p) => ({
        id: p.id,
        name: p.name,
        tokenPreview: `postarc_app_••••`,
        createdAt: p.createdAt,
        lastUsedAt: p.lastUsedAt || "Never",
      }))
    )

    const user = postarcApi.getCurrentUser()
    if (user?.email) {
      setCurrentUserEmail(user.email)
    }

    if (typeof window !== "undefined") {
      const savedSig = localStorage.getItem("postarc_signature")
      if (savedSig) setSignature(savedSig)
    }
  }, [])

  // Signature state
  const [signature, setSignature] = useState("")
  const [isSaved, setIsSaved] = useState(false)

  // Vacation Auto-Responder State (Roundcube / JMAP Vacation RFC 8621)
  const { vacationConfig, setVacationConfig } = useMail()
  const [isVacationEnabled, setIsVacationEnabled] = useState(vacationConfig.isEnabled)
  const [vacationSubject, setVacationSubject] = useState(vacationConfig.subject)
  const [vacationFromDate, setVacationFromDate] = useState(vacationConfig.fromDate || "")
  const [vacationToDate, setVacationToDate] = useState(vacationConfig.toDate || "")
  const [vacationBody, setVacationBody] = useState(vacationConfig.textBody)
  const [isVacationSaved, setIsVacationSaved] = useState(false)

  const handleSaveVacation = async () => {
    try {
      await setVacationConfig({
        isEnabled: isVacationEnabled,
        fromDate: vacationFromDate,
        toDate: vacationToDate,
        subject: vacationSubject,
        textBody: vacationBody,
      })
      setIsVacationSaved(true)
    } catch (err: any) {
      console.error("Failed to save vacation config:", err)
    }
  }

  const handleGeneratePassword = () => {
    if (!newAppName.trim()) return
    const isMobile =
      newAppName.toLowerCase().includes("phone") ||
      newAppName.toLowerCase().includes("mobile")
    const { id, name, secret, createdAt } = postarcApi.saveAppPassword({
      name: newAppName.trim(),
      clientType: isMobile ? "mobile" : "desktop",
    })

    const newEntry: AppPasswordRow = {
      id,
      name,
      tokenPreview: `postarc_app_••••_${secret.slice(-4)}`,
      createdAt,
      lastUsedAt: "Just now",
    }

    setAppPasswords((prev) => [newEntry, ...prev])
    setGeneratedPassword(secret)
  }

  const handleCopyPassword = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    setNewAppName("")
    setGeneratedPassword(null)
    setCopied(false)
  }

  const handleRevokePassword = (id: string) => {
    postarcApi.deleteAppPassword(id)
    setAppPasswords((prev) => prev.filter((p) => p.id !== id))
  }

  const columns: TableColumn<AppPasswordRow>[] = [
    {
      key: "name",
      header: "Device / Client Name",
      width: proportional(1, { minWidth: 200 }),
      renderCell: (item) => (
        <HStack gap={2} vAlign="center">
          {item.name.toLowerCase().includes("phone") || item.name.toLowerCase().includes("mobile") ? (
            <Smartphone size={20} className="text-neutral-400" />
          ) : (
            <Monitor size={20} className="text-neutral-400" />
          )}
          <VStack gap={0}>
            <Text type="body" size="sm" weight="medium">
              {item.name}
            </Text>
            <Text type="supporting" size="xsm" color="secondary">
              {item.tokenPreview}
            </Text>
          </VStack>
        </HStack>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      width: pixel(140),
      renderCell: (item) => (
        <Text type="supporting" size="xsm" color="secondary">
          {formatDate(item.createdAt)}
        </Text>
      ),
    },
    {
      key: "lastUsedAt",
      header: "Last Sync",
      width: pixel(140),
      renderCell: (item) => (
        <Badge
          label={item.lastUsedAt ? "Active" : "Never"}
          variant={item.lastUsedAt ? "success" : "neutral"}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      width: pixel(100),
      align: "end",
      renderCell: (item) => (
        <Button
          label="Revoke"
          variant="destructive"
          size="sm"
          icon={<Trash2 size={16} />}
          onClick={() => handleRevokePassword(item.id)}
        />
      ),
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={960} padding={4}>
      {/* Page Header */}
      <VStack gap={1}>
        <Heading level={2}>Mailbox Settings</Heading>
        <Text type="body" color="secondary" size="sm">
          Manage your email signature, third-party client passwords, and synchronization settings.
        </Text>
      </VStack>

      {/* ── Section: App Passwords & Third-Party Clients (iPhone, Outlook, Thunderbird) ── */}
      <Card padding={6} width="100%">
        <VStack gap={4} width="100%">
          <HStack hAlign="between" vAlign="center" width="100%">
            <VStack gap={1}>
              <HStack gap={2} vAlign="center">
                <Heading level={3}>App Passwords for Email Clients</Heading>
                <Badge label="2FA Protected" variant="info" />
              </HStack>
              <Text type="body" color="secondary" size="sm">
                Connect Apple Mail on iPhone, Outlook, or Thunderbird securely. App Passwords let native clients sync via IMAP/SMTP without revealing your master login password.
              </Text>
            </VStack>
            <Button
              label="Generate App Password"
              variant="primary"
              size="sm"
              icon={<Plus size={16} />}
              onClick={() => setIsCreateModalOpen(true)}
            />
          </HStack>

          {/* Active App Passwords Table */}
          {appPasswords.length > 0 ? (
            <Table
              data={appPasswords}
              columns={columns}
              idKey="id"
              density="compact"
            />
          ) : (
            <Banner
              status="info"
              title="No App Passwords generated yet"
              description="Click 'Generate App Password' above to set up your phone or desktop mail client."
              container="card"
            />
          )}

          {/* IMAP/SMTP Connection Details */}
          <Card padding={4} variant="muted" width="100%">
            <VStack gap={2} width="100%">
              <Heading level={4} weight="medium">
                IMAP & SMTP Server Configuration
              </Heading>
              <HStack gap={8} wrap="wrap">
                <VStack gap={0}>
                  <Text type="supporting" color="secondary" size="xsm">
                    Incoming Mail (IMAP)
                  </Text>
                  <Text type="code" size="sm">
                    {serverHost}:993 (SSL/TLS)
                  </Text>
                </VStack>
                <VStack gap={0}>
                  <Text type="supporting" color="secondary" size="xsm">
                    Outgoing Mail (SMTP)
                  </Text>
                  <Text type="code" size="sm">
                    {serverHost}:465 (SSL/TLS)
                  </Text>
                </VStack>
                <VStack gap={0}>
                  <Text type="supporting" color="secondary" size="xsm">
                    Username
                  </Text>
                  <Text type="code" size="sm">
                    {currentUserEmail}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Card>
        </VStack>
      </Card>

      {/* ── Section: Email Signature ── */}
      <Card padding={6} width="100%">
        <VStack gap={4} width="100%">
          <VStack gap={1}>
            <Heading level={3}>Email Signature</Heading>
            <Text type="body" color="secondary" size="sm">
              Automatically appended at the end of all outgoing messages from your mailbox.
            </Text>
          </VStack>

          {isSaved && (
            <Banner
              status="success"
              title="Signature saved successfully."
              container="card"
              isDismissable
              onDismiss={() => setIsSaved(false)}
            />
          )}

          <TextArea
            label="Signature"
            value={signature}
            onChange={(val) => {
              setSignature(val)
              setIsSaved(false)
            }}
            rows={4}
            width="100%"
          />

          <HStack hAlign="end">
            <Button
              label="Save Signature"
              variant="primary"
              size="md"
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem("postarc_signature", signature)
                }
                setIsSaved(true)
                setTimeout(() => setIsSaved(false), 3000)
              }}
            />
          </HStack>
        </VStack>
      </Card>

      {/* ── Section: Vacation Auto-Responder (Out of Office) ── */}
      <Card padding={6} width="100%">
        <VStack gap={4} width="100%">
          <HStack hAlign="between" vAlign="center" width="100%">
            <VStack gap={1}>
              <HStack gap={2} vAlign="center">
                <Palmtree size={22} className="text-amber-500" />
                <Heading level={3}>Vacation Auto-Responder</Heading>
              </HStack>
              <Text type="body" color="secondary" size="sm">
                Automatically respond to incoming messages while you are away or on annual leave.
              </Text>
            </VStack>
            <Switch
              label="Enable auto-reply"
              isLabelHidden
              value={isVacationEnabled}
              onChange={(checked) => {
                setIsVacationEnabled(checked)
                setIsVacationSaved(false)
              }}
            />
          </HStack>

          {isVacationSaved && (
            <Banner
              status="success"
              title="Vacation responder settings updated successfully."
              container="card"
              isDismissable
              onDismiss={() => setIsVacationSaved(false)}
            />
          )}

          {isVacationEnabled && (
            <VStack gap={4} width="100%">
              <HStack gap={4} width="100%">
                <TextInput
                  label="Start Date"
                  type="text"
                  placeholder="YYYY-MM-DD"
                  value={vacationFromDate}
                  onChange={(val) => {
                    setVacationFromDate(val)
                    setIsVacationSaved(false)
                  }}
                  width="50%"
                />
                <TextInput
                  label="End Date"
                  type="text"
                  placeholder="YYYY-MM-DD"
                  value={vacationToDate}
                  onChange={(val) => {
                    setVacationToDate(val)
                    setIsVacationSaved(false)
                  }}
                  width="50%"
                />
              </HStack>

              <TextInput
                label="Auto-Reply Subject"
                value={vacationSubject}
                onChange={(val) => {
                  setVacationSubject(val)
                  setIsVacationSaved(false)
                }}
                width="100%"
              />

              <TextArea
                label="Message Body"
                value={vacationBody}
                onChange={(val) => {
                  setVacationBody(val)
                  setIsVacationSaved(false)
                }}
                rows={4}
                width="100%"
              />
            </VStack>
          )}

          <HStack hAlign="end">
            <Button
              label="Save Vacation Settings"
              variant="primary"
              size="md"
              onClick={handleSaveVacation}
            />
          </HStack>
        </VStack>
      </Card>

      {/* ── Section: Incoming Mail Filters (ManageSieve) ── */}
      <Card padding={6} width="100%">
        <HStack hAlign="between" vAlign="center" width="100%">
          <VStack gap={1}>
            <Heading level={3}>Incoming Mail Filtering Rules</Heading>
            <Text type="body" color="secondary" size="sm">
              Manage automated server-side Sieve scripts (RFC 5228) to sort, forward, or discard incoming emails.
            </Text>
          </VStack>
          <Button
            label="Configure Rules"
            variant="secondary"
            size="md"
            href="/mail/filters"
          />
        </HStack>
      </Card>

      {/* ── Dialog: Generate App Password ── */}
      <Dialog
        isOpen={isCreateModalOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseModal()
        }}
        width={480}
        purpose="form"
      >
        <VStack gap={4} padding={4} width="100%">
          <VStack gap={1}>
            <Heading level={3}>
              {generatedPassword ? "Your App Password is Ready" : "Generate App Password"}
            </Heading>
            <Text type="body" color="secondary" size="sm">
              {generatedPassword
                ? "Copy this password and paste it into your email client's password prompt. You won't be able to see it again once you close this window."
                : "Give this client a name so you can identify and revoke it later if needed."}
            </Text>
          </VStack>

          {generatedPassword ? (
            <VStack gap={4} width="100%">
              <Card padding={4} variant="muted" width="100%">
                <HStack hAlign="between" vAlign="center" width="100%">
                  <Text type="code" size="lg" weight="bold">
                    {generatedPassword}
                  </Text>
                  <Button
                    label={copied ? "Copied!" : "Copy"}
                    variant={copied ? "secondary" : "primary"}
                    size="sm"
                    icon={
                      copied ? (
                        <CheckCircle size={16} className="text-emerald-500" />
                      ) : (
                        <ClipboardCheck size={16} />
                      )
                    }
                    onClick={handleCopyPassword}
                  />
                </HStack>
              </Card>

              <Banner
                status="info"
                title="Security Notice"
                description="This app password gives your device direct access to your mailbox via IMAP. Keep it confidential."
                container="card"
              />

              <HStack hAlign="end">
                <Button
                  label="Done"
                  variant="primary"
                  size="md"
                  onClick={handleCloseModal}
                />
              </HStack>
            </VStack>
          ) : (
            <VStack gap={4} width="100%">
              <TextInput
                label="App or Device Name"
                placeholder="e.g. iPhone Mail, Outlook Laptop, Thunderbird"
                value={newAppName}
                onChange={(val) => setNewAppName(val)}
                isRequired
                width="100%"
                hasAutoFocus
              />

              <HStack hAlign="end" gap={2}>
                <Button
                  label="Cancel"
                  variant="ghost"
                  onClick={handleCloseModal}
                />
                <Button
                  label="Generate"
                  variant="primary"
                  isDisabled={!newAppName.trim()}
                  onClick={handleGeneratePassword}
                />
              </HStack>
            </VStack>
          )}
        </VStack>
      </Dialog>
    </VStack>
  )
}
