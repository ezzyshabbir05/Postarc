export type DnsRecordStatus = "verified" | "pending" | "failed" | "unconfigured"

export interface CustomDomain extends Record<string, unknown> {
  id: string
  name: string
  isVerified: boolean
  isPrimary?: boolean
  verificationToken: string
  mxStatus: DnsRecordStatus
  spfStatus: DnsRecordStatus
  dkimStatus: DnsRecordStatus
  dmarcStatus: DnsRecordStatus
  catchAllEnabled: boolean
  catchAllTargetEmail?: string
  createdAt: string
}

export interface Alias extends Record<string, unknown> {
  id: string
  address: string // e.g. "support@enterprise.corp"
  displayName: string
  isActive: boolean
  sendAsAllowed: boolean
  targetEmails?: string[]
  type?: "alias" | "distribution_group"
  labelColor?: string
  domainName?: string
}

export interface AppPassword extends Record<string, unknown> {
  id: string
  name: string
  tokenPreview: string
  createdAt: string
  lastUsedAt: string | null
}

export interface AuditLogEntry extends Record<string, unknown> {
  id: string
  actorEmail: string
  action:
    | "password_reset"
    | "user_created"
    | "user_suspended"
    | "user_activated"
    | "quota_updated"
    | "imap_smtp_toggled"
    | "dns_checked"
    | "2fa_toggled"
    | "domain_added"
    | "disclaimer_updated"
  targetEmail: string
  ipAddress: string
  timestamp: string
  details?: string
}

export interface Organization extends Record<string, unknown> {
  id: string
  name: string
  domains: CustomDomain[]
  primaryDomainName: string
  domain: CustomDomain // Convenience reference to the primary domain
  defaultQuotaGB?: number // Default assigned employee quota (e.g. 15 GB)
  allowImapSmtpGlobal: boolean
  enforce2FA: boolean
  globalDisclaimer?: string
}

// Alias Tenant to Organization for single-org architecture
export type Tenant = Organization

export type UserRole = "admin" | "member"
export type UserStatus = "active" | "suspended" | "pending_password_change"

export interface MailboxUser extends Record<string, unknown> {
  id: string
  fullName: string
  email: string
  role: UserRole
  status: UserStatus
  avatarUrl?: string | null
  storageUsedBytes: number
  storageTotalBytes: number // Individual assigned quota from the organization pool
  allowImapSmtp: boolean
  mustChangePassword: boolean
  lastLoginAt: string | null
  createdAt: string
  organization?: Organization
  tenant?: Organization // Convenience alias matching organization
  aliases?: Alias[]
  appPasswords?: AppPassword[]
}
