# Postarc — Open-Source Self-Hosted Mail & Collaboration Server

<p align="center">
  <strong>A modern, privacy-first, memory-safe alternative to Google Workspace, Microsoft 365, and Roundcube.</strong><br>
  Deploy your own full-featured mail server on any Linux server with a single command.
</p>

---

> [!NOTE]
> **Open Source Project Notice**: Postarc is an open-source software project, **not** a hosted commercial service or SaaS company. There is no central Postarc service or mandatory third-party account. When you deploy Postarc, you run the complete stack on your own server or VPS, with your own domains, and maintain full custody over your encryption keys and mail database.

---

## Table of Contents
- [Why Postarc?](#why-postarc)
- [Architecture Overview](#architecture-overview)
- [Feature Highlights](#feature-highlights)
  - [Postarc Webmail (Full Roundcube Suite)](#postarc-webmail-full-roundcube-suite)
  - [Postarc Engine (Rust Backend)](#postarc-engine-rust-backend)
  - [Admin Console & Onboarding](#admin-console--onboarding)
- [System Requirements](#system-requirements)
- [Quick Start: Production Deployment (Ubuntu / Debian)](#quick-start-production-deployment-ubuntu--debian)
- [Interactive Onboarding Wizard & DKIM Key Generation](#interactive-onboarding-wizard--dkim-key-generation)
- [DNS Configuration Guide](#dns-configuration-guide)
- [Email Client Configuration (Thunderbird, iOS, Android, Outlook)](#email-client-configuration)
- [Local Developer Setup](#local-developer-setup)
- [Automated Pipeline Testing](#automated-pipeline-testing)
- [Directory Structure](#directory-structure)
- [Security & Best Practices](#security--best-practices)
- [License](#license)

---

## Why Postarc?

Traditional open-source mail stacks (Postfix + Dovecot + SpamAssassin + Roundcube) are notorious for fragile configuration files, disparate logs, and dated user interfaces.

Postarc consolidates modern email infrastructure into an autonomous, self-contained platform:
- **Rust-Powered Engine**: Built with AWS-LC cryptographic primitives and `zstd` compressed deduplicated mail storage.
- **Modern Next.js 16 Webmail**: Built with Meta's Astryx design system (`@astryxdesign/core`) for a responsive, fluid webmail experience.
- **Zero Lock-In**: Supports standard open protocols: **JMAP** (RFC 8620/8621/8887), **IMAP4rev2**, **POP3**, **SMTP/Submission**, **ManageSieve**, **CalDAV**, and **CardDAV**.
- **First-Class Deliverability**: Native automated 2048-bit RSA DKIM key generation, SPF, DMARC alignment, MTA-STS transport security, and TLSRPT diagnostic reporting.

---

## Architecture Overview

```
                          ┌────────────────────────────────┐
                          │   Inbound SMTP / SMTPS / IMAP   │
                          │   (Ports 25, 465, 587, 993)    │
                          └───────────────┬────────────────┘
                                          │
                                          ▼
   ┌─────────────────────────────────────────────────────────────────────────────┐
   │                               POSTARC STACK                                 │
   │                                                                             │
   │   ┌──────────────────────────┐             ┌────────────────────────────┐   │
   │   │       postarc-web        │   JMAP /    │       postarc-engine       │   │
   │   │  (Next.js 16 + Astryx)   │◄───────────►│       (Rust Core)          │   │
   │   │  Webmail, Admin, Wizard  │  WebSocket  │  SMTP, IMAP, POP3, DAV     │   │
   │   └──────────────────────────┘             └─────────────┬──────────────┘   │
   │                                                          │                  │
   │                                          ┌───────────────┴──────────────┐   │
   │                                          ▼                              ▼   │
   │                              ┌──────────────────────┐      ┌────────────┐   │
   │                              │      postarc-db      │      │postarc-redi│   │
   │                              │   (PostgreSQL 16)    │      │ (Redis 7)  │   │
   │                              └──────────────────────┘      └────────────┘   │
   └─────────────────────────────────────────────────────────────────────────────┘
```

---

## Feature Highlights

### Postarc Webmail (Full Roundcube Suite)
The webmail client provides complete feature parity with Roundcube, reimagined in a clean, modern interface:
- **Conversation Threading**: Tree-structured conversation views with collapsible message nodes.
- **Drag-and-Drop Organization**: Drag single or multiple emails between folders in real time.
- **Address Book & vCard Support**: Manage contacts, personal/work groups, and import/export RFC 6350 `.vcf` vCards.
- **Groupware Calendar (CalDAV)**: Interactive month calendar view, event creator, and RFC 5545 `.ics` export.
- **ManageSieve Mail Filters**: Server-side RFC 5228 rule builder with condition criteria (`Subject`, `From`, `To`, `Body`), action triggers (`fileinto`, `flag`, `discard`, `forward`), and raw script inspection.
- **Rich Text HTML Editor**: Integrated formatting toolbar (Bold, Italic, Code, Lists, Quotes, Links) with real-time HTML preview.
- **Single-Message & Thread Printing**: Dedicated print stylesheets for paper or PDF export.
- **OpenPGP Armored Signing**: In-browser cleartext message signing (`BEGIN PGP SIGNED MESSAGE`) and signature verification badges.
- **Privacy Tracker Shield**: Blocks remote tracking pixels and images with a 1-click unblock banner.
- **Raw .eml Ingestion & Export**: Download RFC 822 `.eml` files or upload and ingest `.eml` files into any folder.
- **Real-Time JMAP Push**: Instant zero-reload notification and message delivery via RFC 8887 WebSocket (`/jmap/ws`).
- **Live Storage Quota Gauge**: Visual disk usage indicator with 80% capacity warning.
- **Canned Responses & Vacation Responder**: Saved reply templates and automated out-of-office autoreplies.

### Postarc Engine (Rust Backend)
- **High Throughput**: Native asynchronous I/O powered by Tokio and Hyper.
- **Memory-Safe**: Zero risk of buffer overflows, use-after-free, or memory corruption.
- **Protocol Suite**:
  - JMAP: RFC 8620 (Core), RFC 8621 (Mail), RFC 8887 (WebSocket), RFC 9425 (Quota).
  - SMTP: RFC 5321 with DKIMv1/v2, SPF, DMARC, ARC, MTA-STS, and virtual queues.
  - IMAP: IMAP4rev2 (RFC 9051) & IMAP4rev1 (RFC 3501) with STARTTLS.
  - POP3: RFC 1939 with STLS.
  - Groupware: CalDAV (RFC 4791), CardDAV (RFC 6352).
  - Security: Bayesian spam filter, homoglyphic phishing detection, and ACME TLS.

### Admin Console & Onboarding
- **Multi-Domain Routing**: Register custom domains, set catch-all addresses, and monitor MX/SPF/DKIM/DMARC status.
- **User & Quota Governance**: Provision mailboxes with custom storage limits, password expiration, and protocol toggles.
- **Aliases & Distribution Groups**: Multi-recipient distribution lists with granular send-as permissions.
- **Security Audit Logs**: Track authentication attempts, active sessions, and protocol connection events.

---

## System Requirements

| Resource | Minimum | Recommended |
| :--- | :--- | :--- |
| **OS** | Ubuntu 22.04 / 24.04 LTS, Debian 12 | Ubuntu 24.04 LTS (64-bit) |
| **CPU** | 1 vCPU | 2+ vCPUs |
| **RAM** | 2 GB | 4 GB+ |
| **Storage** | 20 GB SSD | 50 GB+ NVMe SSD |
| **Networking** | 1 Static Public IPv4 | Static IPv4 + IPv6, Port 25 unblocked |

> [!IMPORTANT]
> **Port 25 Access**: Most cloud VPS providers (AWS, GCP, DigitalOcean, Linode, Hetzner) block outbound Port 25 by default to prevent spam. Ensure you request Port 25 unblocking through your hosting provider's support ticket before deploying an outbound mail server.

---

## Quick Start: Production Deployment (Ubuntu / Debian)

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/postarc.git
cd postarc
```

### 2. Run the One-Click Installer
```bash
chmod +x install.sh
sudo ./install.sh
```

The script will automatically:
1. Verify and install Docker CE & Docker Compose if missing.
2. Prompt for your primary mail domain (e.g. `yourdomain.com`) and admin email.
3. Generate cryptographically secure passwords for PostgreSQL, Redis, and Admin sessions in `.env`.
4. Open required firewall ports in UFW (`25`, `465`, `587`, `143`, `993`, `110`, `995`, `4190`, `80`, `443`, `3000`).
5. Generate 2048-bit RSA DKIM keys and export your domain's BIND `.zone` file.
6. Build and launch all containers via Docker Compose.
7. Print out your administrator credentials and exact DNS records.

---

## Interactive Onboarding Wizard & DKIM Key Generation

Once the stack is running, access the **Production Onboarding Wizard**:
```
http://<your-server-ip>:3000/onboarding
```

The 4-step wizard will walk you through:
1. **Domain & Hostname Input**: Define your email domain (e.g. `example.com`), mail server FQDN (`mail.example.com`), and public server IP.
2. **Key Generation & DNS**: Generates a 2048-bit RSA DKIM key pair, computed SPF string, DMARC policy, and MTA-STS records with 1-click copy buttons.
3. **Live DNS Verification**: Queries public DNS via Cloudflare DNS-over-HTTPS (`https://cloudflare-dns.com/dns-query`) to confirm records have propagated worldwide.
4. **SuperAdmin Account Initialization**: Sets up the primary administrative mailbox and sends a welcome confirmation email with complete connection settings.

### CLI Key Generator
You can also generate cryptographic keys directly from the command line anytime:
```bash
node scripts/generate-keys.js <domain> <hostname> <server_ip>

# Example:
node scripts/generate-keys.js yourdomain.com mail.yourdomain.com 203.0.113.10
```
Outputs:
- Private Key: `engine/config/dkim/<domain>.private.key` (permission 0600)
- Public Key: `engine/config/dkim/<domain>.public.key`
- BIND Zone: `engine/config/dkim/<domain>.zone`
- JSON Records: `engine/config/dkim/<domain>.dns.json`

---

## DNS Configuration Guide

Add the following records at your DNS registrar (Cloudflare, Namecheap, Route53, Porkbun, etc.):

| Type | Name / Host | Priority | Value / Target | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `mail` | — | `<YOUR_SERVER_IP>` | Mail host server IP |
| **MX** | `@` | `10` | `mail.<YOUR_DOMAIN>` | Primary inbound mail routing |
| **TXT** | `@` | — | `v=spf1 mx a:mail.<YOUR_DOMAIN> ip4:<YOUR_SERVER_IP> ~all` | Sender Policy Framework (SPF) |
| **TXT** | `postarc._domainkey` | — | `v=DKIM1; k=rsa; p=<YOUR_2048_BIT_PUBLIC_KEY>` | DKIM cryptographic signature |
| **TXT** | `_dmarc` | — | `v=DMARC1; p=quarantine; sp=quarantine; pct=100; rua=mailto:dmarc@<YOUR_DOMAIN>` | DMARC anti-phishing policy |
| **TXT** | `_mta-sts` | — | `v=STSv1; id=2026110901` | MTA Strict Transport Security |
| **TXT** | `_smtp._tls` | — | `v=TLSRPTv1; rua=mailto:tlsrpt@<YOUR_DOMAIN>` | SMTP TLS failure reporting |

> [!TIP]
> **Reverse DNS (PTR)**: Set your server IP's reverse DNS (PTR record) in your VPS hosting control panel to match your mail FQDN (e.g. `mail.yourdomain.com`). This is required by Gmail and Microsoft for spam reputation.

---

## Email Client Configuration

Connect any desktop or mobile email client (Thunderbird, Apple Mail, Outlook, iOS, Android):

### Incoming Mail (IMAP)
- **Server**: `mail.<yourdomain.com>`
- **Port**: `993` (SSL/TLS) or `143` (STARTTLS)
- **Username**: Your full email address (e.g. `user@yourdomain.com`)
- **Password**: Your Postarc account password or an **App Password** generated under *Settings → App Passwords*.

### Outgoing Mail (SMTP)
- **Server**: `mail.<yourdomain.com>`
- **Port**: `465` (SSL/TLS) or `587` (STARTTLS Submission)
- **Authentication**: Required (same credentials as incoming)

### Groupware (Calendars & Contacts)
- **CalDAV (Calendar)**: `https://mail.<yourdomain.com>/dav/calendars/`
- **CardDAV (Contacts)**: `https://mail.<yourdomain.com>/dav/addressbooks/`
- **JMAP API**: `https://mail.<yourdomain.com>/jmap/`

---

## Local Developer Setup

If you want to contribute to Postarc or run the stack locally for development:

### 1. Start Engine Backend Services
```bash
# On Linux / macOS:
docker compose up -d db redis engine

# On Windows:
run-engine.bat
```

### 2. Run Next.js Web UI
```bash
cd web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Verify TypeScript Types
```bash
cd web
npx tsc --noEmit
```

---

## Automated Pipeline Testing

Postarc includes an automated end-to-end diagnostic test harness:
```bash
npm run test:pipeline
# or:
node scripts/test-pipeline.js
```

The harness executes 5 diagnostic probes against the live server:
1. **Engine HTTP Healthcheck**: Verifies HTTP `/healthz/live` endpoint.
2. **JMAP RFC 8620 Authentication**: Validates session initialization with Basic and Bearer auth.
3. **Mailbox Hierarchy Discovery**: Queries `Mailbox/get` for standard folders.
4. **Storage Quota Endpoint**: Validates RFC 9425 storage limits.
5. **Message Ingestion & Storage**: Tests JMAP message ingestion and folder delivery.

---

## Directory Structure

```
Postarc/
├── docker-compose.yml          # Production multi-container topology
├── .env.example                # Configuration template
├── install.sh                  # One-click installer for Ubuntu/Debian
├── run.bat / run-engine.bat    # Windows local runners
├── scripts/
│   ├── generate-keys.js        # 2048-bit RSA DKIM & DNS zone generator CLI
│   └── test-pipeline.js        # Automated end-to-end pipeline test harness
├── engine/                     # Postarc Engine (Rust mail core)
│   ├── Cargo.toml
│   ├── Dockerfile              # Multi-stage cargo-chef Debian image
│   ├── bootstrap/
│   │   └── init-db.sql         # PostgreSQL 16 schema bootstrap
│   ├── config/
│   │   ├── postarc.toml        # Engine configuration
│   │   └── dkim/               # Output directory for generated DKIM keys
│   └── crates/                 # Modular Rust crates (JMAP, SMTP, IMAP, DAV)
└── web/                        # Postarc Web (Next.js 16 + Meta Astryx)
    ├── Dockerfile              # Production standalone Next.js image
    ├── package.json
    ├── app/
    │   ├── page.tsx            # Login & authentication
    │   ├── onboarding/         # 4-step Production Onboarding Wizard
    │   ├── mail/               # Webmail suite (threads, calendar, contacts, filters, settings)
    │   └── admin/              # Admin console (domains, users, aliases, security, storage)
    ├── components/             # Astryx UI components (composer, thread viewer, shell)
    └── lib/
        └── postarc-api.ts      # Unified JMAP & Directory API client
```

---

## Security & Best Practices

1. **Keep Private Keys Secure**: DKIM private keys (`engine/config/dkim/*.private.key`) must remain strictly confidential (mode `0600`) and are excluded from git.
2. **Use App Passwords**: Generate dedicated app passwords in *Settings → App Passwords* for third-party email clients so your master password remains unexposed.
3. **Automated ACME TLS**: Let's Encrypt / ZeroSSL TLS certificates are automatically managed and renewed by the engine on port 80/443.
4. **Regular Database Backups**: Back up the `postarc-db-data` Docker volume or run `pg_dump` on the PostgreSQL container periodically.

---

## License

Postarc is open-source software licensed under the [Apache License 2.0](LICENSE).
Anyone is free to use, modify, distribute, and self-host Postarc for personal or commercial purposes without fees or telemetry.
