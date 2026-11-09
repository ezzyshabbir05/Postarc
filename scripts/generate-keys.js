#!/usr/bin/env node

/**
 * =============================================================================
 * Postarc Production Cryptographic Key & DNS Record Generator
 * =============================================================================
 *
 * Generates 2048-bit RSA DKIM cryptographic keys, computes DNS records
 * (MX, A, SPF, DKIM selector, DMARC, MTA-STS, TLSRPT), and outputs BIND zone files
 * and Cloudflare-ready DNS records.
 *
 * Usage:
 *   node scripts/generate-keys.js [domain] [hostname] [ip]
 * Example:
 *   node scripts/generate-keys.js enterprise.corp mail.enterprise.corp 203.0.113.10
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// ── 1. Parse Arguments & Environment ─────────────────────────────────────────

const args = process.argv.slice(2);
let domain = args[0];
let hostname = args[1];
let ip = args[2] || "127.0.0.1";

// Fallbacks from .env if present
if (!domain) {
  try {
    const envPath = path.resolve(__dirname, "../.env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      const hostMatch = envContent.match(/HOSTNAME=([^\r\n]+)/);
      if (hostMatch) {
        hostname = hostMatch[1].trim();
        // Extract domain from mail.domain.com
        const parts = hostname.split(".");
        if (parts.length >= 2) {
          domain = parts.slice(-2).join(".");
        }
      }
    }
  } catch {}
}

domain = domain || "example.com";
hostname = hostname || `mail.${domain}`;

// ── 2. Generate 2048-bit RSA DKIM Key Pair ───────────────────────────────────

console.log("\x1b[36m[INFO]\x1b[0m Generating 2048-bit RSA DKIM cryptographic key pair for " + domain + "...");

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

// Extract base64 public key body for DNS p= field
const pubKeyClean = publicKey
  .replace(/-----BEGIN PUBLIC KEY-----/, "")
  .replace(/-----END PUBLIC KEY-----/, "")
  .replace(/\r?\n|\r/g, "");

// Ensure dkim output directory exists
const dkimDir = path.resolve(__dirname, "../engine/config/dkim");
if (!fs.existsSync(dkimDir)) {
  fs.mkdirSync(dkimDir, { recursive: true });
}

const privateKeyPath = path.join(dkimDir, `${domain}.private.key`);
const publicKeyPath = path.join(dkimDir, `${domain}.public.key`);
fs.writeFileSync(privateKeyPath, privateKey, { mode: 0o600 });
fs.writeFileSync(publicKeyPath, publicKey, { mode: 0o644 });

console.log("\x1b[32m[SUCCESS]\x1b[0m Private key saved: " + privateKeyPath);
console.log("\x1b[32m[SUCCESS]\x1b[0m Public key saved:  " + publicKeyPath);

// ── 3. Build Production DNS Records ──────────────────────────────────────────

const selector = "postarc";
const dkimTxt = `v=DKIM1; k=rsa; p=${pubKeyClean}`;
const spfTxt = `v=spf1 mx a:${hostname} ip4:${ip} ~all`;
const dmarcTxt = `v=DMARC1; p=quarantine; sp=quarantine; pct=100; rua=mailto:dmarc-reports@${domain}; ruf=mailto:dmarc-reports@${domain}; fo=1; aspf=r; adkim=r`;
const mtaStsTxt = `v=STSv1; id=${new Date().toISOString().slice(0, 10).replace(/-/g, "")}01`;
const tlsRptTxt = `v=TLSRPTv1; rua=mailto:tlsrpt@${domain}`;

const dnsRecords = [
  {
    type: "A",
    name: hostname,
    value: ip,
    ttl: 300,
    purpose: "Mail Server Host IP Address",
  },
  {
    type: "MX",
    name: "@",
    value: hostname,
    priority: 10,
    ttl: 300,
    purpose: "Primary Inbound MX Routing",
  },
  {
    type: "TXT",
    name: "@",
    value: spfTxt,
    ttl: 300,
    purpose: "SPF (Sender Policy Framework)",
  },
  {
    type: "TXT",
    name: `${selector}._domainkey`,
    value: dkimTxt,
    ttl: 300,
    purpose: "DKIM 2048-bit Cryptographic Public Key",
  },
  {
    type: "TXT",
    name: "_dmarc",
    value: dmarcTxt,
    ttl: 300,
    purpose: "DMARC Policy & Alignment Protection",
  },
  {
    type: "TXT",
    name: "_mta-sts",
    value: mtaStsTxt,
    ttl: 300,
    purpose: "MTA-STS Strict Transport Security",
  },
  {
    type: "TXT",
    name: "_smtp._tls",
    value: tlsRptTxt,
    ttl: 300,
    purpose: "SMTP TLS Reporting (RFC 8460)",
  },
];

// ── 4. Generate BIND Zone File & JSON Export ─────────────────────────────────

const zoneLines = [
  `; =============================================================================`,
  `; Postarc DNS Zone File for ${domain}`,
  `; Generated at ${new Date().toISOString()}`,
  `; =============================================================================`,
  `$ORIGIN ${domain}.`,
  `$TTL 300`,
  ``,
  `; Host & Inbound Routing`,
  `${hostname.split(".")[0].padEnd(20)} IN  A      ${ip}`,
  `@                   IN  MX 10  ${hostname}.`,
  ``,
  `; SPF, DKIM & DMARC Security Authentication`,
  `@                   IN  TXT    "${spfTxt}"`,
  `${(selector + "._domainkey").padEnd(20)} IN  TXT    "${dkimTxt}"`,
  `_dmarc              IN  TXT    "${dmarcTxt}"`,
  ``,
  `; Transport Encryption (MTA-STS & TLSRPT)`,
  `_mta-sts            IN  TXT    "${mtaStsTxt}"`,
  `_smtp._tls          IN  TXT    "${tlsRptTxt}"`,
];

const zoneFilePath = path.join(dkimDir, `${domain}.zone`);
fs.writeFileSync(zoneFilePath, zoneLines.join("\n"), "utf-8");

const jsonFilePath = path.join(dkimDir, `${domain}.dns.json`);
fs.writeFileSync(jsonFilePath, JSON.stringify({ domain, hostname, ip, records: dnsRecords }, null, 2), "utf-8");

// ── 5. Pretty Terminal Output ────────────────────────────────────────────────

console.log("\n\x1b[1m===============================================================================\x1b[0m");
console.log(`\x1b[1m                Postarc Production DNS Records for ${domain}\x1b[0m`);
console.log("\x1b[1m===============================================================================\x1b[0m\n");

console.log("Add the following records to your DNS provider (Cloudflare, Namecheap, Route53, etc.):\n");

dnsRecords.forEach((rec) => {
  console.log(`\x1b[33mType:\x1b[0m    ${rec.type.padEnd(6)} \x1b[36mName:\x1b[0m ${rec.name.padEnd(24)} \x1b[32m(${rec.purpose})\x1b[0m`);
  if (rec.priority) {
    console.log(`\x1b[33mPri:\x1b[0m     ${rec.priority}`);
  }
  console.log(`\x1b[33mValue:\x1b[0m   ${rec.value}`);
  console.log("-------------------------------------------------------------------------------");
});

console.log(`\n\x1b[32m[SUCCESS]\x1b[0m BIND Zone File written: ${zoneFilePath}`);
console.log(`\x1b[32m[SUCCESS]\x1b[0m JSON Export written:      ${jsonFilePath}\n`);

module.exports = {
  domain,
  hostname,
  ip,
  selector,
  privateKey,
  publicKey,
  pubKeyClean,
  dnsRecords,
  zoneFile: zoneLines.join("\n"),
};
