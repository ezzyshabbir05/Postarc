"use client"

import { useState } from "react"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading, Text } from "@astryxdesign/core/Text"
import { Card } from "@astryxdesign/core/Card"
import { Button } from "@astryxdesign/core/Button"
import { TextInput } from "@astryxdesign/core/TextInput"
import { TextArea } from "@astryxdesign/core/TextArea"
import { Banner } from "@astryxdesign/core/Banner"
import { mockOrganization } from "@/lib/mock-data"
import { AdminPageLayout } from "@/components/admin-page-layout"

export default function AdminSettingsPage() {
  const [orgName, setOrgName] = useState(mockOrganization.name)
  const [defaultQuota, setDefaultQuota] = useState("15")
  const [disclaimer, setDisclaimer] = useState(mockOrganization.globalDisclaimer || "")
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <AdminPageLayout
      title="Settings"
      actions={
        <Button
          label="Save Settings"
          variant="primary"
          size="sm"
          onClick={handleSave}
        />
      }
    >
      {isSaved && (
        <Banner
          status="success"
          title="Organization settings updated successfully."
          container="card"
          isDismissable
          onDismiss={() => setIsSaved(false)}
        />
      )}

      {/* ── Organization Profile ── */}
      <Card padding={5} width="100%">
        <VStack gap={4} width="100%">
          <Heading level={3}>Organization Profile</Heading>

          <TextInput
            label="Company Display Name"
            value={orgName}
            onChange={(val) => setOrgName(val)}
            width="100%"
          />

          <VStack gap={1}>
            <Text type="supporting" color="secondary">
              Primary Domain
            </Text>
            <HStack gap={2} vAlign="center">
              <Text type="code" size="base">
                {mockOrganization.primaryDomainName}
              </Text>
              <Text type="supporting" color="secondary">
                (Primary)
              </Text>
            </HStack>
          </VStack>

          <TextInput
            label="Default Mailbox Quota (GB)"
            value={defaultQuota}
            onChange={(val) => setDefaultQuota(val)}
            width={260}
          />
        </VStack>
      </Card>

      {/* ── Global Legal Disclaimer ── */}
      <Card padding={5} width="100%">
        <VStack gap={4} width="100%">
          <Heading level={3}>Outbound Disclaimer</Heading>

          <TextArea
            label="Disclaimer Text"
            value={disclaimer}
            onChange={(val) => setDisclaimer(val)}
            rows={5}
            width="100%"
          />

          <HStack hAlign="end">
            <Button
              label="Save Settings"
              variant="primary"
              size="md"
              onClick={handleSave}
            />
          </HStack>
        </VStack>
      </Card>
    </AdminPageLayout>
  )
}
