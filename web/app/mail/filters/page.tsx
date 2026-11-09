"use client"

import { useState, useEffect } from "react"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading, Text } from "@astryxdesign/core/Text"
import { Card } from "@astryxdesign/core/Card"
import { Button } from "@astryxdesign/core/Button"
import { Badge } from "@astryxdesign/core/Badge"
import { Switch } from "@astryxdesign/core/Switch"
import { TextInput } from "@astryxdesign/core/TextInput"
import { TextArea } from "@astryxdesign/core/TextArea"
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog"
import { Banner } from "@astryxdesign/core/Banner"
import {
  Filter,
  Plus,
  Trash2,
  Code2,
  CheckCircle,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react"
import { postarcApi, type SieveFilterRule } from "@/lib/postarc-api"
import { useMail } from "@/components/mail-context"

export default function MailFiltersPage() {
  const { customFolders } = useMail()
  const [rules, setRules] = useState<SieveFilterRule[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showSieveScript, setShowSieveScript] = useState(false)
  const [isSavedBanner, setIsSavedBanner] = useState(false)

  // Form states
  const [ruleName, setRuleName] = useState("")
  const [conditionField, setConditionField] = useState<
    "from" | "to" | "subject" | "body"
  >("subject")
  const [conditionValue, setConditionValue] = useState("")
  const [actionType, setActionType] = useState<
    "move_to_folder" | "mark_flagged" | "mark_read" | "discard" | "forward_to"
  >("move_to_folder")
  const [actionTarget, setActionTarget] = useState("Promotions")

  useEffect(() => {
    let isMounted = true
    postarcApi
      .getFilterRules()
      .then((savedRules) => {
        if (isMounted) setRules(savedRules)
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  const handleToggleRule = async (id: string, currentEnabled: boolean) => {
    const updated = rules.map((r) =>
      r.id === id ? { ...r, isEnabled: !currentEnabled } : r
    )
    setRules(updated)
    const targetRule = updated.find((r) => r.id === id)
    if (targetRule) {
      await postarcApi.saveFilterRule(targetRule)
    }
  }

  const handleDeleteRule = async (id: string) => {
    await postarcApi.deleteFilterRule(id)
    setRules((prev) => prev.filter((r) => r.id !== id))
  }

  const handleSaveNewRule = async () => {
    if (!ruleName.trim() || !conditionValue.trim()) return

    const newRule: SieveFilterRule = {
      id: `rule_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: ruleName.trim(),
      isEnabled: true,
      conditionField,
      conditionOperator: "contains",
      conditionValue: conditionValue.trim(),
      actionType,
      actionTarget: actionTarget.trim() || undefined,
    }

    await postarcApi.saveFilterRule(newRule)
    setRules((prev) => [...prev, newRule])
    setIsDialogOpen(false)
    setRuleName("")
    setConditionValue("")
    setIsSavedBanner(true)
    setTimeout(() => setIsSavedBanner(false), 3000)
  }

  const compiledScript = postarcApi.compileSieveScript(rules)

  return (
    <VStack gap={5} width="100%" maxWidth={960} padding={4}>
      {/* ── Top Header ── */}
      <HStack hAlign="between" vAlign="center" width="100%">
        <VStack gap={1}>
          <HStack gap={2} vAlign="center">
            <Filter size={24} className="text-blue-500" />
            <Heading level={2}>Incoming Mail Filters</Heading>
          </HStack>
          <Text type="body" color="secondary" size="sm">
            Automated server-side rules (ManageSieve RFC 5228) to sort, flag, or discard incoming emails.
          </Text>
        </VStack>

        <HStack gap={2} vAlign="center">
          <Button
            label={showSieveScript ? "Hide Sieve Code" : "View Sieve Code"}
            variant="secondary"
            size="sm"
            icon={<Code2 size={16} />}
            onClick={() => setShowSieveScript(!showSieveScript)}
          />
          <Button
            label="New Filter Rule"
            variant="primary"
            size="sm"
            icon={<Plus size={16} />}
            onClick={() => setIsDialogOpen(true)}
          />
        </HStack>
      </HStack>

      {isSavedBanner && (
        <Banner
          status="success"
          title="Filter rule created and synchronized with Postarc ManageSieve."
          container="card"
          isDismissable
          onDismiss={() => setIsSavedBanner(false)}
        />
      )}

      {/* ── Rules List ── */}
      {rules.length === 0 ? (
        <Card padding={8} width="100%">
          <VStack gap={3} hAlign="center" width="100%">
            <SlidersHorizontal size={40} className="text-neutral-400" />
            <Heading level={3}>No Filter Rules Active</Heading>
            <Text type="body" color="secondary" size="sm">
              Create rules to automatically route newsletters to specific folders, star messages from VIPs, or discard spam.
            </Text>
            <Button
              label="Create First Rule"
              variant="primary"
              size="md"
              icon={<Plus size={16} />}
              onClick={() => setIsDialogOpen(true)}
            />
          </VStack>
        </Card>
      ) : (
        <VStack gap={3} width="100%">
          {rules.map((rule) => (
            <Card key={rule.id} padding={4} width="100%">
              <HStack hAlign="between" vAlign="center" width="100%">
                <VStack gap={2}>
                  <HStack gap={2} vAlign="center">
                    <Text type="body" weight="semibold">
                      {rule.name}
                    </Text>
                    <Badge
                      label={rule.isEnabled ? "Active" : "Disabled"}
                      variant={rule.isEnabled ? "success" : "neutral"}
                    />
                  </HStack>

                  <HStack gap={2} vAlign="center" wrap="wrap">
                    <Badge label={`IF ${rule.conditionField.toUpperCase()}`} variant="info" />
                    <Text type="supporting" color="secondary">
                      contains
                    </Text>
                    <Text type="code" size="sm">
                      &quot;{rule.conditionValue}&quot;
                    </Text>
                    <ArrowRight size={14} className="text-neutral-400" />
                    <Badge
                      label={`THEN ${rule.actionType.replace(/_/g, " ").toUpperCase()}`}
                      variant="warning"
                    />
                    {rule.actionTarget && (
                      <Text type="code" size="sm">
                        [{rule.actionTarget}]
                      </Text>
                    )}
                  </HStack>
                </VStack>

                <HStack gap={3} vAlign="center">
                  <Switch
                    label="Toggle Rule"
                    isLabelHidden
                    value={rule.isEnabled}
                    onChange={() => handleToggleRule(rule.id, rule.isEnabled)}
                  />
                  <Button
                    label="Delete"
                    variant="destructive"
                    size="sm"
                    icon={<Trash2 size={16} />}
                    onClick={() => handleDeleteRule(rule.id)}
                  />
                </HStack>
              </HStack>
            </Card>
          ))}
        </VStack>
      )}

      {/* ── Sieve RFC 5228 Source Viewer ── */}
      {showSieveScript && (
        <Card padding={5} width="100%">
          <VStack gap={3} width="100%">
            <HStack hAlign="between" vAlign="center" width="100%">
              <HStack gap={2} vAlign="center">
                <Code2 size={18} className="text-blue-500" />
                <Text type="body" weight="semibold">
                  Compiled Sieve Script (RFC 5228)
                </Text>
              </HStack>
              <Text type="supporting" color="secondary" size="xsm">
                Deployed to ManageSieve :4190
              </Text>
            </HStack>
            <TextArea
              label="Sieve Source"
              value={compiledScript}
              isReadOnly
              rows={8}
              width="100%"
            />
          </VStack>
        </Card>
      )}

      {/* ── Create Rule Dialog ── */}
      <Dialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        width={520}
      >
        <DialogHeader title="Create Incoming Filter Rule" />
        <VStack gap={4} width="100%" padding={4}>
          <TextInput
            label="Rule Name"
            placeholder="e.g. Move Newsletters to Promotions"
            value={ruleName}
            onChange={(val) => setRuleName(val)}
            width="100%"
          />

          {/* Condition Definition */}
          <VStack gap={2} width="100%">
            <Text type="supporting" weight="semibold" color="secondary">
              1. When an incoming email matches:
            </Text>
            <HStack gap={2}>
              {(["subject", "from", "to", "body"] as const).map((field) => (
                <Button
                  key={field}
                  label={field.toUpperCase()}
                  variant={conditionField === field ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setConditionField(field)}
                />
              ))}
            </HStack>
            <TextInput
              label="Value Contains"
              placeholder="e.g. newsletter, invoice, or @domain.com"
              value={conditionValue}
              onChange={(val) => setConditionValue(val)}
              width="100%"
            />
          </VStack>

          {/* Action Definition */}
          <VStack gap={2} width="100%">
            <Text type="supporting" weight="semibold" color="secondary">
              2. Perform this action:
            </Text>
            <HStack gap={2} wrap="wrap">
              {(
                [
                  { type: "move_to_folder", label: "Move to Folder" },
                  { type: "mark_flagged", label: "Star / Flag" },
                  { type: "mark_read", label: "Mark as Read" },
                  { type: "discard", label: "Discard" },
                  { type: "forward_to", label: "Forward Copy" },
                ] as const
              ).map((act) => (
                <Button
                  key={act.type}
                  label={act.label}
                  variant={actionType === act.type ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setActionType(act.type)}
                />
              ))}
            </HStack>

            {actionType === "move_to_folder" && (
              <TextInput
                label="Target Folder"
                value={actionTarget}
                onChange={(val) => setActionTarget(val)}
                placeholder="Folder name (e.g. Archive, Junk, or Custom)"
                width="100%"
              />
            )}

            {actionType === "forward_to" && (
              <TextInput
                label="Forward To Email"
                value={actionTarget}
                onChange={(val) => setActionTarget(val)}
                placeholder="recipient@example.com"
                width="100%"
              />
            )}
          </VStack>

          <HStack hAlign="end" gap={2} width="100%">
            <Button
              label="Cancel"
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
            />
            <Button
              label="Save Rule"
              variant="primary"
              isDisabled={!ruleName.trim() || !conditionValue.trim()}
              onClick={handleSaveNewRule}
            />
          </HStack>
        </VStack>
      </Dialog>
    </VStack>
  )
}
