"use client"

import { useState, useEffect } from "react"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading, Text } from "@astryxdesign/core/Text"
import { Card } from "@astryxdesign/core/Card"
import { Button } from "@astryxdesign/core/Button"
import { TextInput } from "@astryxdesign/core/TextInput"
import { TextArea } from "@astryxdesign/core/TextArea"
import { Banner } from "@astryxdesign/core/Banner"
import { postarcApi } from "@/lib/postarc-api"
import { AdminPageLayout } from "@/components/admin-page-layout"

export default function AdminSettingsPage() {
  const [orgName, setOrgName] = useState("Postarc Organization")
  const [primaryDomain, setPrimaryDomain] = useState("postarc.local")
  const [defaultQuota, setDefaultQuota] = useState("15")
  const [disclaimer, setDisclaimer] = useState("")
  const [isSaved, setIsSaved] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function loadSettings() {
      try {
        const [settings, domains] = await Promise.all([
          postarcApi.getSecuritySettings(),
          postarcApi.getDomains(),
        ])
        if (!isMounted) return
        if (settings?.name) setOrgName(settings.name)
        if (settings?.globalDisclaimer) setDisclaimer(settings.globalDisclaimer)
        if (domains && domains.length > 0) {
          const prim = domains.find((d) => d.isPrimary) || domains[0]
          setPrimaryDomain(prim.name)
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMessage(err.message || "Failed to load settings from Postarc Engine.")
        }
      }
    }
    loadSettings()
    return () => {
      isMounted = false
    }
  }, [])

  const handleSave = async () => {
    setErrorMessage(null)
    try {
      await postarcApi.updateSecuritySettings({
        name: orgName,
        globalDisclaimer: disclaimer,
      })
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save settings.")
    }
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

      {errorMessage && (
        <Banner
          status="error"
          title={errorMessage}
          container="card"
          isDismissable
          onDismiss={() => setErrorMessage(null)}
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
                {primaryDomain}
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
