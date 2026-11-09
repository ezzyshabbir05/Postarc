import type {
  MailboxUser,
  Organization,
  CustomDomain,
  AuditLogEntry,
  AppPassword,
  Alias,
} from "@/types/mailbox"

// ── Multi-Domain Registry for Enterprise Corp ────────────────────────────────
export const mockDomains: CustomDomain[] = [
  {
    id: "dom_corp_01",
    name: "enterprise.corp",
    isPrimary: true,
    isVerified: true,
    verificationToken: "postarc-verify=9f82d1c7a4b6",
    mxStatus: "verified",
    spfStatus: "verified",
    dkimStatus: "verified",
    dmarcStatus: "verified",
    catchAllEnabled: true,
    catchAllTargetEmail: "admin@enterprise.corp",
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "dom_corp_02",
    name: "enterprisegroup.com",
    isPrimary: false,
    isVerified: true,
    verificationToken: "postarc-verify=3b74e892d1c5",
    mxStatus: "verified",
    spfStatus: "verified",
    dkimStatus: "verified",
    dmarcStatus: "verified",
    catchAllEnabled: false,
    createdAt: "2026-03-10T00:00:00Z",
  },
  {
    id: "dom_corp_03",
    name: "support-corp.io",
    isPrimary: false,
    isVerified: false,
    verificationToken: "postarc-verify=a18c99f0e442",
    mxStatus: "pending",
    spfStatus: "verified",
    dkimStatus: "pending",
    dmarcStatus: "unconfigured",
    catchAllEnabled: false,
    createdAt: "2026-11-01T00:00:00Z",
  },
]

// ── Single Dedicated Organization ────────────────────────────────────────────
export const mockOrganization: Organization = {
  id: "org_enterprise_01",
  name: "Enterprise Corp",
  domains: mockDomains,
  primaryDomainName: "enterprise.corp",
  domain: mockDomains[0],
  defaultQuotaGB: 15,
  allowImapSmtpGlobal: true,
  enforce2FA: true,
  globalDisclaimer:
    "Confidentiality Notice: This email and any attachments are confidential and intended solely for the recipient. If you received this in error, please notify the sender and delete it immediately.",
}

// Backward-compatibility export
export const mockTenant: Organization = mockOrganization

export const mockCompanyAliases: Alias[] = [
  {
    id: "als_01",
    address: "support@enterprise.corp",
    displayName: "Customer Support (Group)",
    isActive: true,
    sendAsAllowed: true,
    type: "distribution_group",
    targetEmails: ["alex@enterprise.corp", "elena@enterprise.corp"],
    labelColor: "#3b82f6",
    domainName: "enterprise.corp",
  },
  {
    id: "als_02",
    address: "billing@enterprise.corp",
    displayName: "Billing & Accounts",
    isActive: true,
    sendAsAllowed: true,
    type: "alias",
    targetEmails: ["marcus@enterprise.corp"],
    labelColor: "#10b981",
    domainName: "enterprise.corp",
  },
  {
    id: "als_03",
    address: "contact@enterprisegroup.com",
    displayName: "Global Brand Inquiries",
    isActive: true,
    sendAsAllowed: true,
    type: "alias",
    targetEmails: ["admin@enterprise.corp"],
    labelColor: "#8b5cf6",
    domainName: "enterprisegroup.com",
  },
  {
    id: "als_04",
    address: "security@enterprise.corp",
    displayName: "Security Incident Response",
    isActive: true,
    sendAsAllowed: false,
    type: "distribution_group",
    targetEmails: ["admin@enterprise.corp", "alex@enterprise.corp"],
    labelColor: "#ef4444",
    domainName: "enterprise.corp",
  },
]

export const mockAppPasswords: AppPassword[] = [
  {
    id: "app_pwd_01",
    name: "iPhone Apple Mail",
    tokenPreview: "postarc_app_••••_8k3w",
    createdAt: "2026-02-10T14:22:00Z",
    lastUsedAt: "2026-11-08T09:15:00Z",
  },
  {
    id: "app_pwd_02",
    name: "MacBook Outlook 365",
    tokenPreview: "postarc_app_••••_9x1v",
    createdAt: "2026-03-01T11:00:00Z",
    lastUsedAt: "2026-11-07T18:40:00Z",
  },
]

export const mockCompanyUsers: MailboxUser[] = [
  {
    id: "usr_admin_01",
    fullName: "Jordan Vance",
    email: "admin@enterprise.corp",
    role: "admin",
    status: "active",
    avatarUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJIYCuvmrPJP4avHqKlVrF8Wpkg6sCZ0Wy6WIbii-zV2NqiHKhWsKCr00&s=10",
    storageUsedBytes: 0.8 * 1024 * 1024 * 1024, // 0.8 GB
    storageTotalBytes: 15 * 1024 * 1024 * 1024, // 15 GB
    allowImapSmtp: true,
    mustChangePassword: false,
    lastLoginAt: "2026-11-08T11:20:00Z",
    createdAt: "2026-01-15T00:00:00Z",
    organization: mockOrganization,
    tenant: mockOrganization,
    aliases: [],
    appPasswords: [],
  },
  {
    id: "usr_postarc_01",
    fullName: "Alex Rivera",
    email: "alex@enterprise.corp",
    role: "member",
    status: "active",
    avatarUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJIYCuvmrPJP4avHqKlVrF8Wpkg6sCZ0Wy6WIbii-zV2NqiHKhWsKCr00&s=10",
    storageUsedBytes: 1.45 * 1024 * 1024 * 1024, // 1.45 GB (~10%)
    storageTotalBytes: 15 * 1024 * 1024 * 1024, // 15 GB
    allowImapSmtp: true,
    mustChangePassword: false,
    lastLoginAt: "2026-11-08T10:45:00Z",
    createdAt: "2026-01-16T10:00:00Z",
    organization: mockOrganization,
    tenant: mockOrganization,
    aliases: mockCompanyAliases.slice(0, 2),
    appPasswords: mockAppPasswords,
  },
  {
    id: "usr_postarc_02",
    fullName: "Marcus Chen",
    email: "marcus@enterprise.corp",
    role: "member",
    status: "active",
    avatarUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJIYCuvmrPJP4avHqKlVrF8Wpkg6sCZ0Wy6WIbii-zV2NqiHKhWsKCr00&s=10",
    storageUsedBytes: 12.45 * 1024 * 1024 * 1024, // 12.45 GB (~83% -> Soft Limit Warning)
    storageTotalBytes: 15 * 1024 * 1024 * 1024, // 15 GB
    allowImapSmtp: true,
    mustChangePassword: false,
    lastLoginAt: "2026-11-07T16:10:00Z",
    createdAt: "2026-02-01T08:30:00Z",
    organization: mockOrganization,
    tenant: mockOrganization,
    aliases: [],
    appPasswords: [],
  },
  {
    id: "usr_postarc_03",
    fullName: "Elena Rostova",
    email: "elena@enterprise.corp",
    role: "member",
    status: "active",
    avatarUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJIYCuvmrPJP4avHqKlVrF8Wpkg6sCZ0Wy6WIbii-zV2NqiHKhWsKCr00&s=10",
    storageUsedBytes: 24.1 * 1024 * 1024 * 1024, // 24.1 GB (~96% -> Admin 95% Alert!)
    storageTotalBytes: 25 * 1024 * 1024 * 1024, // 25 GB Heavy User Quota
    allowImapSmtp: true,
    mustChangePassword: false,
    lastLoginAt: "2026-11-08T08:05:00Z",
    createdAt: "2026-01-20T12:00:00Z",
    organization: mockOrganization,
    tenant: mockOrganization,
    aliases: [mockCompanyAliases[0]],
    appPasswords: [],
  },
  {
    id: "usr_postarc_04",
    fullName: "Sarah Jenkins",
    email: "sarah@enterprise.corp",
    role: "member",
    status: "pending_password_change",
    avatarUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJIYCuvmrPJP4avHqKlVrF8Wpkg6sCZ0Wy6WIbii-zV2NqiHKhWsKCr00&s=10",
    storageUsedBytes: 0.2 * 1024 * 1024 * 1024, // 0.2 GB
    storageTotalBytes: 5 * 1024 * 1024 * 1024, // 5 GB
    allowImapSmtp: false,
    mustChangePassword: true,
    lastLoginAt: null,
    createdAt: "2026-11-08T09:00:00Z",
    organization: mockOrganization,
    tenant: mockOrganization,
    aliases: [],
    appPasswords: [],
  },
  {
    id: "usr_postarc_05",
    fullName: "David Miller",
    email: "david@enterprise.corp",
    role: "member",
    status: "suspended",
    avatarUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJIYCuvmrPJP4avHqKlVrF8Wpkg6sCZ0Wy6WIbii-zV2NqiHKhWsKCr00&s=10",
    storageUsedBytes: 4.8 * 1024 * 1024 * 1024, // 4.8 GB
    storageTotalBytes: 15 * 1024 * 1024 * 1024, // 15 GB
    allowImapSmtp: false,
    mustChangePassword: false,
    lastLoginAt: "2026-10-15T14:00:00Z",
    createdAt: "2026-01-25T14:00:00Z",
    organization: mockOrganization,
    tenant: mockOrganization,
    aliases: [],
    appPasswords: [],
  },
]

// Immutable Audit Log
export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "aud_01",
    actorEmail: "admin@enterprise.corp",
    action: "password_reset",
    targetEmail: "sarah@enterprise.corp",
    ipAddress: "192.168.1.5",
    timestamp: "2026-11-08T11:30:00Z",
    details: "Generated temporary password with 'Must change password on first login' enforced.",
  },
  {
    id: "aud_02",
    actorEmail: "admin@enterprise.corp",
    action: "quota_updated",
    targetEmail: "elena@enterprise.corp",
    ipAddress: "192.168.1.5",
    timestamp: "2026-11-05T14:15:00Z",
    details: "Increased personal quota from 15 GB to 25 GB from company pool.",
  },
  {
    id: "aud_03",
    actorEmail: "admin@enterprise.corp",
    action: "user_suspended",
    targetEmail: "david@enterprise.corp",
    ipAddress: "192.168.1.5",
    timestamp: "2026-10-20T09:30:00Z",
    details: "Offboarded contractor account; active sessions and IMAP access revoked.",
  },
  {
    id: "aud_04",
    actorEmail: "admin@enterprise.corp",
    action: "dns_checked",
    targetEmail: "enterprise.corp",
    ipAddress: "192.168.1.5",
    timestamp: "2026-10-01T12:00:00Z",
    details: "Automated verification check passed for MX, SPF, DKIM, and DMARC.",
  },
  {
    id: "aud_05",
    actorEmail: "admin@enterprise.corp",
    action: "domain_added",
    targetEmail: "support-corp.io",
    ipAddress: "192.168.1.5",
    timestamp: "2026-11-01T10:00:00Z",
    details: "Registered secondary support domain support-corp.io with pending DNS verification.",
  },
]

// Default active mailbox user (Alex Rivera)
export const mockMailboxUser: MailboxUser = mockCompanyUsers[1]

// Default active company admin (Jordan Vance)
export const mockAdminUser: MailboxUser = mockCompanyUsers[0]

// Employee storage usage summary helper
export function getStoragePoolSummary(
  users: MailboxUser[] = mockCompanyUsers
) {
  const allocatedBytes = users.reduce((acc, u) => acc + u.storageTotalBytes, 0)
  const usedBytes = users.reduce((acc, u) => acc + u.storageUsedBytes, 0)

  return {
    allocatedGB: (allocatedBytes / (1024 * 1024 * 1024)).toFixed(0),
    usedGB: (usedBytes / (1024 * 1024 * 1024)).toFixed(1),
    totalUsers: users.length,
    criticalUsersCount: users.filter((u) => u.storageUsedBytes / u.storageTotalBytes >= 0.95).length,
    warningUsersCount: users.filter((u) => u.storageUsedBytes / u.storageTotalBytes >= 0.8).length,
  }
}
