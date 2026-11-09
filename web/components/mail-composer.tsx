"use client"

import { useState, useRef } from "react"
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading, Text } from "@astryxdesign/core/Text"
import { TextInput } from "@astryxdesign/core/TextInput"
import { TextArea } from "@astryxdesign/core/TextArea"
import { Button } from "@astryxdesign/core/Button"
import { IconButton } from "@astryxdesign/core/IconButton"
import { Badge } from "@astryxdesign/core/Badge"
import { Card } from "@astryxdesign/core/Card"
import {
  Send,
  Paperclip,
  Trash2,
  X,
  FileText,
  UserCheck,
  ChevronDown,
  ShieldCheck,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Code,
  Link2,
  Quote,
  Eye,
} from "lucide-react"
import { useMail } from "@/components/mail-context"
import { getAttachmentIcon } from "@/components/attachment-badge"
import type { EmailAttachment } from "@/types/email"

export function MailComposer() {
  const {
    isComposeOpen,
    closeCompose,
    sendEmail,
    saveDraft,
    identities,
    activeIdentity,
    setActiveIdentity,
    cannedResponses,
    contacts,
  } = useMail()

  const [to, setTo] = useState("")
  const [showCc, setShowCc] = useState(false)
  const [cc, setCc] = useState("")
  const [showBcc, setShowBcc] = useState(false)
  const [bcc, setBcc] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [attachments, setAttachments] = useState<EmailAttachment[]>([])

  // Roundcube: Autocomplete state
  const [toSuggestions, setToSuggestions] = useState<typeof contacts>([])
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [isIdentitySelectorOpen, setIsIdentitySelectorOpen] = useState(false)
  const [isPgpSignEnabled, setIsPgpSignEnabled] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const formatBody = (prefix: string, suffix: string = "") => {
    setBody((prev) => `${prev} ${prefix}text${suffix}`)
  }

  const formatList = (type: "bullet" | "number") => {
    const symbol = type === "bullet" ? "- " : "1. "
    setBody((prev) => `${prev}\n${symbol}`)
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isComposeOpen) return null

  const handleToChange = (val: string) => {
    setTo(val)
    if (val.trim().length > 1) {
      const q = val.toLowerCase().trim()
      const matches = contacts.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      )
      setToSuggestions(matches)
    } else {
      setToSuggestions([])
    }
  }

  const selectContactSuggestion = (email: string) => {
    setTo(email)
    setToSuggestions([])
  }

  const handleSend = () => {
    if (!to.trim()) return

    let finalBody = body
    if (isPgpSignEnabled) {
      finalBody = `-----BEGIN PGP SIGNED MESSAGE-----\nHash: SHA256\n\n${body}\n-----BEGIN PGP SIGNATURE-----\nVersion: Postarc OpenPGP v1.0\n\niQGzBAEBCAAdFiEE${Math.random().toString(36).slice(2, 12).toUpperCase()}==\n-----END PGP SIGNATURE-----`
    }

    sendEmail(
      to.trim(),
      subject.trim(),
      finalBody,
      attachments.length > 0 ? attachments : undefined,
      activeIdentity.id
    )

    // Reset fields
    setTo("")
    setCc("")
    setBcc("")
    setShowCc(false)
    setShowBcc(false)
    setSubject("")
    setBody("")
    setAttachments([])
    setIsPgpSignEnabled(false)
  }

  const handleCloseAndAutoDraft = () => {
    if (to.trim() || subject.trim() || body.trim()) {
      saveDraft(to, subject, body, attachments.length > 0 ? attachments : undefined)
    }
    closeCompose()
    setTo("")
    setCc("")
    setBcc("")
    setShowCc(false)
    setShowBcc(false)
    setSubject("")
    setBody("")
    setAttachments([])
  }

  const handleDiscard = () => {
    closeCompose()
    setTo("")
    setCc("")
    setBcc("")
    setShowCc(false)
    setShowBcc(false)
    setSubject("")
    setBody("")
    setAttachments([])
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const fileList = Array.from(e.target.files)
    const newAttachments: EmailAttachment[] = fileList.map((file, idx) => ({
      id: `att_${Date.now()}_${idx}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.type.includes("pdf")
        ? "pdf"
        : file.type.includes("image")
        ? "image"
        : file.type.includes("sheet") || file.name.endsWith(".xlsx") || file.name.endsWith(".csv")
        ? "spreadsheet"
        : "document",
    }))

    setAttachments((prev) => [...prev, ...newAttachments])
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  const applyTemplate = (content: string) => {
    setBody((prev) => (prev ? `${prev}\n\n${content}` : content))
    setIsTemplateDialogOpen(false)
  }

  return (
    <>
      <Dialog
        isOpen={isComposeOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseAndAutoDraft()
        }}
        width={640}
      >
        <VStack gap={4} hAlign="stretch" padding={4}>
          <HStack gap={2} vAlign="center" hAlign="between" width="100%">
            <HStack gap={2} vAlign="center">
              <Heading level={4}>New Message</Heading>
              <Badge variant="neutral" label="Draft" />
            </HStack>
            <HStack gap={1} vAlign="center">
              <IconButton
                label="Discard draft"
                icon={<Trash2 size={16} />}
                variant="ghost"
                size="sm"
                onClick={handleDiscard}
              />
              <IconButton
                label="Close"
                icon={<X size={16} />}
                variant="ghost"
                size="sm"
                onClick={handleCloseAndAutoDraft}
              />
            </HStack>
          </HStack>

          {/* Identity (From) Selector */}
          <HStack gap={3} vAlign="center" hAlign="between">
            <HStack gap={2} vAlign="center">
              <Text type="body" weight="medium" color="secondary">
                From:
              </Text>
              <Button
                variant="secondary"
                size="sm"
                label={`${activeIdentity.name} <${activeIdentity.email}>`}
                icon={<ChevronDown size={14} />}
                onClick={() => setIsIdentitySelectorOpen(!isIdentitySelectorOpen)}
              />
            </HStack>

            {/* Template picker shortcut */}
            <Button
              variant="ghost"
              size="sm"
              label="Templates"
              icon={<FileText size={15} />}
              onClick={() => setIsTemplateDialogOpen(true)}
            />
          </HStack>

          {/* Identity Selection Dropdown List */}
          {isIdentitySelectorOpen && (
            <Card padding={2} elevation="med">
              <VStack gap={1} hAlign="stretch">
                {identities.map((idItem) => (
                  <Button
                    key={idItem.id}
                    variant={idItem.id === activeIdentity.id ? "primary" : "ghost"}
                    size="sm"
                    label={`${idItem.name} (${idItem.email})`}
                    onClick={() => {
                      setActiveIdentity(idItem)
                      setIsIdentitySelectorOpen(false)
                    }}
                  />
                ))}
              </VStack>
            </Card>
          )}

          {/* Recipient To Field with Autocomplete */}
          <VStack gap={1} hAlign="stretch">
            <HStack gap={2} vAlign="center">
              <TextInput
                label="To"
                placeholder="recipient@example.com"
                value={to}
                onChange={(val) => handleToChange(val)}
              />
              <HStack gap={1}>
                {!showCc && (
                  <Button
                    label="Cc"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCc(true)}
                  />
                )}
                {!showBcc && (
                  <Button
                    label="Bcc"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBcc(true)}
                  />
                )}
              </HStack>
            </HStack>

            {/* Find-as-you-type Autocomplete suggestions */}
            {toSuggestions.length > 0 && (
              <Card padding={2} elevation="high">
                <VStack gap={1} hAlign="stretch">
                  <Text type="supporting" color="secondary" size="xsm">
                    Contacts suggestion:
                  </Text>
                  {toSuggestions.map((c) => (
                    <Button
                      key={c.id}
                      variant="ghost"
                      size="sm"
                      icon={<UserCheck size={14} />}
                      label={`${c.name} <${c.email}> (${c.group})`}
                      onClick={() => selectContactSuggestion(c.email)}
                    />
                  ))}
                </VStack>
              </Card>
            )}
          </VStack>

          {/* CC & BCC Fields */}
          {showCc && (
            <TextInput
              label="Cc"
              placeholder="cc@example.com"
              value={cc}
              onChange={(val) => setCc(val)}
            />
          )}

          {showBcc && (
            <TextInput
              label="Bcc"
              placeholder="bcc@example.com"
              value={bcc}
              onChange={(val) => setBcc(val)}
            />
          )}

          {/* Subject Field */}
          <TextInput
            label="Subject"
            placeholder="Email subject"
            value={subject}
            onChange={(val) => setSubject(val)}
          />

          {/* Formatting Controls Bar */}
          <HStack gap={1} vAlign="center" wrap="wrap">
            <IconButton
              variant="ghost"
              size="sm"
              icon={<Bold size={14} />}
              label="Bold"
              onClick={() => formatBody("**", "**")}
            />
            <IconButton
              variant="ghost"
              size="sm"
              icon={<Italic size={14} />}
              label="Italic"
              onClick={() => formatBody("*", "*")}
            />
            <IconButton
              variant="ghost"
              size="sm"
              icon={<Underline size={14} />}
              label="Underline"
              onClick={() => formatBody("<u>", "</u>")}
            />
            <IconButton
              variant="ghost"
              size="sm"
              icon={<Code size={14} />}
              label="Code"
              onClick={() => formatBody("`", "`")}
            />
            <IconButton
              variant="ghost"
              size="sm"
              icon={<List size={14} />}
              label="Bullet List"
              onClick={() => formatList("bullet")}
            />
            <IconButton
              variant="ghost"
              size="sm"
              icon={<ListOrdered size={14} />}
              label="Numbered List"
              onClick={() => formatList("number")}
            />
            <IconButton
              variant="ghost"
              size="sm"
              icon={<Quote size={14} />}
              label="Quote"
              onClick={() => formatBody("> ")}
            />
            <IconButton
              variant="ghost"
              size="sm"
              icon={<Link2 size={14} />}
              label="Insert Link"
              onClick={() => formatBody("[Link Text](https://example.com)")}
            />
            <Button
              variant="ghost"
              size="sm"
              icon={<FileText size={14} />}
              label="Templates"
              onClick={() => setIsTemplateDialogOpen(true)}
            />
            <Button
              variant={isPreviewMode ? "primary" : "ghost"}
              size="sm"
              icon={<Eye size={14} />}
              label={isPreviewMode ? "Editing" : "Preview"}
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            />
          </HStack>

          {/* Body TextArea / Live Preview */}
          {isPreviewMode ? (
            <Card padding={4} variant="muted" width="100%">
              <VStack gap={2} width="100%">
                <Text type="supporting" size="xsm" color="secondary">
                  HTML Message Preview:
                </Text>
                <VStack gap={1} width="100%">
                  {body.split("\n\n").map((para, idx) => (
                    <Text key={idx} type="body" size="base">
                      {para}
                    </Text>
                  ))}
                  {!body && (
                    <Text type="supporting" color="disabled">
                      (No content)
                    </Text>
                  )}
                </VStack>
              </VStack>
            </Card>
          ) : (
            <TextArea
              label="Message Body"
              placeholder="Write your email here..."
              value={body}
              onChange={(val) => setBody(val)}
              rows={10}
            />
          )}

          {/* Attachments Section */}
          {attachments.length > 0 && (
            <VStack gap={2} hAlign="stretch">
              <Text type="supporting" color="secondary" size="xsm">
                Attachments ({attachments.length}):
              </Text>
              <HStack gap={2} wrap="wrap">
                {attachments.map((att) => (
                  <Card key={att.id} padding={2} elevation="low">
                    <HStack gap={2} vAlign="center">
                      {getAttachmentIcon(att.type)}
                      <VStack gap={0}>
                        <Text type="body" size="sm" weight="medium">
                          {att.name}
                        </Text>
                        <Text type="supporting" color="secondary" size="xsm">
                          {att.size}
                        </Text>
                      </VStack>
                      <IconButton
                        label="Remove attachment"
                        icon={<X size={14} />}
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(att.id)}
                      />
                    </HStack>
                  </Card>
                ))}
              </HStack>
            </VStack>
          )}

          {/* Hidden File Input for Real Attachments */}
          <input
            type="file"
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />

          {/* Bottom Actions Bar */}
          <HStack hAlign="between" vAlign="center">
            <HStack gap={2} vAlign="center">
              <Button
                variant="secondary"
                size="sm"
                icon={<Paperclip size={16} />}
                label="Attach Files"
                onClick={() => fileInputRef.current?.click()}
              />
              <Button
                variant={isPgpSignEnabled ? "primary" : "secondary"}
                size="sm"
                icon={<ShieldCheck size={16} />}
                label={isPgpSignEnabled ? "PGP Signed" : "Sign PGP"}
                onClick={() => setIsPgpSignEnabled(!isPgpSignEnabled)}
              />
            </HStack>

            <HStack gap={2} vAlign="center">
              <Button
                label="Save as Draft"
                variant="ghost"
                size="md"
                onClick={handleCloseAndAutoDraft}
              />
              <Button
                label="Send"
                variant="primary"
                size="md"
                icon={<Send size={16} />}
                onClick={handleSend}
                isDisabled={!to.trim()}
              />
            </HStack>
          </HStack>
        </VStack>
      </Dialog>

      {/* Canned Responses / Template Dialog */}
      <Dialog
        isOpen={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
        width={560}
      >
        <VStack gap={3} hAlign="stretch" padding={4}>
          <DialogHeader
            title="Insert Canned Response Template"
            onOpenChange={setIsTemplateDialogOpen}
          />
          <Text type="body" color="secondary" size="sm">
            Select a pre-configured template snippet to insert into your message:
          </Text>
          {cannedResponses.map((cr) => (
            <Card key={cr.id} padding={3} elevation="low">
              <VStack gap={2} hAlign="stretch">
                <HStack hAlign="between" vAlign="center">
                  <Text type="body" weight="bold">
                    {cr.title}
                  </Text>
                  <Badge variant="neutral" label={cr.category || "General"} />
                </HStack>
                <Text type="supporting" color="secondary" size="xsm">
                  {cr.body.slice(0, 120)}...
                </Text>
                <HStack hAlign="end">
                  <Button
                    label="Insert into Email"
                    size="sm"
                    variant="primary"
                    onClick={() => applyTemplate(cr.body)}
                  />
                </HStack>
              </VStack>
            </Card>
          ))}
        </VStack>
      </Dialog>
    </>
  )
}
