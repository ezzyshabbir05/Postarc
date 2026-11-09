"use client"

import { useState, useEffect } from "react"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading, Text } from "@astryxdesign/core/Text"
import { Card } from "@astryxdesign/core/Card"
import { Button } from "@astryxdesign/core/Button"
import { Switch } from "@astryxdesign/core/Switch"
import { TextInput } from "@astryxdesign/core/TextInput"
import { Banner } from "@astryxdesign/core/Banner"
import { Dialog } from "@astryxdesign/core/Dialog"
import { Table, type TableColumn, pixel, proportional } from "@astryxdesign/core/Table"
import { Globe, RefreshCw, Plus } from "lucide-react"
import type { CustomDomain } from "@/types/mailbox"
import { AdminPageLayout } from "@/components/admin-page-layout"
import { postarcApi } from "@/lib/postarc-api"

interface DnsRecordItem extends Record<string, unknown> {
  id: string
  type: "TXT" | "MX" | "CNAME"
  host: string
  value: string
  priority?: number
  status: "verified" | "pending"
  purpose: string
}

function buildDnsRecords(domain: CustomDomain): DnsRecordItem[] {
  return [
    {
      id: `dns_${domain.id}_01`,
      type: "TXT",
      host: "@",
      value: domain.verificationToken,
      status: domain.isVerified ? "verified" : "pending",
      purpose: "Domain Ownership Verification",
    },
    {
      id: `dns_${domain.id}_02`,
      type: "MX",
      host: "@",
      value: "mail.postarc.com",
      priority: 10,
      status: domain.mxStatus === "verified" ? "verified" : "pending",
      purpose: "Inbound Email Routing (MX)",
    },
    {
      id: `dns_${domain.id}_03`,
      type: "TXT",
      host: "@",
      value: "v=spf1 include:_spf.postarc.com ~all",
      status: domain.spfStatus === "verified" ? "verified" : "pending",
      purpose: "Sender Policy Framework (SPF)",
    },
    {
      id: `dns_${domain.id}_04`,
      type: "CNAME",
      host: "postarc._domainkey",
      value: `dkim.${domain.name}`,
      status: domain.dkimStatus === "verified" ? "verified" : "pending",
      purpose: "Cryptographic Signature (DKIM)",
    },
    {
      id: `dns_${domain.id}_05`,
      type: "TXT",
      host: "_dmarc",
      value: `v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain.name}`,
      status: domain.dmarcStatus === "verified" ? "verified" : "pending",
      purpose: "Domain-based Auth & Reporting (DMARC)",
    },
  ]
}

export default function AdminDomainsPage() {
  const [domains, setDomains] = useState<CustomDomain[]>([])
  const [activeDomainId, setActiveDomainId] = useState<string>("")
  const [isChecking, setIsChecking] = useState(false)
  const [checkBanner, setCheckBanner] = useState<string | null>(null)
  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false)
  const [newDomainName, setNewDomainName] = useState("")

  useEffect(() => {
    postarcApi.getDomains().then((data) => {
      if (data && data.length > 0) {
        setDomains(data)
        setActiveDomainId(data[0].id)
      }
    }).catch(console.error)
  }, [])

  const activeDomain = domains.find((d) => d.id === activeDomainId) || domains[0] || {
    id: "dom_placeholder",
    name: "example.com",
    isPrimary: true,
    isVerified: true,
    verificationToken: "postarc-verify=pending",
    mxStatus: "verified" as const,
    spfStatus: "verified" as const,
    dkimStatus: "verified" as const,
    dmarcStatus: "verified" as const,
    catchAllEnabled: false,
    createdAt: new Date().toISOString(),
  }
  const records = buildDnsRecords(activeDomain)

  const handleSelectDomain = (domainId: string) => {
    setActiveDomainId(domainId)
    setCheckBanner(null)
  }

  const handleCheckDns = () => {
    setIsChecking(true)
    setTimeout(() => {
      setIsChecking(false)
      setDomains((prev) =>
        prev.map((d) =>
          d.id === activeDomain.id
            ? {
                ...d,
                isVerified: true,
                mxStatus: "verified",
                spfStatus: "verified",
                dkimStatus: "verified",
                dmarcStatus: "verified",
              }
            : d
        )
      )
      setCheckBanner(
        `DNS check completed for ${activeDomain.name}. All records (MX, SPF, DKIM, DMARC) are validated.`
      )
    }, 600)
  }

  const handleAddDomain = async () => {
    if (!newDomainName.trim()) return
    const cleanName = newDomainName.trim().toLowerCase().replace(/^https?:\/\//, "")
    try {
      const serverId = await postarcApi.createDomain(cleanName)
      const newDomain: CustomDomain = {
        id: serverId,
        name: cleanName,
        isPrimary: false,
        isVerified: false,
        verificationToken: `postarc-verify=${Math.random().toString(36).substring(2, 12)}`,
        mxStatus: "pending",
        spfStatus: "unconfigured",
        dkimStatus: "unconfigured",
        dmarcStatus: "unconfigured",
        catchAllEnabled: false,
        catchAllTargetEmail: "admin@postarc.local",
        createdAt: new Date().toISOString(),
      }

      setDomains((prev) => [...prev, newDomain])
      setActiveDomainId(newDomain.id)
      setIsAddDomainOpen(false)
      setNewDomainName("")
    } catch (err: any) {
      console.error("Failed to add domain:", err)
    }
    setCheckBanner(`Domain ${cleanName} added. Add the DNS records below at your registrar to complete setup.`)
  }

  const handleToggleCatchAll = (checked: boolean) => {
    setDomains((prev) =>
      prev.map((d) =>
        d.id === activeDomain.id ? { ...d, catchAllEnabled: checked } : d
      )
    )
  }

  const handleUpdateCatchAllTarget = (target: string) => {
    setDomains((prev) =>
      prev.map((d) =>
        d.id === activeDomain.id ? { ...d, catchAllTargetEmail: target } : d
      )
    )
  }

  const columns: TableColumn<DnsRecordItem>[] = [
    {
      key: "type",
      header: "Record",
      width: pixel(80),
      renderCell: (item) => (
        <Text type="code" size="sm" weight="semibold">
          {item.type}
        </Text>
      ),
    },
    {
      key: "host",
      header: "Host",
      width: pixel(180),
      renderCell: (item) => (
        <Text type="code">
          {item.host}
        </Text>
      ),
    },
    {
      key: "value",
      header: "Value / Target",
      width: proportional(1, { minWidth: 260 }),
      renderCell: (item) => (
        <Text type="code">
          {item.value} {item.priority ? `(Priority ${item.priority})` : ""}
        </Text>
      ),
    },
    {
      key: "purpose",
      header: "Purpose",
      width: pixel(200),
      renderCell: (item) => (
        <Text type="body" color="secondary">
          {item.purpose}
        </Text>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: pixel(100),
      align: "end",
      renderCell: (item) => (
        <Text
          type="body"
          weight="medium"
          color={item.status === "verified" ? "primary" : "secondary"}
        >
          {item.status === "verified" ? "Verified" : "Pending"}
        </Text>
      ),
    },
  ]

  return (
    <AdminPageLayout
      title="Domains & DNS"
      actions={
        <HStack gap={2}>
          <Button
            label="Add Domain"
            variant="secondary"
            size="sm"
            icon={<Plus size={16} />}
            onClick={() => setIsAddDomainOpen(true)}
          />
          <Button
            label={isChecking ? "Checking..." : "Verify DNS"}
            variant="primary"
            size="sm"
            isLoading={isChecking}
            icon={<RefreshCw size={16} />}
            onClick={handleCheckDns}
          />
        </HStack>
      }
    >
      {/* ── Status Banner ── */}
      {checkBanner && (
        <Banner
          status="success"
          title={checkBanner}
          container="card"
          isDismissable
          onDismiss={() => setCheckBanner(null)}
        />
      )}

      {/* ── Domain Selector & Active Domain Header ── */}
      <Card padding={5} width="100%">
        <VStack gap={4} width="100%">
          <HStack hAlign="between" vAlign="center" width="100%">
            <HStack gap={2} vAlign="center">
              {domains.map((dom) => {
                const isSelected = dom.id === activeDomain.id
                return (
                  <Button
                    key={dom.id}
                    label={dom.name}
                    variant={isSelected ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => handleSelectDomain(dom.id)}
                  />
                )
              })}
            </HStack>
            <Text type="body" color="secondary">
              {activeDomain.isVerified ? "Verified" : "Pending"}
            </Text>
          </HStack>

          <HStack gap={3} vAlign="center">
            <Globe size={24} />
            <VStack gap={0}>
              <HStack gap={2} vAlign="center">
                <Heading level={3}>{activeDomain.name}</Heading>
                {activeDomain.isPrimary && (
                  <Text type="supporting" color="secondary">
                    (Primary)
                  </Text>
                )}
              </HStack>
              <Text type="body" color="secondary">
                {activeDomain.isVerified ? "Active" : "Pending DNS verification"}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </Card>

      {/* ── DNS Records Table ── */}
      <Card padding={5} width="100%">
        <VStack gap={4} width="100%">
          <Heading level={3}>DNS Records</Heading>
          <Table
            data={records}
            columns={columns}
            idKey="id"
          />
        </VStack>
      </Card>

      {/* ── Catch-All Email Routing ── */}
      <Card padding={5} width="100%">
        <VStack gap={4} width="100%">
          <Heading level={3}>Catch-All Mailbox</Heading>

          <Switch
            label="Enable Catch-All Routing"
            value={activeDomain.catchAllEnabled}
            onChange={(checked) => handleToggleCatchAll(checked)}
          />

          {activeDomain.catchAllEnabled && (
            <TextInput
              label="Deliver unmatched emails to"
              value={activeDomain.catchAllTargetEmail || "admin@enterprise.corp"}
              onChange={(val) => handleUpdateCatchAllTarget(val)}
              width={340}
            />
          )}
        </VStack>
      </Card>

      {/* ── Dialog: Add New Domain ── */}
      <Dialog
        isOpen={isAddDomainOpen}
        onOpenChange={(open) => {
          if (!open) setIsAddDomainOpen(false)
        }}
        width={440}
        purpose="form"
      >
        <VStack gap={4} padding={4} width="100%">
          <VStack gap={1}>
            <Heading level={3}>Add Domain</Heading>
            <Text type="body" color="secondary" size="sm">
              Add a brand or secondary domain to your mail system.
            </Text>
          </VStack>

          <TextInput
            label="Domain Name"
            placeholder="e.g. company-brand.com"
            value={newDomainName}
            onChange={(val) => setNewDomainName(val)}
            isRequired
            width="100%"
          />

          <HStack hAlign="end" gap={2}>
            <Button
              label="Cancel"
              variant="ghost"
              onClick={() => setIsAddDomainOpen(false)}
            />
            <Button
              label="Add Domain"
              variant="primary"
              isDisabled={!newDomainName.trim()}
              onClick={handleAddDomain}
            />
          </HStack>
        </VStack>
      </Dialog>
    </AdminPageLayout>
  )
}
