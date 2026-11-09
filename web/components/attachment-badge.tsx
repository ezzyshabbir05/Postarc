"use client"

import { Badge } from "@astryxdesign/core/Badge"
import { Paperclip } from "lucide-react"
import type { EmailAttachment } from "@/types/email"

/**
 * File format badges with distinctive filetype icons:
 * - PDF: Red badge with bold white PDF mark
 * - Spreadsheets: Google Sheets green badge with white XLS mark
 * - Documents: Google Docs blue badge with white DOC mark
 * - Images: Amber badge with photo graphic
 * - Archives: Purple badge with white ZIP mark
 * - Code: Cyan badge with code brackets
 * - Unknown formats: Neutral paperclip icon
 */
export function getAttachmentIcon(filename: string, fileType?: string) {
  const ext = filename.split(".").pop()?.toLowerCase() || fileType?.toLowerCase() || ""

  // PDF (Google Drive red)
  if (ext === "pdf") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <rect width="16" height="16" rx="3" fill="#e53935" />
        <text
          x="8"
          y="11.5"
          fill="#ffffff"
          fontSize="7.5"
          fontWeight="800"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.3"
        >
          PDF
        </text>
      </svg>
    )
  }

  // Spreadsheets (Google Sheets emerald)
  if (["xls", "xlsx", "csv", "spreadsheet"].includes(ext)) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <rect width="16" height="16" rx="3" fill="#0f9d58" />
        <text
          x="8"
          y="11.5"
          fill="#ffffff"
          fontSize="7.5"
          fontWeight="800"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.3"
        >
          XLS
        </text>
      </svg>
    )
  }

  // Documents (Google Docs blue)
  if (["doc", "docx", "document"].includes(ext)) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <rect width="16" height="16" rx="3" fill="#1a73e8" />
        <text
          x="8"
          y="11.5"
          fill="#ffffff"
          fontSize="7.5"
          fontWeight="800"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.3"
        >
          DOC
        </text>
      </svg>
    )
  }

  // Images (Amber photo icon)
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "image"].includes(ext)) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <rect width="16" height="16" rx="3" fill="#f59e0b" />
        <path d="M4 12L7 8L9 10L11 7L13 12H4Z" fill="#ffffff" />
        <circle cx="6" cy="5.5" r="1.2" fill="#ffffff" />
      </svg>
    )
  }

  // Archives (Purple ZIP badge)
  if (["zip", "tar", "gz", "rar", "7z", "archive"].includes(ext)) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <rect width="16" height="16" rx="3" fill="#7c3aed" />
        <text
          x="8"
          y="11.5"
          fill="#ffffff"
          fontSize="7.5"
          fontWeight="800"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.3"
        >
          ZIP
        </text>
      </svg>
    )
  }

  // Code (Cyan code bracket)
  if (["ts", "tsx", "js", "jsx", "json", "py", "html", "css"].includes(ext)) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <rect width="16" height="16" rx="3" fill="#0891b2" />
        <path
          d="M6 5.5L4 8L6 10.5M10 5.5L12 8L10 10.5"
          stroke="#ffffff"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  // Unknown format: paperclip icon with neutral tone
  return <Paperclip size={14} color="#64748b" />
}

interface AttachmentBadgeProps {
  attachment: EmailAttachment
  maxLabelLength?: number
  onClick?: (e: React.MouseEvent) => void
}

export function AttachmentBadge({
  attachment,
  maxLabelLength = 17,
  onClick,
}: AttachmentBadgeProps) {
  const displayName = attachment.name.replace(/\.[a-zA-Z0-9]+$/, "")
  const truncatedName =
    displayName.length > maxLabelLength
      ? `${displayName.slice(0, maxLabelLength - 3)}...`
      : displayName

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${attachment.name} (${attachment.size}) — Click to download`}
      style={{
        cursor: "pointer",
        background: "transparent",
        border: "none",
        padding: 0,
        display: "inline-flex",
      }}
    >
      <Badge
        variant="neutral"
        icon={getAttachmentIcon(attachment.name, attachment.type)}
        label={truncatedName}
      />
    </button>
  )
}
