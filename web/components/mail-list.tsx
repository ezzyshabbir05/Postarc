"use client"

import { useState } from "react"
import {
  Table,
  type TableColumn,
  pixel,
  proportional,
} from "@astryxdesign/core/Table"
import { HStack, VStack } from "@astryxdesign/core/Layout"
import { Text } from "@astryxdesign/core/Text"
import { IconButton } from "@astryxdesign/core/IconButton"
import { CheckboxInput } from "@astryxdesign/core/CheckboxInput"
import { DropdownMenu } from "@astryxdesign/core/DropdownMenu"
import { AttachmentBadge } from "@/components/attachment-badge"
import {
  Star,
  Archive,
  Trash2,
  MailOpen,
  Mail,
  Clock,
} from "lucide-react"
import { useMail } from "@/components/mail-context"
import type { EmailThread } from "@/types/email"

export function MailList() {
  const {
    emails,
    activeCategory,
    activeFolder,
    searchQuery,
    selectedIds,
    openEmail,
    toggleStar,
    toggleSelect,
    archiveSelected,
    deleteSelected,
    toggleEmailRead,
    snoozeEmails,
  } = useMail()

  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const filteredEmails = emails.filter((email) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      return (
        email.subject.toLowerCase().includes(q) ||
        email.senderName.toLowerCase().includes(q) ||
        email.senderEmail.toLowerCase().includes(q) ||
        email.snippet.toLowerCase().includes(q)
      )
    }

    if (activeFolder === "starred") {
      return email.isStarred
    }

    if (activeFolder === "inbox") {
      return email.folder === "inbox" && email.category === activeCategory
    }

    return email.folder === activeFolder
  })

  const columns: TableColumn<EmailThread>[] = [
    {
      key: "selectionAndStar",
      header: "",
      width: pixel(80),
      renderCell: (item) => {
        const isSelected = selectedIds.has(item.id)

        return (
          <HStack
            gap={1}
            vAlign="center"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <CheckboxInput
              label={`Select ${item.senderName}`}
              isLabelHidden
              size="sm"
              value={isSelected}
              onChange={() => toggleSelect(item.id)}
            />
            <IconButton
              label={item.isStarred ? "Starred" : "Not starred"}
              tooltip={item.isStarred ? "Starred" : "Star"}
              variant="ghost"
              size="sm"
              icon={
                item.isStarred ? (
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                ) : (
                  <Star size={16} className="text-neutral-400" />
                )
              }
              onClick={(e) => toggleStar(item.id, e)}
            />
          </HStack>
        )
      },
    },
    {
      key: "sender",
      header: "",
      width: pixel(180),
      renderCell: (item) => (
        <HStack
          gap={1.5}
          vAlign="center"
          className="cursor-pointer select-none"
          onClick={() => openEmail(item.id)}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <Text
            type="body"
            weight={item.isUnread ? "bold" : "normal"}
            color={item.isUnread ? "primary" : "secondary"}
            maxLines={1}
          >
            {item.senderName}
          </Text>
          {item.threadCount && item.threadCount > 1 ? (
            <Text
              type="supporting"
              size="xsm"
              weight="normal"
              color="secondary"
            >
              {item.threadCount}
            </Text>
          ) : null}
        </HStack>
      ),
    },
    {
      key: "subjectAndSnippet",
      header: "",
      width: proportional(1, { minWidth: 280 }),
      renderCell: (item) => (
        <VStack
          gap={1}
          vAlign="start"
          className="cursor-pointer select-none overflow-hidden py-0.5"
          onClick={() => openEmail(item.id)}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <Text
            type="body"
            size="sm"
            maxLines={1}
            color={item.isUnread ? "primary" : "secondary"}
          >
            {/* Subject: bold/primary when unopened, normal/secondary when read */}
            <Text
              as="span"
              weight={item.isUnread ? "bold" : "normal"}
              color={item.isUnread ? "primary" : "secondary"}
            >
              {item.subject}
            </Text>

            {/* Content: always normal weight, secondary color */}
            <Text
              as="span"
              weight="normal"
              color="secondary"
            >
              {" - "}{item.snippet}
            </Text>
          </Text>

          {/* Attachment Badges: known formats (PDF, XLS, DOC, images, archives) show format icons, unknown formats show paperclip */}
          {item.attachments && item.attachments.length > 0 && (
            <HStack
              gap={1.5}
              vAlign="center"
              wrap="wrap"
              className="pt-1 pb-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              {item.attachments.map((att) => (
                <AttachmentBadge key={att.id} attachment={att} maxLabelLength={17} />
              ))}
            </HStack>
          )}
        </VStack>
      ),
    },
    {
      key: "actionsAndTimestamp",
      header: "",
      width: pixel(160),
      align: "end",
      renderCell: (item) => {
        const isHovered = hoveredId === item.id

        return (
          <HStack
            gap={1}
            hAlign="end"
            vAlign="center"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {isHovered ? (
              <HStack
                gap={0}
                hAlign="end"
                vAlign="center"
                onClick={(e) => e.stopPropagation()}
              >
                <IconButton
                  label="Archive"
                  tooltip="Archive"
                  variant="ghost"
                  size="sm"
                  icon={<Archive size={16} />}
                  onClick={() => archiveSelected([item.id])}
                />
                <IconButton
                  label="Delete"
                  tooltip="Delete"
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 size={16} />}
                  onClick={() => deleteSelected([item.id])}
                />
                <IconButton
                  label={item.isUnread ? "Mark as read" : "Mark as unread"}
                  tooltip={item.isUnread ? "Mark as read" : "Mark as unread"}
                  variant="ghost"
                  size="sm"
                  icon={
                    item.isUnread ? (
                      <MailOpen size={16} />
                    ) : (
                      <Mail size={16} />
                    )
                  }
                  onClick={() => toggleEmailRead(item.id)}
                />
                <DropdownMenu
                  alignment="end"
                  renderTrigger={(triggerProps) => (
                    <IconButton
                      label="Snooze"
                      tooltip="Snooze"
                      variant="ghost"
                      size="sm"
                      icon={<Clock size={16} />}
                      {...triggerProps}
                    />
                  )}
                  items={[
                    {
                      label: "Later today (6:00 PM)",
                      onClick: () => snoozeEmails([item.id], "Later today 6:00 PM"),
                    },
                    {
                      label: "Tomorrow morning (8:00 AM)",
                      onClick: () => snoozeEmails([item.id], "Tomorrow 8:00 AM"),
                    },
                    {
                      label: "This weekend (Sat 9:00 AM)",
                      onClick: () => snoozeEmails([item.id], "This weekend"),
                    },
                    {
                      label: "Next week (Mon 8:00 AM)",
                      onClick: () => snoozeEmails([item.id], "Next week"),
                    },
                  ]}
                />
              </HStack>
            ) : (
              /* Time: dark when unopened, light when opened */
              <Text
                type="supporting"
                size="sm"
                weight={item.isUnread ? "bold" : "normal"}
                color={item.isUnread ? "primary" : "secondary"}
                className={
                  item.isUnread
                    ? "font-bold text-neutral-900 dark:text-white cursor-pointer"
                    : "font-normal text-neutral-500 dark:text-neutral-400 cursor-pointer"
                }
                onClick={() => openEmail(item.id)}
              >
                {item.timestamp}
              </Text>
            )}
          </HStack>
        )
      },
    },
  ]

  return (
    <Table
      data={filteredEmails}
      columns={columns}
      idKey="id"
      density="compact"
      hasHover
      className="mail-table-headerless"
    />
  )
}
