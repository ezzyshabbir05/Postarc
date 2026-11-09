"use client"

import { useState, useRef } from "react"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading, Text } from "@astryxdesign/core/Text"
import { Card } from "@astryxdesign/core/Card"
import { Button } from "@astryxdesign/core/Button"
import { IconButton } from "@astryxdesign/core/IconButton"
import { Avatar } from "@astryxdesign/core/Avatar"
import { Badge } from "@astryxdesign/core/Badge"
import { Divider } from "@astryxdesign/core/Divider"
import { TextArea } from "@astryxdesign/core/TextArea"
import { DropdownMenu } from "@astryxdesign/core/DropdownMenu"
import { Popover } from "@astryxdesign/core/Popover"
import {
  ArrowLeft,
  Archive,
  AlertCircle,
  Trash2,
  Mail,
  Clock,
  FolderInput,
  Tag,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
  Printer,
  ExternalLink,
  Star,
  Smile,
  Reply,
  Forward,
  Lock,
  Send,
  Paperclip,
  Download,
} from "lucide-react"
import { useMail } from "@/components/mail-context"
import { getAttachmentIcon } from "@/components/attachment-badge"
import type { ThreadMessage } from "@/types/email"

function HtmlEmailViewer({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [iframeHeight, setIframeHeight] = useState<number>(680)

  const handleLoad = () => {
    try {
      if (iframeRef.current?.contentWindow?.document?.body) {
        const doc = iframeRef.current.contentWindow.document
        const height = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight)
        if (height > 50) {
          setIframeHeight(height + 24)
        }
      }
    } catch {
      // Ignore cross-origin
    }
  }

  return (
    <iframe
      ref={iframeRef}
      srcDoc={html}
      title="Email Content"
      sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      onLoad={handleLoad}
      width="100%"
      height={iframeHeight}
      style={{
        border: 0,
        width: "100%",
        background: "transparent",
        overflow: "hidden",
      }}
    />
  )
}

function VerifiedBadge() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      style={{ flexShrink: 0 }}
      aria-label="Verified sender"
    >
      <circle cx="8" cy="8" r="7" fill="#1a73e8" />
      <path
        d="M5 8.2l2 2 4.2-4.2"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function MailThreadViewer() {
  const {
    activeEmail,
    closeEmail,
    archiveSelected,
    deleteSelected,
    reportSpam,
    markSelectedAsUnread,
    snoozeEmails,
    replyToEmail,
    allowedRemoteImages,
    allowRemoteImagesForEmail,
    exportEmailAsEml,
  } = useMail()

  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [trimmedOpen, setTrimmedOpen] = useState<Record<string, boolean>>({})
  const [messageStarred, setMessageStarred] = useState<Record<string, boolean>>({})
  const [expandedOverrides, setExpandedOverrides] = useState<Record<string, boolean>>({})

  if (!activeEmail) return null

  const messages: ThreadMessage[] =
    activeEmail.messages && activeEmail.messages.length > 0
      ? activeEmail.messages
      : [
          {
            id: `orig_${activeEmail.id}`,
            senderName: activeEmail.senderName,
            senderAvatar: activeEmail.senderAvatar,
            isVerified: activeEmail.isVerified,
            senderEmail: activeEmail.senderEmail,
            recipientEmail: activeEmail.recipientEmail,
            replyToEmail: activeEmail.replyToEmail || activeEmail.senderEmail,
            body: activeEmail.body,
            htmlBody: activeEmail.htmlBody,
            timestamp: activeEmail.timestamp,
            fullDate: activeEmail.fullDate,
            mailedBy: activeEmail.mailedBy || "krxemails.hdfcbank.net",
            signedBy: activeEmail.signedBy || "hdfcbank.net",
            security: activeEmail.security || "Standard encryption (TLS)",
            attachments: activeEmail.attachments,
          },
        ]

  const isMsgExpanded = (msgId: string, idx: number, total: number) => {
    if (total <= 1) return true
    if (expandedOverrides[msgId] !== undefined) return expandedOverrides[msgId]
    return idx === total - 1
  }

  const toggleExpand = (id: string, idx: number, total: number) => {
    setExpandedOverrides((prev) => ({
      ...prev,
      [id]: !isMsgExpanded(id, idx, total),
    }))
  }

  const allExpanded = messages.every((m, i) => isMsgExpanded(m.id, i, messages.length))

  const expandAll = () => {
    const next: Record<string, boolean> = {}
    messages.forEach((m) => {
      next[m.id] = true
    })
    setExpandedOverrides(next)
  }

  const collapseAll = () => {
    const next: Record<string, boolean> = {}
    messages.forEach((m, idx) => {
      next[m.id] = idx === messages.length - 1
    })
    setExpandedOverrides(next)
  }

  const toggleTrimmed = (id: string) => {
    setTrimmedOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const toggleMessageStar = (id: string) => {
    const msg = messages.find((m) => m.id === id)
    setMessageStarred((prev) => ({
      ...prev,
      [id]: !(prev[id] ?? msg?.isStarred ?? activeEmail.isStarred),
    }))
  }

  const printSingleMessage = (msg: ThreadMessage) => {
    if (typeof window === "undefined") return
    const printWindow = window.open("", "_blank", "width=800,height=600")
    if (!printWindow) return
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${activeEmail?.subject || "Email Print"}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 32px; color: #111; line-height: 1.6; }
            .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 24px; }
            .subject { font-size: 22px; font-weight: 700; margin-bottom: 12px; }
            .meta { font-size: 14px; color: #4b5563; margin-bottom: 4px; }
            .meta strong { color: #111; }
            .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 600; background: #e0f2fe; color: #0369a1; margin-right: 6px; }
            .body { font-size: 15px; white-space: pre-wrap; word-break: break-word; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="subject">${activeEmail?.subject || ""}</div>
            <div class="meta"><strong>From:</strong> ${msg.senderName} &lt;${msg.senderEmail}&gt;</div>
            <div class="meta"><strong>To:</strong> ${msg.recipientEmail}</div>
            <div class="meta"><strong>Date:</strong> ${msg.fullDate || msg.timestamp}</div>
            <div class="meta"><strong>Security:</strong> <span class="badge">TLS Verified</span>${msg.pgpSignatureStatus === "valid" ? '<span class="badge">OpenPGP Signed</span>' : ''}</div>
          </div>
          <div class="body">${msg.body}</div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const handleSendReply = () => {
    if (!replyText.trim()) return
    replyToEmail(activeEmail.id, replyText)
    setIsReplying(false)
    setReplyText("")
    setExpandedOverrides((prev) => ({ ...prev, [`reply_${Date.now()}`]: true }))
  }

  const handleStartForward = () => {
    const latest = messages[messages.length - 1]
    setIsReplying(true)
    setReplyText(
      `\n\n---------- Forwarded message ---------\nFrom: ${latest.senderName} <${latest.senderEmail}>\nSubject: ${activeEmail.subject}\nDate: ${latest.fullDate}\n\n${latest.body}`
    )
  }

  return (
    <VStack gap={0} width="100%">
      {/* ── Top Action Bar (Clean padding={2} matching MailToolbar inside AppShell) ── */}
      <HStack
        hAlign="between"
        vAlign="center"
        width="100%"
        padding={2}
      >
        {/* Left Toolbar Icons */}
        <HStack gap={1} vAlign="center" wrap="wrap">
          <IconButton
            label="Back to Inbox"
            tooltip="Back to Inbox"
            variant="ghost"
            size="sm"
            icon={<ArrowLeft size={18} />}
            onClick={closeEmail}
          />
          <IconButton
            label="Archive"
            tooltip="Archive"
            variant="ghost"
            size="sm"
            icon={<Archive size={18} />}
            onClick={() => archiveSelected()}
          />
          <IconButton
            label="Report spam"
            tooltip="Report spam"
            variant="ghost"
            size="sm"
            icon={<AlertCircle size={18} />}
            onClick={() => reportSpam()}
          />
          <IconButton
            label="Delete"
            tooltip="Delete"
            variant="ghost"
            size="sm"
            icon={<Trash2 size={18} />}
            onClick={() => deleteSelected()}
          />
          <IconButton
            label="Mark as unread"
            tooltip="Mark as unread"
            variant="ghost"
            size="sm"
            icon={<Mail size={18} />}
            onClick={markSelectedAsUnread}
          />

          {/* Snooze Presets */}
          <DropdownMenu
            alignment="start"
            renderTrigger={(triggerProps) => (
              <IconButton
                label="Snooze"
                tooltip="Snooze"
                variant="ghost"
                size="sm"
                icon={<Clock size={18} />}
                {...triggerProps}
              />
            )}
            items={[
              {
                label: "Later today (6:00 PM)",
                onClick: () => snoozeEmails([activeEmail.id], "Later today 6:00 PM"),
              },
              {
                label: "Tomorrow morning (8:00 AM)",
                onClick: () => snoozeEmails([activeEmail.id], "Tomorrow 8:00 AM"),
              },
              {
                label: "This weekend (Sat 9:00 AM)",
                onClick: () => snoozeEmails([activeEmail.id], "This weekend"),
              },
              {
                label: "Next week (Mon 8:00 AM)",
                onClick: () => snoozeEmails([activeEmail.id], "Next week"),
              },
            ]}
          />

          <IconButton
            label="Move to"
            tooltip="Move to"
            variant="ghost"
            size="sm"
            icon={<FolderInput size={18} />}
          />
          <IconButton
            label="Labels"
            tooltip="Labels"
            variant="ghost"
            size="sm"
            icon={<Tag size={18} />}
          />
          <IconButton
            label="More"
            tooltip="More"
            variant="ghost"
            size="sm"
            icon={<MoreVertical size={18} />}
          />
        </HStack>

        {/* Right Pagination Controls */}
        <HStack gap={3} vAlign="center">
          <Text type="supporting" size="xsm" color="secondary">
            1 of 5,954
          </Text>
          <HStack gap={0} vAlign="center">
            <IconButton
              label="Newer"
              tooltip="Newer"
              variant="ghost"
              size="sm"
              icon={<ChevronLeft size={16} />}
              isDisabled
            />
            <IconButton
              label="Older"
              tooltip="Older"
              variant="ghost"
              size="sm"
              icon={<ChevronRight size={16} />}
            />
          </HStack>
        </HStack>
      </HStack>

      <Divider />

      {/* ── Subject & Thread Action Header ── */}
      <HStack
        hAlign="between"
        vAlign="center"
        width="100%"
        paddingInline={4}
        paddingBlock={3}
      >
        <HStack gap={3} vAlign="center" wrap="wrap">
          <Heading level={2} weight="semibold">
            {activeEmail.subject}
          </Heading>
          <Badge label="Inbox" variant="neutral" />
        </HStack>

        {/* Right Action Icons on Subject Line */}
        <HStack gap={1} vAlign="center">
          <IconButton
            label="Export as EML"
            tooltip="Download RFC 822 .eml"
            variant="ghost"
            size="sm"
            icon={<Download size={16} />}
            onClick={() => exportEmailAsEml(activeEmail.id)}
          />
          <IconButton
            label={allExpanded ? "Collapse all" : "Expand all"}
            tooltip={allExpanded ? "Collapse all" : "Expand all"}
            variant="ghost"
            size="sm"
            icon={<ChevronsUpDown size={16} />}
            onClick={allExpanded ? collapseAll : expandAll}
          />
          <IconButton
            label="Print all"
            tooltip="Print all"
            variant="ghost"
            size="sm"
            icon={<Printer size={16} />}
            onClick={() => window.print()}
          />
          <IconButton
            label="In new window"
            tooltip="In new window"
            variant="ghost"
            size="sm"
            icon={<ExternalLink size={16} />}
            onClick={() => window.open(window.location.href, "_blank")}
          />
        </HStack>
      </HStack>

      {/* Remote Image Privacy Protection Banner */}
      {!allowedRemoteImages.has(activeEmail.id) && (
        <HStack paddingInline={4} paddingBlock={1} width="100%">
          <Card padding={2} elevation="low" width="100%">
            <HStack hAlign="between" vAlign="center">
              <Text type="body" size="sm" color="secondary">
                🛡️ Remote tracker images have been blocked to protect your privacy.
              </Text>
              <Button
                variant="secondary"
                size="sm"
                label="Load Images"
                onClick={() => allowRemoteImagesForEmail(activeEmail.id)}
              />
            </HStack>
          </Card>
        </HStack>
      )}

      {/* ── Message Conversation Thread ── */}
      <VStack gap={0} width="100%">
        {messages.map((msg, idx) => {
          const isExpanded = isMsgExpanded(msg.id, idx, messages.length)
          const isStarred = messageStarred[msg.id] ?? msg.isStarred ?? activeEmail.isStarred

          if (!isExpanded) {
            // ── Collapsed Message Row (Avatar consistently size 36, identical alignment) ──
            return (
              <VStack key={msg.id} gap={0} width="100%">
                <HStack
                  hAlign="between"
                  vAlign="center"
                  width="100%"
                  paddingInline={4}
                  paddingBlock={2}
                  style={{ cursor: "pointer", userSelect: "none" }}
                  onClick={() => toggleExpand(msg.id, idx, messages.length)}
                >
                  <HStack gap={3} vAlign="center" style={{ minWidth: 0, flex: 1 }}>
                    <Avatar
                      name={msg.senderName}
                      src={msg.senderAvatar}
                      size={36}
                    />
                    <VStack gap={0.5} style={{ minWidth: 0, flex: 1 }}>
                      <HStack gap={1} vAlign="center" style={{ flexShrink: 0 }}>
                        <Text
                          type="body"
                          size="base"
                          weight="semibold"
                          color="primary"
                          maxLines={1}
                        >
                          {msg.senderName}
                        </Text>
                        {msg.isVerified && <VerifiedBadge />}
                      {(msg.pgpSignatureStatus === "valid" ||
                        msg.body?.includes("-----BEGIN PGP SIGNED MESSAGE-----")) && (
                        <Badge label="PGP Signed" variant="success" />
                      )}
                      {msg.pgpSignatureStatus === "invalid" && (
                        <Badge label="PGP Invalid" variant="error" />
                      )}
                      {msg.body?.includes("-----BEGIN PGP MESSAGE-----") && (
                        <Badge label="PGP Encrypted" variant="info" />
                      )}
                      </HStack>
                      <Text
                        type="body"
                        size="base"
                        color="secondary"
                        maxLines={1}
                      >
                        {msg.body.replace(/\n+/g, " ")}
                      </Text>
                    </VStack>
                  </HStack>

                  <HStack gap={2} vAlign="center">
                    <Text type="supporting" size="sm" color="secondary">
                      {msg.timestamp}
                    </Text>
                    <IconButton
                      label={isStarred ? "Starred" : "Not starred"}
                      variant="ghost"
                      size="sm"
                      icon={
                        isStarred ? (
                          <Star size={16} className="text-amber-500 fill-amber-500" />
                        ) : (
                          <Star size={16} />
                        )
                      }
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleMessageStar(msg.id)
                      }}
                    />
                  </HStack>
                </HStack>
                <Divider />
              </VStack>
            )
          }

          // ── Expanded Message (Avatar consistently size 36, identically aligned) ──
          return (
            <VStack
              key={msg.id}
              gap={3}
              width="100%"
              paddingInline={4}
              paddingBlock={3}
            >
              {/* Message Header */}
              <HStack hAlign="between" vAlign="center" width="100%">
                <HStack gap={3} vAlign="center" style={{ minWidth: 0 }}>
                  <Avatar
                    name={msg.senderName}
                    src={msg.senderAvatar}
                    size={36}
                  />
                  <VStack gap={0.5} style={{ minWidth: 0 }}>
                    <HStack gap={1.5} vAlign="center" wrap="wrap">
                      <Text
                        type="body"
                        size="base"
                        weight="semibold"
                        color="primary"
                      >
                        {msg.senderName}
                      </Text>
                      {msg.isVerified && <VerifiedBadge />}
                      {(msg.pgpSignatureStatus === "valid" ||
                        msg.body?.includes("-----BEGIN PGP SIGNED MESSAGE-----")) && (
                        <Badge label="PGP Signed" variant="success" />
                      )}
                      {msg.pgpSignatureStatus === "invalid" && (
                        <Badge label="PGP Invalid" variant="error" />
                      )}
                      {msg.body?.includes("-----BEGIN PGP MESSAGE-----") && (
                        <Badge label="PGP Encrypted" variant="info" />
                      )}
                      <Text
                        type="supporting"
                        size="sm"
                        color="secondary"
                      >
                        &lt;{msg.senderEmail}&gt;
                      </Text>
                    </HStack>

                    {/* "to me ▼" View Details Popover */}
                    <Popover
                      label="Message details"
                      placement="below"
                      alignment="start"
                      width={380}
                      padding={2}
                      content={
                        <VStack gap={1} width="100%">
                          <HStack gap={2} vAlign="start">
                            <Text
                              type="supporting"
                              size="sm"
                              color="secondary"
                              style={{ width: 64, textAlign: "right", flexShrink: 0 }}
                            >
                              from:
                            </Text>
                            <Text type="body" size="sm" color="primary">
                              <Text as="span" size="sm" weight="semibold">
                                {msg.senderName}
                              </Text>{" "}
                              <Text as="span" size="sm" color="secondary">
                                &lt;{msg.senderEmail}&gt;
                              </Text>
                            </Text>
                          </HStack>

                          <HStack gap={2} vAlign="start">
                            <Text
                              type="supporting"
                              size="sm"
                              color="secondary"
                              style={{ width: 64, textAlign: "right", flexShrink: 0 }}
                            >
                              reply-to:
                            </Text>
                            <Text type="body" size="sm" color="primary">
                              {msg.replyToEmail || msg.senderEmail}
                            </Text>
                          </HStack>

                          <HStack gap={2} vAlign="start">
                            <Text
                              type="supporting"
                              size="sm"
                              color="secondary"
                              style={{ width: 64, textAlign: "right", flexShrink: 0 }}
                            >
                              to:
                            </Text>
                            <Text type="body" size="sm" color="primary">
                              {msg.recipientEmail}
                            </Text>
                          </HStack>

                          <HStack gap={2} vAlign="start">
                            <Text
                              type="supporting"
                              size="sm"
                              color="secondary"
                              style={{ width: 64, textAlign: "right", flexShrink: 0 }}
                            >
                              date:
                            </Text>
                            <Text type="body" size="sm" color="primary">
                              {msg.fullDate}
                            </Text>
                          </HStack>

                          <HStack gap={2} vAlign="start">
                            <Text
                              type="supporting"
                              size="sm"
                              color="secondary"
                              style={{ width: 64, textAlign: "right", flexShrink: 0 }}
                            >
                              subject:
                            </Text>
                            <Text type="body" size="sm" color="primary">
                              {activeEmail.subject}
                            </Text>
                          </HStack>

                          <HStack gap={2} vAlign="start">
                            <Text
                              type="supporting"
                              size="sm"
                              color="secondary"
                              style={{ width: 64, textAlign: "right", flexShrink: 0 }}
                            >
                              mailed-by:
                            </Text>
                            <Text type="body" size="sm" color="primary">
                              {msg.mailedBy || "krxemails.hdfcbank.net"}
                            </Text>
                          </HStack>

                          <HStack gap={2} vAlign="start">
                            <Text
                              type="supporting"
                              size="sm"
                              color="secondary"
                              style={{ width: 64, textAlign: "right", flexShrink: 0 }}
                            >
                              signed-by:
                            </Text>
                            <Text type="body" size="sm" color="primary">
                              {msg.signedBy || "hdfcbank.net"}
                            </Text>
                          </HStack>

                          <HStack gap={2} vAlign="center">
                            <Text
                              type="supporting"
                              size="sm"
                              color="secondary"
                              style={{ width: 64, textAlign: "right", flexShrink: 0 }}
                            >
                              security:
                            </Text>
                            <HStack gap={1} vAlign="center" wrap="wrap">
                              <Lock size={12} />
                              <Text type="body" size="sm" color="primary">
                                {msg.security || "Standard encryption (TLS)"}
                              </Text>
                              <a
                                href="https://support.google.com/mail/answer/6330403"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  fontSize: "var(--font-size-sm, 12px)",
                                  color: "var(--color-primary, #2563eb)",
                                  textDecoration: "underline",
                                  marginLeft: 4,
                                }}
                              >
                                Learn more
                              </a>
                            </HStack>
                          </HStack>
                        </VStack>
                      }
                    >
                      <button
                        type="button"
                        aria-label="View message details"
                        style={{
                          cursor: "pointer",
                          background: "transparent",
                          border: "none",
                          padding: 0,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Text type="supporting" size="sm" color="secondary">
                          to me
                        </Text>
                        <ChevronDown size={12} />
                      </button>
                    </Popover>
                  </VStack>
                </HStack>

                {/* Right Actions on Message Header */}
                <HStack gap={1} vAlign="center">
                  <Text
                    type="supporting"
                    size="sm"
                    color="secondary"
                  >
                    {msg.timestamp}
                  </Text>
                  <IconButton
                    label={isStarred ? "Starred" : "Not starred"}
                    variant="ghost"
                    size="sm"
                    icon={
                      isStarred ? (
                        <Star size={16} className="text-amber-500 fill-amber-500" />
                      ) : (
                        <Star size={16} />
                      )
                    }
                    onClick={() => toggleMessageStar(msg.id)}
                  />
                  <IconButton
                    label="Add reaction"
                    tooltip="Add reaction"
                    variant="ghost"
                    size="sm"
                    icon={<Smile size={16} />}
                  />
                  <IconButton
                    label="Reply"
                    tooltip="Reply"
                    variant="ghost"
                    size="sm"
                    icon={<Reply size={16} />}
                    onClick={() => setIsReplying(true)}
                  />
                  <DropdownMenu
                    alignment="end"
                    renderTrigger={(triggerProps) => (
                      <IconButton
                        label="More options"
                        tooltip="More options"
                        variant="ghost"
                        size="sm"
                        icon={<MoreVertical size={16} />}
                        {...triggerProps}
                      />
                    )}
                    items={[
                      {
                        label: "Reply",
                        onClick: () => setIsReplying(true),
                      },
                      {
                        label: "Print message",
                        onClick: () => printSingleMessage(msg),
                      },
                      {
                        label: "Export as EML",
                        onClick: () => exportEmailAsEml(activeEmail.id),
                      },
                      {
                        label: "Filter messages like this",
                        href: "/mail/filters",
                      },
                    ]}
                  />
                </HStack>
              </HStack>

              {/* Message Body Content (Aligned at 48px with sender text column) */}
              <VStack
                gap={3}
                width="100%"
                style={{ paddingInlineStart: 48 }}
                paddingBlockStart={2}
              >
                {msg.htmlBody ? (
                  <HtmlEmailViewer html={msg.htmlBody} />
                ) : (
                  <>
                    {msg.body.split("\n\n").map((para, pIdx) => (
                      <Text key={pIdx} type="body" size="base" color="primary">
                        {para}
                      </Text>
                    ))}

                    {/* Badge-like button for showing trimmed content */}
                    <HStack vAlign="center" paddingBlockStart={1}>
                      <button
                        type="button"
                        onClick={() => toggleTrimmed(msg.id)}
                        title="Show trimmed content"
                        style={{
                          cursor: "pointer",
                          background: "transparent",
                          border: "none",
                          padding: 0,
                          display: "inline-flex",
                        }}
                      >
                        <Badge
                          label={
                            <Text as="span" weight="bold" style={{ letterSpacing: "1px" }}>
                              ···
                            </Text>
                          }
                          variant="neutral"
                        />
                      </button>
                    </HStack>

                    {/* Revealed trimmed content (displayed normally as other normal message content) */}
                    {trimmedOpen[msg.id] && (
                      <VStack gap={2} width="100%">
                        <Text type="body" size="base" color="primary">
                          Sincerely,
                        </Text>
                        <Text type="body" size="base" color="primary">
                          {msg.senderName}
                        </Text>
                        <Text type="body" size="base" color="primary">
                          Security Ref: #SOC2-{msg.id.toUpperCase()}
                        </Text>
                      </VStack>
                    )}
                  </>
                )}

                {/* Attachments if any */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <VStack gap={2} width="100%" paddingBlockStart={2}>
                    <HStack gap={1} vAlign="center">
                      <Paperclip size={14} />
                      <Text type="supporting" size="sm" color="secondary" weight="semibold">
                        {msg.attachments.length} Attachment
                        {msg.attachments.length > 1 ? "s" : ""}
                      </Text>
                    </HStack>

                    <HStack gap={3} wrap="wrap">
                      {msg.attachments.map((att) => (
                        <Card key={att.id} padding={2} variant="muted" width={240}>
                          <HStack hAlign="between" vAlign="center" width="100%">
                            <HStack gap={2} vAlign="center">
                              {getAttachmentIcon(att.name, att.type)}
                              <VStack gap={0}>
                                <Text type="body" size="xsm" weight="medium" maxLines={1}>
                                  {att.name}
                                </Text>
                                <Text type="supporting" size="xsm" color="secondary">
                                  {att.size}
                                </Text>
                              </VStack>
                            </HStack>
                            <IconButton
                              label="Download attachment"
                              tooltip="Download"
                              variant="ghost"
                              size="sm"
                              icon={<Download size={14} />}
                            />
                          </HStack>
                        </Card>
                      ))}
                    </HStack>
                  </VStack>
                )}
              </VStack>

              {/* Bottom Action Pill Buttons (Reply, Forward, Reaction aligned at 48px) */}
              <HStack gap={2} vAlign="center" style={{ paddingInlineStart: 48 }} paddingBlockStart={2}>
                <Button
                  label="Reply"
                  icon={<Reply size={16} />}
                  variant="secondary"
                  size="md"
                  onClick={() => setIsReplying(true)}
                />
                <Button
                  label="Forward"
                  icon={<Forward size={16} />}
                  variant="secondary"
                  size="md"
                  onClick={handleStartForward}
                />
                <IconButton
                  label="Add reaction"
                  tooltip="Add reaction"
                  icon={<Smile size={18} />}
                  variant="secondary"
                  size="md"
                />
              </HStack>

              <Divider />
            </VStack>
          )
        })}
      </VStack>

      {/* ── Quick Reply Composer ── */}
      {isReplying && (
        <VStack paddingInline={4} paddingBlock={4} width="100%">
          <Card padding={4} variant="muted" width="100%">
            <VStack gap={3} width="100%">
              <HStack gap={2} vAlign="center">
                <Reply size={16} />
                <Text type="supporting" size="sm" weight="medium">
                  Reply to {activeEmail.senderName} ({activeEmail.senderEmail})
                </Text>
              </HStack>

              <TextArea
                label="Reply message"
                isLabelHidden
                placeholder="Type your reply here..."
                value={replyText}
                onChange={(val) => setReplyText(val)}
                rows={4}
                width="100%"
              />

              <HStack hAlign="between" vAlign="center" width="100%">
                <HStack gap={2}>
                  <Button
                    label="Send"
                    variant="primary"
                    size="md"
                    icon={<Send size={16} />}
                    onClick={handleSendReply}
                    isDisabled={!replyText.trim()}
                  />
                  <Button
                    label="Discard"
                    variant="ghost"
                    size="md"
                    onClick={() => {
                      setIsReplying(false)
                      setReplyText("")
                    }}
                  />
                </HStack>

                <Text type="supporting" size="xsm" color="secondary">
                  Sent via Postarc TLS
                </Text>
              </HStack>
            </VStack>
          </Card>
        </VStack>
      )}
    </VStack>
  )
}
