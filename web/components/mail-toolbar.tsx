"use client"

import { useRef } from "react"
import { HStack } from "@astryxdesign/core/Layout"
import { IconButton } from "@astryxdesign/core/IconButton"
import { CheckboxInput } from "@astryxdesign/core/CheckboxInput"
import { Text } from "@astryxdesign/core/Text"
import { DropdownMenu } from "@astryxdesign/core/DropdownMenu"
import {
  Archive,
  AlertCircle,
  Trash2,
  MailOpen,
  Mail,
  Clock,
  Tag,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Upload,
} from "lucide-react"
import { useMail } from "@/components/mail-context"

export function MailToolbar() {
  const {
    emails,
    selectedIds,
    selectAll,
    archiveSelected,
    deleteSelected,
    reportSpam,
    markSelectedAsRead,
    markSelectedAsUnread,
    snoozeEmails,
    importEmlFile,
  } = useMail()

  const emlInputRef = useRef<HTMLInputElement>(null)

  const handleEmlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      importEmlFile(e.target.files[0])
    }
  }

  const hasSelection = selectedIds.size > 0
  const isAllSelected = selectedIds.size > 0 && selectedIds.size === emails.length
  const checkboxValue = isAllSelected ? true : hasSelection ? "indeterminate" : false

  return (
    <HStack
      hAlign="between"
      vAlign="center"
      width="100%"
      padding={2}
    >
      {/* ── Left Actions (Selection & Batch Tools) ── */}
      <HStack gap={1} vAlign="center">
        {/* Checkbox and Select Dropdown */}
        <HStack gap={0} vAlign="center">
          <CheckboxInput
            label="Select all"
            isLabelHidden
            size="sm"
            value={checkboxValue}
            onChange={() => selectAll(hasSelection ? "none" : "all")}
          />
          <DropdownMenu
            alignment="start"
            renderTrigger={(triggerProps) => (
              <IconButton
                label="Select options"
                tooltip="Select options"
                variant="ghost"
                size="sm"
                icon={<ChevronDown size={14} />}
                {...triggerProps}
              />
            )}
            items={[
              { label: "All", onClick: () => selectAll("all") },
              { label: "None", onClick: () => selectAll("none") },
              { type: "divider" },
              { label: "Read", onClick: () => selectAll("read") },
              { label: "Unread", onClick: () => selectAll("unread") },
              { label: "Starred", onClick: () => selectAll("starred") },
            ]}
          />
        </HStack>

        {/* Dynamic Toolbar Items when selected */}
        {hasSelection ? (
          <HStack gap={1} vAlign="center">
            <IconButton
              label="Archive"
              tooltip="Archive"
              variant="ghost"
              size="sm"
              icon={<Archive size={16} />}
              onClick={() => archiveSelected()}
            />
            <IconButton
              label="Report spam"
              tooltip="Report spam"
              variant="ghost"
              size="sm"
              icon={<AlertCircle size={16} />}
              onClick={() => reportSpam()}
            />
            <IconButton
              label="Delete"
              tooltip="Delete"
              variant="ghost"
              size="sm"
              icon={<Trash2 size={16} />}
              onClick={() => deleteSelected()}
            />
            <IconButton
              label="Mark as read"
              tooltip="Mark as read"
              variant="ghost"
              size="sm"
              icon={<MailOpen size={16} />}
              onClick={markSelectedAsRead}
            />
            <IconButton
              label="Mark as unread"
              tooltip="Mark as unread"
              variant="ghost"
              size="sm"
              icon={<Mail size={16} />}
              onClick={markSelectedAsUnread}
            />
            <DropdownMenu
              alignment="start"
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
                  onClick: () => snoozeEmails(Array.from(selectedIds), "Later today 6:00 PM"),
                },
                {
                  label: "Tomorrow morning (8:00 AM)",
                  onClick: () => snoozeEmails(Array.from(selectedIds), "Tomorrow 8:00 AM"),
                },
                {
                  label: "This weekend (Sat 9:00 AM)",
                  onClick: () => snoozeEmails(Array.from(selectedIds), "This weekend"),
                },
                {
                  label: "Next week (Mon 8:00 AM)",
                  onClick: () => snoozeEmails(Array.from(selectedIds), "Next week"),
                },
              ]}
            />
            <IconButton
              label="Labels"
              tooltip="Labels"
              variant="ghost"
              size="sm"
              icon={<Tag size={16} />}
            />
          </HStack>
        ) : (
          <HStack gap={1} vAlign="center">
            <IconButton
              label="Refresh"
              tooltip="Refresh"
              variant="ghost"
              size="sm"
              icon={<RefreshCw size={16} />}
              onClick={() => {}}
            />
            <IconButton
              label="Import .eml"
              tooltip="Import RFC 822 .eml"
              variant="ghost"
              size="sm"
              icon={<Upload size={16} />}
              onClick={() => emlInputRef.current?.click()}
            />
            <input
              type="file"
              accept=".eml,message/rfc822"
              ref={emlInputRef}
              style={{ display: "none" }}
              onChange={handleEmlChange}
            />
            <IconButton
              label="More"
              tooltip="More"
              variant="ghost"
              size="sm"
              icon={<MoreVertical size={16} />}
            />
          </HStack>
        )}
      </HStack>

      {/* ── Right Pagination Controls ── */}
      <HStack gap={2} vAlign="center">
        <Text type="supporting" size="xsm" color="secondary">
          1–50 of 5,954
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
  )
}
