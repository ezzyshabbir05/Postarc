# Postarc Enterprise Mail & Collaboration Platform

> An all-in-one, secure, scalable mail & collaboration platform with full protocol support (JMAP, SMTP, IMAP4rev2, POP3, CalDAV, CardDAV, WebDAV) and a modern Webmail & Administration portal built with Meta's Astryx design system.

---

## Architecture Overview

```
Postarc/
├── docker-compose.yml           # Multi-container production deployment
├── .env.example                 # Self-hosting environment template
├── install.sh                   # One-line Ubuntu setup script
├── run.bat / run.sh             # Local developer runners
├── engine/                      # Postarc Engine (Rust mail core)
└── web/                         # Postarc Web (Webmail, Admin Console, Dashboard)
```

### Features

- **Protocols**:
  - **JMAP**: RFC 8620 (Core), RFC 8621 (Mail), RFC 8887 (WebSocket), RFC 9404 (Blob), RFC 9425 (Quota), RFC 9610 (Contacts), RFC 9670 (Sharing), RFC 9661 (Sieve), Calendars.
  - **SMTP**: RFC 5321 with automated DKIMv1/v2 (including post-quantum ML-DSA signatures), DMARC, SPF, ARC, MTA-STS, DANE, and virtual queues.
  - **IMAP**: IMAP4rev2 (RFC 9051) & IMAP4rev1 (RFC 3501).
  - **POP3**: RFC 1939 with STLS and SASL.
  - **Groupware**: CalDAV (RFC 4791), CardDAV (RFC 6352), WebDAV (RFC 4918).
  - **Security**: Built-in Bayesian spam classifier, DNSBLs, homoglyphic phishing detection, rate limiting, and automated ACME TLS.

- **Postarc Webmail (`/mail`) - Full Roundcube Feature Suite**:
  - Drag-&-Drop message management between folders
  - Threaded conversation listing with collapsible message trees
  - Full MIME & Rich HTML message composing
  - Multiple sender identities (switch `From:` in composer)
  - Full-featured Address Book with contact groups & find-as-you-type autocomplete
  - Canned response templates with instant insertion
  - Remote tracker image blocking with "Load Images" banner
  - Suspicious & phishing external link confirmation warnings
  - Message flags (`seen`, `starred`, `answered`, `forwarded`, `draft`, `spam`)
  - Import & Export (.eml format)
  - IMAP/JMAP folder management (nested mailboxes, create/rename/delete)
  - Storage quota gauge showing live disk consumption
  - Out of office / vacation auto-responder

- **Postarc Admin Console (`/admin`)**:
  - Domain management with automated DNS health checks (MX, SPF, DKIM, DMARC)
  - User provisioning, status management, and custom quota sliders
  - Aliases & Distribution groups routing
  - Security policies, global 2FA enforcement, and real-time audit logs
  - Outbound MTA queue inspector

---

## Quick Start (Self-Hosting on Ubuntu Server)

```bash
# Clone the repository
git clone <your-repo-url> Postarc
cd Postarc

# Run one-line installer
chmod +x install.sh
sudo ./install.sh
```

---

## Local Development (Frontend)

```bash
cd web
npm install
npm run dev
# Open http://localhost:3000
```

