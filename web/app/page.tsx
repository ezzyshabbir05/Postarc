"use client"

import { useState, type FormEvent, type CSSProperties } from "react"
import { useRouter } from "next/navigation"
import WayglimBackground from "@/components/WayglimBackground"
import { Center } from "@astryxdesign/core/Center"
import { Card } from "@astryxdesign/core/Card"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading, Text } from "@astryxdesign/core/Text"
import { TextInput } from "@astryxdesign/core/TextInput"
import { Button } from "@astryxdesign/core/Button"
import { Link } from "@astryxdesign/core/Link"
import { Banner } from "@astryxdesign/core/Banner"
import { ShieldCheck, Mail } from "lucide-react"
import { postarcApi } from "@/lib/postarc-api"

const containerStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
}

const contentStyle: CSSProperties = {
  position: "relative",
  zIndex: 10,
  width: "100%",
  maxWidth: 420,
}

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault()
    if (!username.trim() || !password) {
      setErrorMessage("Please enter both username and password.")
      return
    }
    setErrorMessage("")
    setIsLoading(true)

    try {
      const res = await postarcApi.login(username.trim(), password)
      if (!res.success) {
        setErrorMessage(res.error || "Invalid username or password.")
        setIsLoading(false)
        return
      }

      const role = res.user?.role || (username.toLowerCase().startsWith("admin") ? "admin" : "member")
      if (role === "admin") {
        window.location.href = "/admin"
      } else {
        window.location.href = "/mail"
      }
    } catch {
      setErrorMessage("Unable to connect to authentication server.")
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <Center
      axis="both"
      minHeight="100vh"
      width="100%"
      padding={4}
      style={containerStyle}
    >
      {/* Wayglim animated background */}
      <WayglimBackground />

      {/* Login Content Frame */}
      <VStack
        gap={4}
        hAlign="center"
        style={contentStyle}
      >
        {/* Form Card */}
        <Card padding={8} width="100%" elevation="high">
          <VStack
            as="form"
            gap={4}
            hAlign="stretch"
            onSubmit={handleSubmit}
          >
            {/* Header */}
            <VStack gap={1} hAlign="center">
              <Heading level={2} justify="center">
                Sign in to Postarc
              </Heading>
              <Text type="body" color="secondary" justify="center" size="sm">
                Enter your email credentials to access your mailbox
              </Text>
            </VStack>

            {errorMessage && (
              <Banner
                status="error"
                title={errorMessage}
                container="card"
                isDismissable
                onDismiss={() => setErrorMessage("")}
              />
            )}

            <TextInput
              label="Email Address or Username"
              type="text"
              placeholder="e.g. admin@enterprise.corp or user@enterprise.corp"
              value={username}
              onChange={(val: string) => {
                setUsername(val)
                if (errorMessage) setErrorMessage("")
              }}
              size="lg"
              width="100%"
              isRequired
              autoComplete="username"
            />

            <VStack gap={1}>
              <TextInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(val: string) => {
                  setPassword(val)
                  if (errorMessage) setErrorMessage("")
                }}
                size="lg"
                width="100%"
                isRequired
                autoComplete="current-password"
              />
              <HStack hAlign="end">
                <Link href="#" size="sm" color="secondary">
                  Forgot password?
                </Link>
              </HStack>
            </VStack>

            <Button
              label={username.toLowerCase().includes("admin") ? "Sign in to Admin Console" : "Sign in to Webmail"}
              variant="primary"
              size="lg"
              width="100%"
              type="submit"
              isLoading={isLoading}
              onClick={handleSubmit}
            />

            <HStack hAlign="center" width="100%" paddingBlockStart={1}>
              <Link href="/onboarding" size="sm" color="secondary">
                First time setup? Run Onboarding Wizard →
              </Link>
            </HStack>
          </VStack>
        </Card>
      </VStack>
    </Center>
  )
}
