"use client"

import React, { createContext, useContext, useState, useMemo, useEffect } from "react"
import { useToast } from "@astryxdesign/core/Toast"
import { Button } from "@astryxdesign/core/Button"
import type { EmailThread, EmailCategory, EmailFolder, EmailAttachment, ThreadMessage, CustomMailboxFolder } from "@/types/email"
import { initialMockEmails } from "@/lib/mock-emails"
import { formatDateTime } from "@/lib/format-date"
import {
  postarcApi,
  type PostarcIdentity,
  type CannedResponse,
  type PostarcContact,
  type VacationResponseConfig,
  type QuotaInfo,
} from "@/lib/postarc-api"

interface EmailSnapshot {
  id: string
  folder: EmailFolder
  timestamp: string
  isUnread: boolean
}

interface MailContextType {
  emails: EmailThread[]
  activeEmailId: string | null
  activeEmail: EmailThread | null
  activeCategory: EmailCategory
  activeFolder: EmailFolder
  selectedIds: Set<string>
  isComposeOpen: boolean
  searchQuery: string
  notification: string | null
  unreadCounts: {
    primary: number
    promotions: number
    social: number
    updates: number
    inbox: number
    starred: number
    drafts: number
  }
  // Folder management
  customFolders: CustomMailboxFolder[]
  createCustomFolder: (name: string, color?: string) => void
  deleteCustomFolder: (id: string) => void
  moveEmailsToFolder: (ids: string[], targetFolder: EmailFolder) => void
  // Roundcube: Identities
  identities: PostarcIdentity[]
  activeIdentity: PostarcIdentity
  setActiveIdentity: (identity: PostarcIdentity) => void
  // Roundcube: Canned responses / Templates
  cannedResponses: CannedResponse[]
  addCannedResponse: (title: string, body: string, subject?: string) => void
  deleteCannedResponse: (id: string) => void
  // Roundcube: Contacts & Autocomplete
  contacts: PostarcContact[]
  // Roundcube: Privacy & Remote image blocking
  allowedRemoteImages: Set<string>
  allowRemoteImagesForEmail: (emailId: string) => void
  // Roundcube: EML import / export
  exportEmailAsEml: (emailId: string) => void
  importEmlFile: (file: File) => Promise<void>
  // Roundcube: Vacation auto-responder
  vacationConfig: VacationResponseConfig
  setVacationConfig: (config: VacationResponseConfig) => void
  // Roundcube: Quota gauge
  quotaInfo: QuotaInfo
  // Standard actions
  openEmail: (id: string) => void
  closeEmail: () => void
  toggleStar: (id: string, e?: React.MouseEvent) => void
  toggleSelect: (id: string) => void
  selectAll: (mode?: "all" | "none" | "read" | "unread" | "starred") => void
  archiveSelected: (idsOrEvent?: string[] | React.MouseEvent) => void
  deleteSelected: (idsOrEvent?: string[] | React.MouseEvent) => void
  reportSpam: (idsOrEvent?: string[] | React.MouseEvent) => void
  markSelectedAsRead: () => void
  markSelectedAsUnread: () => void
  toggleEmailRead: (id: string) => void
  snoozeEmails: (ids: string[], untilText: string) => void
  replyToEmail: (threadId: string, replyText: string) => void
  openCompose: () => void
  closeCompose: () => void
  sendEmail: (
    to: string,
    subject: string,
    body: string,
    attachments?: EmailAttachment[],
    identityId?: string
  ) => void
  saveDraft: (to: string, subject: string, body: string, attachments?: EmailAttachment[]) => void
  dismissNotification: () => void
  setActiveCategory: (category: EmailCategory) => void
  setActiveFolder: (folder: EmailFolder) => void
  setSearchQuery: (query: string) => void
}

const MailContext = createContext<MailContextType | null>(null)

export function MailProvider({ children }: { children: React.ReactNode }) {
  const [emails, setEmails] = useState<EmailThread[]>(initialMockEmails)
  const [activeEmailId, setActiveEmailId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<EmailCategory>("primary")
  const [activeFolder, setActiveFolder] = useState<EmailFolder>("inbox")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Roundcube Features State
  const [identities] = useState<PostarcIdentity[]>(postarcApi.getIdentities())
  const [activeIdentity, setActiveIdentity] = useState<PostarcIdentity>(identities[0])
  const [cannedResponses, setCannedResponses] = useState<CannedResponse[]>(postarcApi.getCannedResponses())
  const [contacts] = useState<PostarcContact[]>(postarcApi.getContacts())
  const [allowedRemoteImages, setAllowedRemoteImages] = useState<Set<string>>(new Set())
  const [vacationConfig, setVacationConfig] = useState<VacationResponseConfig>(postarcApi.getVacationConfig())
  const [quotaInfo] = useState<QuotaInfo>(postarcApi.getStorageQuota())

  // Custom Folders
  const [customFolders, setCustomFolders] = useState<CustomMailboxFolder[]>([
    { id: "cf_projects", name: "Strategic Projects", totalCount: 14, unreadCount: 2, color: "#3B82F6" },
    { id: "cf_receipts", name: "Invoices & Receipts", totalCount: 28, unreadCount: 0, color: "#10B981" },
  ])

  // Live JMAP Sync: query engine whenever active folder changes
  useEffect(() => {
    let isMounted = true
    postarcApi
      .getEmails(activeFolder)
      .then((liveEmails) => {
        if (isMounted && liveEmails && liveEmails.length > 0) {
          setEmails((prev) => {
            const liveIds = new Set(liveEmails.map((e) => e.id))
            const localOnly = prev.filter(
              (e) => !liveIds.has(e.id) && (e.folder === "sent" || e.folder === "drafts" || e.id.startsWith("imported_"))
            )
            return [...liveEmails, ...localOnly]
          })
        }
      })
      .catch(() => {
        // Gracefully keep current state in preview / offline mode
      })
    return () => {
      isMounted = false
    }
  }, [activeFolder])

  const showToast = useToast()

  const triggerActionToast = (message: string, snapshots: EmailSnapshot[]) => {
    let dismissToast: (() => void) | null = null
    dismissToast = showToast({
      body: message,
      type: "info",
      isAutoHide: true,
      autoHideDuration: 7000,
      endContent: (
        <Button
          label="Undo"
          variant="ghost"
          size="sm"
          onClick={() => {
            setEmails((prev) =>
              prev.map((e) => {
                const snap = snapshots.find((s) => s.id === e.id)
                if (snap) {
                  return {
                    ...e,
                    folder: snap.folder,
                    timestamp: snap.timestamp,
                    isUnread: snap.isUnread,
                  }
                }
                return e
              })
            )
            dismissToast?.()
            showToast({
              body: "Action undone.",
              type: "info",
              isAutoHide: true,
              autoHideDuration: 3000,
            })
          }}
        />
      ),
    })
  }

  const activeEmail = useMemo(
    () => emails.find((e) => e.id === activeEmailId) || null,
    [emails, activeEmailId]
  )

  const unreadCounts = useMemo(() => {
    return {
      primary: emails.filter((e) => e.category === "primary" && e.isUnread && e.folder === "inbox").length,
      promotions: emails.filter((e) => e.category === "promotions" && e.isUnread && e.folder === "inbox").length,
      social: emails.filter((e) => e.category === "social" && e.isUnread && e.folder === "inbox").length,
      updates: emails.filter((e) => e.category === "updates" && e.isUnread && e.folder === "inbox").length,
      inbox: emails.filter((e) => e.folder === "inbox" && e.isUnread).length,
      starred: emails.filter((e) => e.isStarred && e.isUnread).length,
      drafts: emails.filter((e) => e.folder === "drafts").length,
    }
  }, [emails])

  // Drag and Drop & Folder Moving
  const moveEmailsToFolder = (ids: string[], targetFolder: EmailFolder) => {
    if (ids.length === 0) return
    const idSet = new Set(ids)
    const snapshots: EmailSnapshot[] = emails
      .filter((e) => idSet.has(e.id))
      .map((e) => ({
        id: e.id,
        folder: e.folder,
        timestamp: e.timestamp,
        isUnread: e.isUnread,
      }))

    setEmails((prev) =>
      prev.map((e) => (idSet.has(e.id) ? { ...e, folder: targetFolder } : e))
    )

    if (activeEmailId && idSet.has(activeEmailId)) {
      setActiveEmailId(null)
    }
    setSelectedIds(new Set())

    triggerActionToast(
      `Moved ${ids.length} message${ids.length > 1 ? "s" : ""} to ${targetFolder}.`,
      snapshots
    )
  }

  const createCustomFolder = (name: string, color?: string) => {
    if (!name.trim()) return
    const newFolder: CustomMailboxFolder = {
      id: `cf_${Date.now()}`,
      name: name.trim(),
      totalCount: 0,
      unreadCount: 0,
      color: color || "#6366F1",
    }
    setCustomFolders((prev) => [...prev, newFolder])
    showToast({
      body: `Folder "${name}" created.`,
      type: "info",
      isAutoHide: true,
      autoHideDuration: 3000,
    })
  }

  const deleteCustomFolder = (id: string) => {
    setCustomFolders((prev) => prev.filter((f) => f.id !== id))
    // Move any emails in that folder back to inbox
    setEmails((prev) => prev.map((e) => (e.folder === id ? { ...e, folder: "inbox" } : e)))
    if (activeFolder === id) {
      setActiveFolder("inbox")
    }
  }

  // Canned Responses
  const addCannedResponse = (title: string, body: string, subject?: string) => {
    const newCr: CannedResponse = {
      id: `cr_${Date.now()}`,
      title,
      body,
      subject,
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setCannedResponses((prev) => [newCr, ...prev])
    showToast({
      body: "Template saved.",
      type: "info",
      isAutoHide: true,
      autoHideDuration: 3000,
    })
  }

  const deleteCannedResponse = (id: string) => {
    setCannedResponses((prev) => prev.filter((c) => c.id !== id))
  }

  // Remote image blocking
  const allowRemoteImagesForEmail = (emailId: string) => {
    setAllowedRemoteImages((prev) => new Set([...prev, emailId]))
    showToast({
      body: "Remote images loaded for this message.",
      type: "info",
      isAutoHide: true,
      autoHideDuration: 3000,
    })
  }

  // EML Export (RFC 822)
  const exportEmailAsEml = (emailId: string) => {
    const email = emails.find((e) => e.id === emailId)
    if (!email) return

    const emlContent = [
      `From: "${email.senderName}" <${email.senderEmail}>`,
      `To: <${email.recipientEmail}>`,
      `Subject: ${email.subject}`,
      `Date: ${new Date().toUTCString()}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/plain; charset=UTF-8`,
      `X-Mailer: Postarc Webmail 1.0`,
      ``,
      email.body || email.snippet,
    ].join("\r\n")

    const blob = new Blob([emlContent], { type: "message/rfc822" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${email.subject.replace(/[^a-zA-Z0-9_-]/g, "_") || "email"}.eml`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showToast({
      body: "Downloaded as .eml file.",
      type: "info",
      isAutoHide: true,
      autoHideDuration: 3000,
    })
  }

  // EML Import
  const importEmlFile = async (file: File) => {
    const text = await file.text()
    const subjectMatch = text.match(/^Subject:\s*(.*)$/im)
    const fromMatch = text.match(/^From:\s*(.*)$/im)
    const toMatch = text.match(/^To:\s*(.*)$/im)
    const subject = subjectMatch ? subjectMatch[1].trim() : file.name.replace(/\.eml$/i, "")
    const from = fromMatch ? fromMatch[1].trim() : "Imported Message"
    const to = toMatch ? toMatch[1].trim() : "me@postarc.local"

    const bodyParts = text.split(/\r?\n\r?\n/)
    const body = bodyParts.slice(1).join("\n\n") || "Imported email content."

    const importedThread: EmailThread = {
      id: `imported_${Date.now()}`,
      senderName: from.replace(/<.*>/, "").trim() || from,
      senderEmail: from.match(/<([^>]+)>/)?.[1] || from,
      recipientEmail: to.match(/<([^>]+)>/)?.[1] || to,
      subject,
      snippet: body.slice(0, 100),
      body,
      timestamp: "Just imported",
      fullDate: formatDateTime(new Date()),
      category: "primary",
      folder: activeFolder,
      isUnread: false,
      isStarred: false,
    }

    setEmails((prev) => [importedThread, ...prev])
    showToast({
      body: `Imported "${subject}" into ${activeFolder}.`,
      type: "info",
      isAutoHide: true,
      autoHideDuration: 3000,
    })
  }

  const openEmail = (id: string) => {
    setActiveEmailId(id)
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isUnread: false } : e))
    )
  }

  const closeEmail = () => {
    setActiveEmailId(null)
  }

  const toggleStar = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setEmails((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isStarred: !item.isStarred } : item
      )
    )
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = (mode: "all" | "none" | "read" | "unread" | "starred" = "all") => {
    const currentList = emails.filter((e) => {
      if (activeFolder === "inbox") return e.folder === "inbox" && e.category === activeCategory
      return e.folder === activeFolder
    })

    if (mode === "none") {
      setSelectedIds(new Set())
      return
    }

    const filtered = currentList.filter((e) => {
      if (mode === "read") return !e.isUnread
      if (mode === "unread") return e.isUnread
      if (mode === "starred") return e.isStarred
      return true
    })

    setSelectedIds(new Set(filtered.map((e) => e.id)))
  }

  const archiveSelected = (idsOrEvent?: string[] | React.MouseEvent) => {
    const idsToArchive = Array.isArray(idsOrEvent)
      ? idsOrEvent
      : selectedIds.size > 0
      ? Array.from(selectedIds)
      : activeEmailId
      ? [activeEmailId]
      : []

    if (idsToArchive.length === 0) return
    moveEmailsToFolder(idsToArchive, "archive")
  }

  const deleteSelected = (idsOrEvent?: string[] | React.MouseEvent) => {
    const idsToDelete = Array.isArray(idsOrEvent)
      ? idsOrEvent
      : selectedIds.size > 0
      ? Array.from(selectedIds)
      : activeEmailId
      ? [activeEmailId]
      : []

    if (idsToDelete.length === 0) return
    moveEmailsToFolder(idsToDelete, "trash")
  }

  const reportSpam = (idsOrEvent?: string[] | React.MouseEvent) => {
    const idsToSpam = Array.isArray(idsOrEvent)
      ? idsOrEvent
      : selectedIds.size > 0
      ? Array.from(selectedIds)
      : activeEmailId
      ? [activeEmailId]
      : []

    if (idsToSpam.length === 0) return
    moveEmailsToFolder(idsToSpam, "spam")
  }

  const markSelectedAsRead = () => {
    const targets = selectedIds.size > 0 ? selectedIds : activeEmailId ? new Set([activeEmailId]) : new Set()
    if (targets.size === 0) return

    setEmails((prev) =>
      prev.map((e) => (targets.has(e.id) ? { ...e, isUnread: false } : e))
    )
    setSelectedIds(new Set())
  }

  const markSelectedAsUnread = () => {
    const targets = selectedIds.size > 0 ? selectedIds : activeEmailId ? new Set([activeEmailId]) : new Set()
    if (targets.size === 0) return

    setEmails((prev) =>
      prev.map((e) => (targets.has(e.id) ? { ...e, isUnread: true } : e))
    )
    setSelectedIds(new Set())
    if (activeEmailId) setActiveEmailId(null)
  }

  const toggleEmailRead = (id: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isUnread: !e.isUnread } : e))
    )
  }

  const snoozeEmails = (ids: string[], untilText: string) => {
    if (ids.length === 0) return
    const idSet = new Set(ids)
    setEmails((prev) =>
      prev.map((e) => (idSet.has(e.id) ? { ...e, folder: "snoozed" } : e))
    )
    if (activeEmailId && idSet.has(activeEmailId)) setActiveEmailId(null)
    setSelectedIds(new Set())
    showToast({
      body: `Snoozed ${ids.length} message(s) until ${untilText}.`,
      type: "info",
      isAutoHide: true,
      autoHideDuration: 4000,
    })
  }

  const replyToEmail = (threadId: string, replyText: string) => {
    if (!replyText.trim()) return

    const thread = emails.find((e) => e.id === threadId)
    if (!thread) return

    const newReply: ThreadMessage = {
      id: `rep_${Date.now()}`,
      senderName: activeIdentity.name,
      senderEmail: activeIdentity.email,
      recipientEmail: thread.senderEmail,
      body: replyText,
      timestamp: "Just now",
      fullDate: formatDateTime(new Date()),
      isFromMe: true,
      isVerified: true,
    }

    setEmails((prev) =>
      prev.map((e) => {
        if (e.id === threadId) {
          const currentMessages = e.messages || [
            {
              id: e.id,
              senderName: e.senderName,
              senderEmail: e.senderEmail,
              recipientEmail: e.recipientEmail,
              body: e.body,
              timestamp: e.timestamp,
              fullDate: e.fullDate,
              isFromMe: false,
              isVerified: e.isVerified,
            },
          ]
          return {
            ...e,
            messages: [...currentMessages, newReply],
            threadCount: (e.threadCount || 1) + 1,
            timestamp: "Just now",
          }
        }
        return e
      })
    )

    showToast({
      body: "Reply sent.",
      type: "info",
      isAutoHide: true,
      autoHideDuration: 3000,
    })
  }

  const openCompose = () => setIsComposeOpen(true)
  const closeCompose = () => setIsComposeOpen(false)

  const sendEmail = (
    to: string,
    subject: string,
    body: string,
    attachments?: EmailAttachment[],
    identityId?: string
  ) => {
    const sender = identities.find((i) => i.id === identityId) || activeIdentity

    const newMsgId = `sent_${Date.now()}`
    const newMsg: EmailThread = {
      id: newMsgId,
      senderName: sender.name,
      senderEmail: sender.email,
      recipientEmail: to,
      subject: subject || "(no subject)",
      snippet: body.slice(0, 100),
      body,
      timestamp: "Just now",
      fullDate: formatDateTime(new Date()),
      category: "primary",
      folder: "sent",
      isUnread: false,
      isStarred: false,
      attachments,
    }

    setEmails((prev) => [newMsg, ...prev])
    setIsComposeOpen(false)

    postarcApi.sendEmail({
      to,
      subject,
      body,
      fromIdentityId: sender.id,
      attachments,
    })

    showToast({
      body: `Message sent from ${sender.email}.`,
      type: "info",
      isAutoHide: true,
      autoHideDuration: 4000,
    })
  }

  const saveDraft = (to: string, subject: string, body: string, attachments?: EmailAttachment[]) => {
    if (!to.trim() && !subject.trim() && !body.trim()) return

    const newDraft: EmailThread = {
      id: `draft_${Date.now()}`,
      senderName: activeIdentity.name,
      senderEmail: activeIdentity.email,
      recipientEmail: to.trim() || "(No recipient)",
      subject: subject.trim() || "(Draft with no subject)",
      snippet: body.slice(0, 100) || "(No body)",
      body,
      timestamp: "Draft",
      fullDate: formatDateTime(new Date()),
      category: "primary",
      folder: "drafts",
      isUnread: false,
      isStarred: false,
      attachments,
    }

    setEmails((prev) => [newDraft, ...prev])
    showToast({
      body: "Draft saved.",
      type: "info",
      isAutoHide: true,
      autoHideDuration: 3000,
    })
  }

  return (
    <MailContext.Provider
      value={{
        emails,
        activeEmailId,
        activeEmail,
        activeCategory,
        activeFolder,
        selectedIds,
        isComposeOpen,
        searchQuery,
        notification: null,
        unreadCounts,
        customFolders,
        createCustomFolder,
        deleteCustomFolder,
        moveEmailsToFolder,
        identities,
        activeIdentity,
        setActiveIdentity,
        cannedResponses,
        addCannedResponse,
        deleteCannedResponse,
        contacts,
        allowedRemoteImages,
        allowRemoteImagesForEmail,
        exportEmailAsEml,
        importEmlFile,
        vacationConfig,
        setVacationConfig,
        quotaInfo,
        openEmail,
        closeEmail,
        toggleStar,
        toggleSelect,
        selectAll,
        archiveSelected,
        deleteSelected,
        reportSpam,
        markSelectedAsRead,
        markSelectedAsUnread,
        toggleEmailRead,
        snoozeEmails,
        replyToEmail,
        openCompose,
        closeCompose,
        sendEmail,
        saveDraft,
        dismissNotification: () => {},
        setActiveCategory,
        setActiveFolder,
        setSearchQuery,
      }}
    >
      {children}
    </MailContext.Provider>
  )
}

export function useMail() {
  const context = useContext(MailContext)
  if (!context) {
    throw new Error("useMail must be used within a MailProvider")
  }
  return context
}
