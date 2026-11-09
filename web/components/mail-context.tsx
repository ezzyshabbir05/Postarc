"use client"

import React, { createContext, useContext, useState, useMemo, useEffect } from "react"
import { useToast } from "@astryxdesign/core/Toast"
import { Button } from "@astryxdesign/core/Button"
import type { EmailThread, EmailCategory, EmailFolder, EmailAttachment, ThreadMessage, CustomMailboxFolder } from "@/types/email"
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
  createCustomFolder: (name: string, color?: string) => Promise<void>
  deleteCustomFolder: (id: string) => Promise<void>
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
  setVacationConfig: (config: VacationResponseConfig) => Promise<void>
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
  ) => Promise<void>
  saveDraft: (to: string, subject: string, body: string, attachments?: EmailAttachment[]) => void
  dismissNotification: () => void
  setActiveCategory: (category: EmailCategory) => void
  setActiveFolder: (folder: EmailFolder) => void
  setSearchQuery: (query: string) => void
}

const MailContext = createContext<MailContextType | null>(null)

export function MailProvider({ children }: { children: React.ReactNode }) {
  const [emails, setEmails] = useState<EmailThread[]>([])
  const [activeEmailId, setActiveEmailId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<EmailCategory>("primary")
  const [activeFolder, setActiveFolder] = useState<EmailFolder>("inbox")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Roundcube Real State (Zero Mock)
  const defaultIdentity: PostarcIdentity = {
    id: "id_default",
    name: "Mailbox Owner",
    email: "user@postarc.local",
    isDefault: true,
  }
  const [identities, setIdentities] = useState<PostarcIdentity[]>([defaultIdentity])
  const [activeIdentity, setActiveIdentity] = useState<PostarcIdentity>(defaultIdentity)
  const [cannedResponses, setCannedResponses] = useState<CannedResponse[]>([])
  const [contacts, setContacts] = useState<PostarcContact[]>([])
  const [allowedRemoteImages, setAllowedRemoteImages] = useState<Set<string>>(new Set())
  const [vacationConfig, setVacationConfigState] = useState<VacationResponseConfig>({
    isEnabled: false,
    subject: "",
    textBody: "",
  })
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo>({
    usedBytes: 0,
    totalBytes: 15 * 1024 * 1024 * 1024,
    percent: 0,
  })

  // Custom Folders from JMAP Mailboxes
  const [customFolders, setCustomFolders] = useState<CustomMailboxFolder[]>([])

  const showToast = useToast()

  // ── Initial Live Data Hydration from Postarc Engine ────────────────────────
  useEffect(() => {
    let isMounted = true

    // Fetch JMAP Mailboxes
    postarcApi
      .getMailboxes()
      .then((mboxes) => {
        if (!isMounted) return
        const custom = mboxes
          .filter((m) => !m.role)
          .map((m) => ({
            id: m.id,
            name: m.name,
            totalCount: m.totalEmails,
            unreadCount: m.unreadEmails,
            color: "#6366F1",
          }))
        setCustomFolders(custom)
      })
      .catch(() => {})

    // Fetch JMAP Identities
    postarcApi
      .getIdentities()
      .then((ids) => {
        if (!isMounted || ids.length === 0) return
        setIdentities(ids)
        const def = ids.find((i) => i.isDefault) || ids[0]
        setActiveIdentity(def)
      })
      .catch(() => {})

    // Fetch JMAP Contacts
    postarcApi
      .getContacts()
      .then((cnts) => {
        if (!isMounted) return
        setContacts(cnts)
      })
      .catch(() => {})

    // Fetch JMAP Quota
    postarcApi
      .getStorageQuota()
      .then((q) => {
        if (!isMounted) return
        setQuotaInfo(q)
      })
      .catch(() => {})

    // Fetch JMAP Vacation Response
    postarcApi
      .getVacationConfig()
      .then((v) => {
        if (!isMounted) return
        setVacationConfigState(v)
      })
      .catch(() => {})

    // Load Canned Responses from Local Persistent Store
    setCannedResponses(postarcApi.getCannedResponses())

    return () => {
      isMounted = false
    }
  }, [])

  // ── Live Email Fetch on Folder Change & WebSocket Live Push ───────────────
  useEffect(() => {
    let isMounted = true
    const fetchEmails = () => {
      postarcApi
        .getEmails(activeFolder)
        .then((liveEmails) => {
          if (isMounted) {
            setEmails(liveEmails)
          }
        })
        .catch(() => {
          if (isMounted) setEmails([])
        })
    }

    fetchEmails()

    // Real-Time JMAP WebSocket Push (RFC 8887)
    const disconnectWs = postarcApi.connectWebSocket((change) => {
      if (!isMounted) return
      fetchEmails()
      postarcApi
        .getMailboxes()
        .then((mboxes) => {
          if (!isMounted || mboxes.length === 0) return
          const custom: CustomMailboxFolder[] = mboxes
            .filter((m) => !m.role)
            .map((m) => ({
              id: m.id,
              name: m.name,
              totalCount: m.totalEmails,
              unreadCount: m.unreadEmails,
            }))
          setCustomFolders(custom)
        })
        .catch(() => {})
      postarcApi
        .getStorageQuota()
        .then((q) => {
          if (isMounted && q) setQuotaInfo(q)
        })
        .catch(() => {})
    })

    return () => {
      isMounted = false
      disconnectWs()
    }
  }, [activeFolder])

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

  // ── Drag and Drop & Folder Moving with Real JMAP Persist ──────────────────
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

    // Optimistic UI update
    setEmails((prev) =>
      prev.map((e) => (idSet.has(e.id) ? { ...e, folder: targetFolder } : e))
    )

    if (activeEmailId && idSet.has(activeEmailId)) {
      setActiveEmailId(null)
    }
    setSelectedIds(new Set())

    // Real JMAP mutation
    ids.forEach((id) => {
      postarcApi.moveEmail(id, targetFolder).catch(console.error)
    })

    triggerActionToast(
      `Moved ${ids.length} message${ids.length > 1 ? "s" : ""} to ${targetFolder}.`,
      snapshots
    )
  }

  const createCustomFolder = async (name: string, color?: string) => {
    if (!name.trim()) return
    try {
      const serverId = await postarcApi.createMailbox(name.trim())
      const newFolder: CustomMailboxFolder = {
        id: serverId,
        name: name.trim(),
        totalCount: 0,
        unreadCount: 0,
        color: color || "#6366F1",
      }
      setCustomFolders((prev) => [...prev, newFolder])
      showToast({
        body: `Folder "${name}" created on server.`,
        type: "info",
        isAutoHide: true,
        autoHideDuration: 3000,
      })
    } catch (err: any) {
      showToast({
        body: `Failed to create folder: ${err.message}`,
        type: "error",
      })
    }
  }

  const deleteCustomFolder = async (id: string) => {
    try {
      await postarcApi.deleteMailbox(id)
      setCustomFolders((prev) => prev.filter((f) => f.id !== id))
      setEmails((prev) => prev.map((e) => (e.folder === id ? { ...e, folder: "inbox" } : e)))
      if (activeFolder === id) {
        setActiveFolder("inbox")
      }
    } catch (err: any) {
      showToast({
        body: `Failed to delete folder: ${err.message}`,
        type: "error",
      })
    }
  }

  // ── Canned Responses ──────────────────────────────────────────────────────
  const addCannedResponse = (title: string, body: string, subject?: string) => {
    const newCr: CannedResponse = {
      id: `cr_${Date.now()}`,
      title,
      body,
      subject,
      updatedAt: new Date().toISOString().split("T")[0],
    }
    postarcApi.saveCannedResponse(newCr)
    setCannedResponses(postarcApi.getCannedResponses())
    showToast({
      body: "Template saved.",
      type: "info",
      isAutoHide: true,
      autoHideDuration: 3000,
    })
  }

  const deleteCannedResponse = (id: string) => {
    postarcApi.deleteCannedResponse(id)
    setCannedResponses(postarcApi.getCannedResponses())
  }

  // ── Remote Image Blocking ─────────────────────────────────────────────────
  const allowRemoteImagesForEmail = (emailId: string) => {
    setAllowedRemoteImages((prev) => new Set([...prev, emailId]))
    showToast({
      body: "Remote images loaded for this message.",
      type: "info",
      isAutoHide: true,
      autoHideDuration: 3000,
    })
  }

  // ── EML Export (RFC 822) ──────────────────────────────────────────────────
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

  // ── EML Import ────────────────────────────────────────────────────────────
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

  // ── Email Read & Star Real JMAP Sync ──────────────────────────────────────
  const openEmail = (id: string) => {
    setActiveEmailId(id)
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isUnread: false } : e))
    )
    postarcApi.updateEmailKeywords(id, { $seen: true }).catch(console.error)
  }

  const closeEmail = () => {
    setActiveEmailId(null)
  }

  const toggleStar = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const target = emails.find((item) => item.id === id)
    if (!target) return
    const nextStarred = !target.isStarred

    setEmails((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isStarred: nextStarred } : item
      )
    )
    postarcApi.updateEmailKeywords(id, { $flagged: nextStarred }).catch(console.error)
  }

  const toggleEmailRead = (id: string) => {
    const target = emails.find((item) => item.id === id)
    if (!target) return
    const nextUnread = !target.isUnread

    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isUnread: nextUnread } : e))
    )
    postarcApi.updateEmailKeywords(id, { $seen: !nextUnread }).catch(console.error)
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
    idsToDelete.forEach((id) => {
      postarcApi.deleteEmail(id).catch(console.error)
    })
    setEmails((prev) => prev.filter((e) => !idsToDelete.includes(e.id)))
    setSelectedIds(new Set())
    if (activeEmailId && idsToDelete.includes(activeEmailId)) {
      setActiveEmailId(null)
    }
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
    const targets: Set<string> =
      selectedIds.size > 0 ? selectedIds : activeEmailId ? new Set<string>([activeEmailId]) : new Set<string>()
    targets.forEach((id) => {
      postarcApi.updateEmailKeywords(id, { $seen: true }).catch(console.error)
    })
    setEmails((prev) =>
      prev.map((e) => (targets.has(e.id) ? { ...e, isUnread: false } : e))
    )
    setSelectedIds(new Set())
  }

  const markSelectedAsUnread = () => {
    const targets: Set<string> =
      selectedIds.size > 0 ? selectedIds : activeEmailId ? new Set<string>([activeEmailId]) : new Set<string>()
    targets.forEach((id) => {
      postarcApi.updateEmailKeywords(id, { $seen: false }).catch(console.error)
    })
    setEmails((prev) =>
      prev.map((e) => (targets.has(e.id) ? { ...e, isUnread: true } : e))
    )
    setSelectedIds(new Set())
    if (activeEmailId) setActiveEmailId(null)
  }

  const snoozeEmails = (ids: string[], untilText: string) => {
    if (ids.length === 0) return
    moveEmailsToFolder(ids, "snoozed")
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

    postarcApi.sendEmail({
      to: thread.senderEmail,
      subject: `Re: ${thread.subject}`,
      body: replyText,
      fromIdentityId: activeIdentity.id,
    }).catch(console.error)

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
      body: "Reply sent via Postarc Engine.",
      type: "info",
      isAutoHide: true,
      autoHideDuration: 3000,
    })
  }

  const openCompose = () => setIsComposeOpen(true)
  const closeCompose = () => setIsComposeOpen(false)

  const sendEmail = async (
    to: string,
    subject: string,
    body: string,
    attachments?: EmailAttachment[],
    identityId?: string
  ) => {
    const sender = identities.find((i) => i.id === identityId) || activeIdentity

    try {
      const res = await postarcApi.sendEmail({
        to,
        subject,
        body,
        fromIdentityId: sender.id,
        attachments,
      })

      const newMsg: EmailThread = {
        id: res.messageId || `sent_${Date.now()}`,
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

      showToast({
        body: `Message sent from ${sender.email}.`,
        type: "info",
        isAutoHide: true,
        autoHideDuration: 4000,
      })
    } catch (err: any) {
      showToast({
        body: `Failed to send email: ${err.message}`,
        type: "error",
      })
    }
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
  }

  const setVacationConfig = async (config: VacationResponseConfig) => {
    await postarcApi.setVacationConfig(config)
    setVacationConfigState(config)
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
  const ctx = useContext(MailContext)
  if (!ctx) {
    throw new Error("useMail must be used within a MailProvider")
  }
  return ctx
}
