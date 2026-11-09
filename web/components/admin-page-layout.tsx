"use client"

import React, { ReactNode } from "react"
import { Layout, LayoutHeader, LayoutContent, VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading, Text } from "@astryxdesign/core/Text"

export interface AdminPageLayoutProps {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export function AdminPageLayout({
  title,
  description,
  actions,
  children,
}: AdminPageLayoutProps) {
  return (
    <Layout
      height="fill"
      defaultHasDividers
      header={
        <LayoutHeader hasDivider paddingBlockEnd={4}>
          <HStack hAlign="between" vAlign="center" width="100%">
            <VStack gap={0.5}>
              <Heading level={2}>{title}</Heading>
              {description && (
                <Text type="supporting" color="secondary">
                  {description}
                </Text>
              )}
            </VStack>
            {actions && (
              <HStack gap={2} vAlign="center">
                {actions}
              </HStack>
            )}
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={6}>
          <VStack gap={5} width="100%">
            {children}
          </VStack>
        </LayoutContent>
      }
    />
  )
}
