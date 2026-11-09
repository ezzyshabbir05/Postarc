"use client"

import { useState, useEffect } from "react"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading, Text } from "@astryxdesign/core/Text"
import { Card } from "@astryxdesign/core/Card"
import { Button } from "@astryxdesign/core/Button"
import { IconButton } from "@astryxdesign/core/IconButton"
import { TextInput } from "@astryxdesign/core/TextInput"
import { Badge } from "@astryxdesign/core/Badge"
import { Table, type TableColumn, pixel, proportional } from "@astryxdesign/core/Table"
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog"
import { Avatar } from "@astryxdesign/core/Avatar"
import {
  UserPlus,
  Search,
  Download,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  Star,
  Users,
} from "lucide-react"
import { useMail } from "@/components/mail-context"
import { postarcApi, type PostarcContact } from "@/lib/postarc-api"

interface ContactRow extends PostarcContact, Record<string, unknown> {}

export default function ContactsAddressBookPage() {
  const { contacts, openCompose } = useMail()
  const [contactList, setContactList] = useState<ContactRow[]>(contacts as ContactRow[])
  const [selectedGroup, setSelectedGroup] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setContactList(contacts as ContactRow[])
  }, [contacts])

  // Add Contact Dialog
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [group, setGroup] = useState<PostarcContact["group"]>("Work")

  const filteredContacts = contactList.filter((c) => {
    const matchesGroup = selectedGroup === "All" || c.group === selectedGroup
    if (!matchesGroup) return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase().trim()
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.company || "").toLowerCase().includes(q) ||
      (c.jobTitle || "").toLowerCase().includes(q)
    )
  })

  const handleAddContact = async () => {
    if (!name.trim() || !email.trim()) return

    try {
      const serverId = await postarcApi.createContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        company: company.trim() || undefined,
        jobTitle: jobTitle.trim() || undefined,
        group,
      })

      const newContact: ContactRow = {
        id: serverId,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        company: company.trim() || undefined,
        jobTitle: jobTitle.trim() || undefined,
        group,
      }

      setContactList((prev) => [newContact, ...prev])
      setIsAddOpen(false)
      setName("")
      setEmail("")
      setPhone("")
      setCompany("")
      setJobTitle("")
    } catch (err: any) {
      console.error("Failed to persist contact:", err)
    }
  }

  const handleDeleteContact = async (id: string) => {
    try {
      await postarcApi.deleteContact(id)
      setContactList((prev) => prev.filter((c) => c.id !== id))
    } catch (err: any) {
      console.error("Failed to delete contact:", err)
    }
  }

  const exportVCard = (contact: ContactRow) => {
    const vCardData = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${contact.name}`,
      `EMAIL;TYPE=INTERNET:${contact.email}`,
      contact.phone ? `TEL;TYPE=CELL:${contact.phone}` : "",
      contact.company ? `ORG:${contact.company}` : "",
      contact.jobTitle ? `TITLE:${contact.jobTitle}` : "",
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\r\n")

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${contact.name.replace(/\s+/g, "_")}.vcf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const columns: TableColumn<ContactRow>[] = [
    {
      key: "contact",
      header: "Contact",
      width: pixel(260),
      renderCell: (item) => (
        <HStack gap={3} vAlign="center">
          <Avatar name={item.name} size={36} />
          <VStack gap={0}>
            <Text type="body" weight="medium">
              {item.name}
            </Text>
            <Text type="supporting" color="secondary" size="xsm">
              {item.email}
            </Text>
          </VStack>
        </HStack>
      ),
    },
    {
      key: "company",
      header: "Organization / Title",
      width: proportional(1, { minWidth: 200 }),
      renderCell: (item) => (
        <VStack gap={0}>
          <Text type="body" size="sm">
            {item.company || "—"}
          </Text>
          <Text type="supporting" color="secondary" size="xsm">
            {item.jobTitle || ""}
          </Text>
        </VStack>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      width: pixel(180),
      renderCell: (item) => (
        <Text type="body" size="sm" color="secondary">
          {item.phone || "—"}
        </Text>
      ),
    },
    {
      key: "group",
      header: "Group",
      width: pixel(130),
      renderCell: (item) => (
        <Badge
          variant="neutral"
          label={item.group}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      width: pixel(120),
      align: "end",
      renderCell: (item) => (
        <HStack gap={1} hAlign="end" vAlign="center">
          <IconButton
            label="Send Email"
            tooltip="Send Email"
            variant="ghost"
            size="sm"
            icon={<Mail size={16} />}
            onClick={() => openCompose()}
          />
          <IconButton
            label="Export vCard"
            tooltip="Download vCard"
            variant="ghost"
            size="sm"
            icon={<Download size={16} />}
            onClick={() => exportVCard(item)}
          />
          <IconButton
            label="Delete"
            tooltip="Delete Contact"
            variant="ghost"
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={() => handleDeleteContact(item.id)}
          />
        </HStack>
      ),
    },
  ]

  const groups = ["All", "Personal", "Work", "Clients", "Favorites"]

  return (
    <VStack gap={6} padding={6} width="100%">
      {/* Header */}
      <HStack hAlign="between" vAlign="center" width="100%">
        <VStack gap={1}>
          <Heading level={2}>Address Book</Heading>
          <Text type="body" color="secondary">
            Manage your personal and enterprise contacts, groups, and vCards
          </Text>
        </VStack>
        <Button
          label="Add Contact"
          variant="primary"
          icon={<UserPlus size={16} />}
          onClick={() => setIsAddOpen(true)}
        />
      </HStack>

      {/* Filter and Group Bar */}
      <Card padding={4} width="100%">
        <HStack hAlign="between" vAlign="center" width="100%" wrap="wrap">
          {/* Group Pills */}
          <HStack gap={2} vAlign="center">
            {groups.map((grp) => (
              <Button
                key={grp}
                label={grp}
                size="sm"
                variant={selectedGroup === grp ? "primary" : "ghost"}
                onClick={() => setSelectedGroup(grp)}
              />
            ))}
          </HStack>

          {/* Search Box */}
          <TextInput
            label="Search Contacts"
            isLabelHidden
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            startIcon={<Search size={16} />}
            width={320}
          />
        </HStack>
      </Card>

      {/* Contacts Table */}
      {filteredContacts.length === 0 ? (
        <Card padding={0} width="100%">
          <VStack gap={2} padding={8} hAlign="center">
            <Users size={32} className="text-neutral-400" />
            <Text type="body" color="secondary">
              No contacts found matching your criteria.
            </Text>
          </VStack>
        </Card>
      ) : (
        <Card padding={0} width="100%">
          <Table
            columns={columns}
            data={filteredContacts}
          />
        </Card>
      )}

      {/* Add Contact Modal Dialog */}
      <Dialog
        isOpen={isAddOpen}
        onOpenChange={setIsAddOpen}
        width={480}
      >
        <VStack gap={4} hAlign="stretch" padding={4}>
          <DialogHeader
            title="Add New Contact"
            onOpenChange={setIsAddOpen}
          />
          <TextInput
            label="Full Name"
            placeholder="e.g. Jane Doe"
            value={name}
            onChange={(val) => setName(val)}
          />
          <TextInput
            label="Email Address"
            placeholder="jane.doe@example.com"
            value={email}
            onChange={(val) => setEmail(val)}
          />
          <TextInput
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(val) => setPhone(val)}
          />
          <HStack gap={3}>
            <TextInput
              label="Company"
              placeholder="e.g. Acme Corp"
              value={company}
              onChange={(val) => setCompany(val)}
            />
            <TextInput
              label="Job Title"
              placeholder="e.g. VP Engineering"
              value={jobTitle}
              onChange={(val) => setJobTitle(val)}
            />
          </HStack>

          <HStack hAlign="end" gap={2}>
            <Button
              variant="ghost"
              size="sm"
              label="Cancel"
              onClick={() => setIsAddOpen(false)}
            />
            <Button
              variant="primary"
              size="sm"
              label="Save Contact"
              isDisabled={!name.trim() || !email.trim()}
              onClick={handleAddContact}
            />
          </HStack>
        </VStack>
      </Dialog>
    </VStack>
  )
}

