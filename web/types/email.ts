export interface EmailAttachment {
  id: string
  name: string
  size: string
  type: "pdf" | "spreadsheet" | "image" | "archive" | "document" | "binary"
  downloadUrl?: string
}

export type EmailCategory = "primary" | "promotions" | "social" | "updates"
export type EmailFolder =
  | "inbox"
  | "starred"
  | "snoozed"
  | "sent"
  | "drafts"
  | "archive"
  | "spam"
  | "trash"
  | string // Supports custom user folders

export interface ThreadMessage {
  id: string
  senderName: string
  senderEmail: string
  recipientEmail: string
  replyToEmail?: string
  body: string
  htmlBody?: string
  timestamp: string
  fullDate: string
  isStarred?: boolean
  mailedBy?: string
  signedBy?: string
  security?: string
  attachments?: EmailAttachment[]
  isFromMe?: boolean
  senderAvatar?: string
  isVerified?: boolean
  hasRemoteImages?: boolean
  remoteImagesAllowed?: boolean
  spfStatus?: "pass" | "fail" | "neutral"
  dkimStatus?: "pass" | "fail" | "none"
  dmarcStatus?: "pass" | "fail" | "none"
  pgpSignatureStatus?: "valid" | "invalid" | "unverified" | "none"
}

export interface CustomMailboxFolder {
  id: string
  name: string
  parentId?: string
  color?: string
  totalCount: number
  unreadCount: number
}

export interface EmailThread extends Record<string, unknown> {
  id: string
  senderName: string
  senderAvatar?: string
  isVerified?: boolean
  senderEmail: string
  recipientEmail: string
  replyToEmail?: string
  subject: string
  snippet: string
  body: string
  htmlBody?: string
  timestamp: string
  fullDate: string
  category: EmailCategory
  folder: EmailFolder
  isUnread: boolean
  isStarred: boolean
  threadCount?: number
  label?: "Clients" | "Invoices" | "Personal" | "Work"
  labelColor?: string
  mailedBy?: string
  signedBy?: string
  security?: string
  hasRemoteImages?: boolean
  remoteImagesAllowed?: boolean
  attachments?: EmailAttachment[]
  messages?: ThreadMessage[]
}
