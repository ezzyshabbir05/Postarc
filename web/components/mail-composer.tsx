"use client"

import { useState, useRef } from "react"
import { Dialog } from "@astryxdesign/core/Dialog"
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

    sendEmail(
      to.trim(),
      subject.trim(),
      body,
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
        onClose={handleCloseAndAutoDraft}
        size="lg"
        title={
          <HStack gap={2} vAlign="center" justify="space-between" width="100%">
            <HStack gap={2} vAlign="center">
              <Heading level={4}>New Message</Heading>
              <Badge variant="outline" count={0}>
                Draft
              </Badge>
            </HStack>
            <HStack gap={1} vAlign="center">
              <IconButton
                aria-label="Discard draft"
                icon={<Trash2 size={16} />}
                variant="ghost"
                size="sm"
                onClick={handleDiscard}
              />
              <IconButton
                aria-label="Close"
                icon={<X size={16} />}
                variant="ghost"
                size="sm"
                onClick={handleCloseAndAutoDraft}
              />
            </HStack>
          </HStack>
        }
      >
        <VStack gap={4} hAlign="stretch">
          {/* Identity (From) Selector */}
          <HStack gap={3} vAlign="center" justify="space-between">
            <HStack gap={2} vAlign="center">
              <Text type="body" weight="medium" color="secondary">
                From:
              </Text>
              <Button
                variant="outline"
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
            <Card padding={2} elevation="medium">
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
                onChange={(e) => handleToChange(e.target.value)}
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
                  <Text type="supporting" color="secondary" size="xs">
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
              onChange={(e) => setCc(e.target.value)}
            />
          )}

          {showBcc && (
            <TextInput
              label="Bcc"
              placeholder="bcc@example.com"
              value={bcc}
              onChange={(e) => setBcc(e.target.value)}
            />
          )}

          {/* Subject Field */}
          <TextInput
            label="Subject"
            placeholder="Email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          {/* Body TextArea */}
          <TextArea
            label="Message Body"
            placeholder="Write your email here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
          />

          {/* Attachments Section */}
          {attachments.length > 0 && (
            <VStack gap={2} hAlign="stretch">
              <Text type="supporting" color="secondary" size="xs">
                Attachments ({attachments.length}):
              </Text>
              <HStack gap={2} wrap>
                {attachments.map((att) => (
                  <Card key={att.id} padding={2} elevation="low">
                    <HStack gap={2} vAlign="center">
                      {getAttachmentIcon(att.type)}
                      <VStack gap={0}>
                        <Text type="body" size="sm" weight="medium">
                          {att.name}
                        </Text>
                        <Text type="supporting" color="secondary" size="xs">
                          {att.size}
                        </Text>
                      </VStack>
                      <IconButton
                        aria-label="Remove attachment"
                        icon={<X size={14} />}
                        variant="ghost"
                        size="xs"
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
          <HStack justify="space-between" vAlign="center">
            <HStack gap={2} vAlign="center">
              <Button
                variant="outline"
                size="sm"
                icon={<Paperclip size={16} />}
                label="Attach Files"
                onClick={() => fileInputRef.current?.click()}
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
                disabled={!to.trim()}
              />
            </HStack>
          </HStack>
        </VStack>
      </Dialog>

      {/* Canned Responses / Template Dialog */}
      <Dialog
        isOpen={isTemplateDialogOpen}
        onClose={() => setIsTemplateDialogOpen(false)}
        size="md"
        title="Insert Canned Response Template"
      >
        <VStack gap={3} hAlign="stretch">
          <Text type="body" color="secondary" size="sm">
            Select a pre-configured template snippet to insert into your message:
          </Text>
          {cannedResponses.map((cr) => (
            <Card key={cr.id} padding={3} elevation="low">
              <VStack gap={2} hAlign="stretch">
                <HStack justify="space-between" vAlign="center">
                  <Text type="body" weight="bold">
                    {cr.title}
                  </Text>
                  <Badge variant="outline" count={0}>
                    {cr.category || "General"}
                  </Badge>
                </HStack>
                <Text type="supporting" color="secondary" size="xs">
                  {cr.body.slice(0, 120)}...
                </Text>
                <HStack justify="flex-end">
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
