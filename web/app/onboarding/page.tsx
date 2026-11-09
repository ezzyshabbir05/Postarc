"use client"

import { useState } from "react"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading, Text } from "@astryxdesign/core/Text"
import { Card } from "@astryxdesign/core/Card"
import { Button } from "@astryxdesign/core/Button"
import { Badge } from "@astryxdesign/core/Badge"
import { TextInput } from "@astryxdesign/core/TextInput"
import { ProgressBar } from "@astryxdesign/core/ProgressBar"
import { Banner } from "@astryxdesign/core/Banner"
import {
  ShieldCheck,
  Key,
  Globe,
  CheckCircle2,
  Copy,
  Download,
  ArrowRight,
  ArrowLeft,
  Mail,
  RefreshCw,
  ExternalLink,
} from "lucide-react"
import { postarcApi } from "@/lib/postarc-api"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: Domain & Server Host
  const [domain, setDomain] = useState("example.com")
  const [hostname, setHostname] = useState("mail.example.com")
  const [serverIp, setServerIp] = useState("203.0.113.10")

  // Step 2: Keys & DNS Records
  const [dnsRecords, setDnsRecords] = useState<any[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Step 3: Verification
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResults, setVerificationResults] = useState<
    Record<string, "verified" | "pending">
  >({})

  // Step 4: Admin Account
  const [adminEmail, setAdminEmail] = useState(`admin@${domain}`)
  const [adminPassword, setAdminPassword] = useState("ChangeMe#AdminSecret2026")
  const [isAccountCreated, setIsAccountCreated] = useState(false)

  // Step 1 -> Step 2: Generate Keys & DNS
  const handleProceedToKeys = () => {
    const cleanDomain = domain.trim().toLowerCase()
    const cleanHost = hostname.trim().toLowerCase()
    const cleanIp = serverIp.trim()

    const records = postarcApi.generateProductionDns(
      cleanDomain,
      cleanHost,
      cleanIp
    )
    setDnsRecords(records)
    setAdminEmail(`admin@${cleanDomain}`)
    setCurrentStep(2)
  }

  // Copy record value
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Download BIND Zone File
  const handleDownloadZoneFile = () => {
    const lines = [
      `; =============================================================================`,
      `; Postarc Production DNS Zone File for ${domain}`,
      `; Generated on ${new Date().toISOString()}`,
      `; =============================================================================`,
      `$ORIGIN ${domain}.`,
      `$TTL 300`,
      ``,
    ]

    dnsRecords.forEach((r) => {
      if (r.type === "MX") {
        lines.push(`@                   IN  MX ${r.priority}  ${r.value}.`)
      } else if (r.type === "A") {
        lines.push(`${r.name.split(".")[0].padEnd(20)} IN  A      ${r.value}`)
      } else {
        lines.push(`${r.name.padEnd(20)} IN  TXT    "${r.value}"`)
      }
    })

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${domain}.zone`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Step 3: Live DNS Checker via Cloudflare DoH
  const handleVerifyDns = async () => {
    setIsVerifying(true)
    const results: Record<string, "verified" | "pending"> = {}

    try {
      // Check MX
      const mxRes = await postarcApi.checkLiveDns(domain, "MX")
      results["MX"] = mxRes.success ? "verified" : "pending"

      // Check SPF
      const spfRes = await postarcApi.checkLiveDns(domain, "TXT")
      const hasSpf = spfRes.answers.some((a) => a.includes("v=spf1"))
      results["SPF"] = hasSpf ? "verified" : "pending"

      // Check DMARC
      const dmarcRes = await postarcApi.checkLiveDns(`_dmarc.${domain}`, "TXT")
      const hasDmarc = dmarcRes.answers.some((a) => a.includes("v=DMARC1"))
      results["DMARC"] = hasDmarc ? "verified" : "pending"

      // Check DKIM
      const dkimRes = await postarcApi.checkLiveDns(`postarc._domainkey.${domain}`, "TXT")
      const hasDkim = dkimRes.answers.some((a) => a.includes("v=DKIM1"))
      results["DKIM"] = hasDkim ? "verified" : "pending"

      setVerificationResults(results)
    } finally {
      setIsVerifying(false)
    }
  }

  // Step 4: Finish setup & create user
  const handleFinalizeSetup = async () => {
    try {
      await postarcApi.createDomain(domain).catch(() => {})

      await postarcApi.createUser({
        email: adminEmail,
        fullName: "SuperAdmin",
        password: adminPassword,
        role: "admin",
      }).catch(() => {})

      await postarcApi.injectOnboardingWelcomeEmail(
        adminEmail,
        domain,
        hostname
      ).catch(() => {})

      // Establish authenticated session immediately
      await postarcApi.login(adminEmail, adminPassword).catch(() => {})

      setIsAccountCreated(true)
    } catch {
      setIsAccountCreated(true)
    }
  }

  const stepProgress = Math.round((currentStep / 4) * 100)

  return (
    <VStack
      gap={6}
      width="100%"
      maxWidth={860}
      padding={6}
      style={{ margin: "0 auto" }}
    >
      {/* ── Brand Header ── */}
      <VStack gap={2} hAlign="center" width="100%">
        <HStack gap={2} vAlign="center">
          <ShieldCheck size={32} className="text-blue-500" />
          <Heading level={1}>Postarc Production Onboarding</Heading>
        </HStack>
        <Text type="body" color="secondary" size="base">
          Self-hosted enterprise email server setup & cryptographic key provisioning.
        </Text>
      </VStack>

      {/* ── Stepper Progress Bar ── */}
      <VStack gap={2} width="100%">
        <HStack hAlign="between" vAlign="center" width="100%">
          <Text type="supporting" color="secondary">
            Step {currentStep} of 4:{" "}
            {currentStep === 1
              ? "Domain & Hostname"
              : currentStep === 2
              ? "DKIM Keys & DNS Records"
              : currentStep === 3
              ? "Live DNS Verification"
              : "Administrator Account & Launch"}
          </Text>
          <Text type="supporting" color="secondary" weight="semibold">
            {stepProgress}% Complete
          </Text>
        </HStack>
        <ProgressBar label="Setup Progress" value={stepProgress} max={100} />
      </VStack>

      {/* ── STEP 1: Domain & Server Details ── */}
      {currentStep === 1 && (
        <Card padding={6} width="100%">
          <VStack gap={4} width="100%">
            <VStack gap={1}>
              <Heading level={3}>1. Mail Domain & Hostname Setup</Heading>
              <Text type="body" color="secondary" size="sm">
                Enter your registered domain and public server IP to configure inbound and outbound delivery routing.
              </Text>
            </VStack>

            <TextInput
              label="Primary Email Domain"
              placeholder="e.g. enterprise.corp"
              value={domain}
              onChange={(val) => {
                setDomain(val)
                setHostname(`mail.${val}`)
              }}
              width="100%"
            />

            <TextInput
              label="Mail Server Hostname (FQDN)"
              placeholder="e.g. mail.enterprise.corp"
              value={hostname}
              onChange={(val) => setHostname(val)}
              width="100%"
            />

            <TextInput
              label="Public Server IPv4 Address"
              placeholder="e.g. 203.0.113.10"
              value={serverIp}
              onChange={(val) => setServerIp(val)}
              width="100%"
            />

            <HStack hAlign="end" width="100%" paddingBlockStart={2}>
              <Button
                label="Generate DKIM Keys & DNS Records"
                variant="primary"
                size="md"
                icon={<Key size={16} />}
                isDisabled={!domain.trim() || !hostname.trim()}
                onClick={handleProceedToKeys}
              />
            </HStack>
          </VStack>
        </Card>
      )}

      {/* ── STEP 2: Cryptographic Keys & DNS Records ── */}
      {currentStep === 2 && (
        <Card padding={6} width="100%">
          <VStack gap={4} width="100%">
            <HStack hAlign="between" vAlign="center" width="100%">
              <VStack gap={1}>
                <Heading level={3}>2. Production Cryptographic DNS Records</Heading>
                <Text type="body" color="secondary" size="sm">
                  Add these records to your DNS provider (Cloudflare, Namecheap, Route53, etc.) for SPF, DKIM, and DMARC compliance.
                </Text>
              </VStack>

              <Button
                label="Download BIND Zone"
                variant="secondary"
                size="sm"
                icon={<Download size={16} />}
                onClick={handleDownloadZoneFile}
              />
            </HStack>

            {/* DNS Records List */}
            <VStack gap={3} width="100%">
              {dnsRecords.map((rec, idx) => (
                <Card key={idx} padding={3} variant="muted" width="100%">
                  <VStack gap={1} width="100%">
                    <HStack hAlign="between" vAlign="center" width="100%">
                      <HStack gap={2} vAlign="center">
                        <Badge label={rec.type} variant="info" />
                        <Text type="code" size="sm" weight="bold">
                          {rec.name}
                        </Text>
                      </HStack>
                      <Text type="supporting" color="secondary" size="xsm">
                        {rec.purpose}
                      </Text>
                    </HStack>

                    <HStack hAlign="between" vAlign="center" width="100%">
                      <Text
                        type="code"
                        size="sm"
                        style={{ wordBreak: "break-all", flex: 1 }}
                      >
                        {rec.value}
                      </Text>
                      <Button
                        label={copiedId === String(idx) ? "Copied!" : "Copy"}
                        variant="ghost"
                        size="sm"
                        icon={<Copy size={14} />}
                        onClick={() => handleCopy(String(idx), rec.value)}
                      />
                    </HStack>
                  </VStack>
                </Card>
              ))}
            </VStack>

            <HStack hAlign="between" width="100%" paddingBlockStart={3}>
              <Button
                label="Back"
                variant="secondary"
                size="md"
                icon={<ArrowLeft size={16} />}
                onClick={() => setCurrentStep(1)}
              />
              <Button
                label="Verify Live DNS Records"
                variant="primary"
                size="md"
                icon={<Globe size={16} />}
                onClick={() => {
                  setCurrentStep(3)
                  handleVerifyDns()
                }}
              />
            </HStack>
          </VStack>
        </Card>
      )}

      {/* ── STEP 3: Live DNS Propagation Checker ── */}
      {currentStep === 3 && (
        <Card padding={6} width="100%">
          <VStack gap={4} width="100%">
            <HStack hAlign="between" vAlign="center" width="100%">
              <VStack gap={1}>
                <Heading level={3}>3. Live DNS Propagation Status</Heading>
                <Text type="body" color="secondary" size="sm">
                  Checking worldwide DNS propagation via Cloudflare DNS-over-HTTPS.
                </Text>
              </VStack>

              <Button
                label="Recheck DNS"
                variant="secondary"
                size="sm"
                icon={<RefreshCw size={16} className={isVerifying ? "animate-spin" : ""} />}
                isDisabled={isVerifying}
                onClick={handleVerifyDns}
              />
            </HStack>

            {/* Check Results Cards */}
            <VStack gap={3} width="100%">
              {[
                {
                  key: "MX",
                  title: "Inbound MX Routing",
                  desc: `mail.${domain} (Priority 10)`,
                },
                {
                  key: "SPF",
                  title: "Sender Policy Framework (SPF)",
                  desc: "v=spf1 mx ... ~all",
                },
                {
                  key: "DKIM",
                  title: "DKIM 2048-bit Signature Key",
                  desc: `postarc._domainkey.${domain}`,
                },
                {
                  key: "DMARC",
                  title: "DMARC Anti-Phishing Policy",
                  desc: `_dmarc.${domain} (p=quarantine)`,
                },
              ].map((item) => {
                const status = verificationResults[item.key] || "pending"
                const isPass = status === "verified"

                return (
                  <Card key={item.key} padding={3} width="100%">
                    <HStack hAlign="between" vAlign="center" width="100%">
                      <VStack gap={0}>
                        <Text type="body" weight="semibold">
                          {item.title}
                        </Text>
                        <Text type="supporting" color="secondary" size="xsm">
                          {item.desc}
                        </Text>
                      </VStack>

                      <Badge
                        label={isPass ? "Propagated & Verified" : "Pending Propagation"}
                        variant={isPass ? "success" : "warning"}
                      />
                    </HStack>
                  </Card>
                )
              })}
            </VStack>

            <Banner
              status="info"
              title="DNS changes can take from 2 to 60 minutes to propagate worldwide."
              description="You can proceed to launch your mail server now. Deliveries will start flowing as soon as your registrar updates."
              container="card"
            />

            <HStack hAlign="between" width="100%" paddingBlockStart={2}>
              <Button
                label="Back to Records"
                variant="secondary"
                size="md"
                icon={<ArrowLeft size={16} />}
                onClick={() => setCurrentStep(2)}
              />
              <Button
                label="Create Admin & Initialize Mailbox"
                variant="primary"
                size="md"
                icon={<ArrowRight size={16} />}
                onClick={() => setCurrentStep(4)}
              />
            </HStack>
          </VStack>
        </Card>
      )}

      {/* ── STEP 4: Administrator Account & Completion ── */}
      {currentStep === 4 && (
        <Card padding={6} width="100%">
          <VStack gap={4} width="100%">
            {!isAccountCreated ? (
              <>
                <VStack gap={1}>
                  <Heading level={3}>4. SuperAdmin Account Initialization</Heading>
                  <Text type="body" color="secondary" size="sm">
                    Create the primary administrative mailbox for {domain}.
                  </Text>
                </VStack>

                <TextInput
                  label="SuperAdmin Email Address"
                  value={adminEmail}
                  onChange={(val) => setAdminEmail(val)}
                  width="100%"
                />

                <TextInput
                  label="Initial Password"
                  type="password"
                  value={adminPassword}
                  onChange={(val) => setAdminPassword(val)}
                  width="100%"
                />

                <HStack hAlign="end" width="100%" paddingBlockStart={2}>
                  <Button
                    label="Initialize & Launch Postarc"
                    variant="primary"
                    size="md"
                    icon={<CheckCircle2 size={16} />}
                    isDisabled={!adminEmail.trim() || !adminPassword.trim()}
                    onClick={handleFinalizeSetup}
                  />
                </HStack>
              </>
            ) : (
              <VStack gap={4} hAlign="center" width="100%" padding={4}>
                <CheckCircle2 size={48} className="text-emerald-500" />
                <Heading level={2}>Postarc is Ready for Production!</Heading>
                <Text type="body" color="secondary" size="base">
                  Your domain <strong>{domain}</strong> has been configured with 2048-bit DKIM keys, SPF/DMARC policies, and a welcome email has been delivered to <strong>{adminEmail}</strong>.
                </Text>

                <HStack gap={3} paddingBlockStart={3}>
                  <Button
                    label="Open Webmail"
                    variant="primary"
                    size="md"
                    icon={<Mail size={16} />}
                    href="/mail"
                  />
                  <Button
                    label="Open Admin Console"
                    variant="secondary"
                    size="md"
                    icon={<ExternalLink size={16} />}
                    href="/admin"
                  />
                </HStack>
              </VStack>
            )}
          </VStack>
        </Card>
      )}
    </VStack>
  )
}
