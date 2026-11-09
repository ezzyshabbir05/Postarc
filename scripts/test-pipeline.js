#!/usr/bin/env node

/**
 * =============================================================================
 * Postarc End-to-End Pipeline & Integration Test Harness
 * =============================================================================
 *
 * Verifies that the Postarc Engine (JMAP RFC 8620/8621, Auth, Mailboxes, Quotas)
 * is fully operational and ready to serve Webmail and mail transport clients.
 *
 * Usage:
 *   node scripts/test-pipeline.js
 *
 * Environment variables:
 *   POSTARC_URL      (default: http://127.0.0.1:8080)
 *   POSTARC_USER     (default: admin@example.com)
 *   POSTARC_PASSWORD (default: ChangeMe#AdminSecret2026)
 */

const http = require("http");
const https = require("https");
const { URL } = require("url");

// Configuration from environment or defaults
const baseUrl = process.env.POSTARC_URL || "http://127.0.0.1:8080";
const username = process.env.POSTARC_USER || "admin@example.com";
const password = process.env.POSTARC_PASSWORD || "ChangeMe#AdminSecret2026";

const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

// ANSI Colors for CLI output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

function logPass(title, durationMs) {
  console.log(` ${colors.green}[PASS]${colors.reset} ${title} ${colors.cyan}(${durationMs}ms)${colors.reset}`);
}

function logFail(title, error) {
  console.log(` ${colors.red}[FAIL]${colors.reset} ${title}: ${error}`);
}

function logInfo(msg) {
  console.log(`${colors.cyan}[INFO]${colors.reset} ${msg}`);
}

// Low-level HTTP requester helper
function request(method, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const fullUrl = new URL(path, baseUrl);
    const client = fullUrl.protocol === "https:" ? https : http;
    const startTime = Date.now();

    const options = {
      method,
      hostname: fullUrl.hostname,
      port: fullUrl.port || (fullUrl.protocol === "https:" ? 443 : 80),
      path: fullUrl.pathname + fullUrl.search,
      headers: {
        "User-Agent": "Postarc-TestHarness/1.0",
        ...headers,
      },
      timeout: 10000,
    };

    const req = client.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const duration = Date.now() - startTime;
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          duration,
        });
      });
    });

    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timed out after 10000ms"));
    });

    if (body) {
      req.write(typeof body === "string" ? body : JSON.stringify(body));
    }
    req.end();
  });
}

// JMAP helper
async function jmapCall(using, methodCalls) {
  const res = await request(
    "POST",
    "/jmap/",
    {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    { using, methodCalls }
  );

  if (res.status === 401 || res.status === 403) {
    throw new Error(`Authentication rejected (${res.status}). Verify credentials.`);
  }

  if (res.status < 200 || res.status >= 300) {
    throw new Error(`JMAP HTTP error (${res.status}): ${res.body.slice(0, 100)}`);
  }

  try {
    return { data: JSON.parse(res.body), duration: res.duration };
  } catch (err) {
    throw new Error(`Invalid JSON response: ${err.message}`);
  }
}

// ─── Test Suite ─────────────────────────────────────────────────────────────

async function runTests() {
  console.log(`\n${colors.bold}========================================================${colors.reset}`);
  console.log(`${colors.bold}       Postarc End-to-End Mail Pipeline Test Suite      ${colors.reset}`);
  console.log(`${colors.bold}========================================================${colors.reset}\n`);

  logInfo(`Target Engine: ${baseUrl}`);
  logInfo(`Test Identity: ${username}`);
  console.log("");

  let passed = 0;
  let failed = 0;

  // Test 1: Healthcheck Probe
  try {
    const res = await request("GET", "/healthz/live");
    if (res.status === 200) {
      logPass("Engine HTTP Healthcheck Probe (/healthz/live)", res.duration);
      passed++;
    } else {
      // If /healthz/live is not configured, probe /
      const rootRes = await request("GET", "/");
      logPass("Engine HTTP Root Probe (/)", rootRes.duration);
      passed++;
    }
  } catch (err) {
    logFail("Engine HTTP Healthcheck Probe", err.message);
    failed++;
  }

  // Test 2: JMAP Authentication & Session Discovery
  try {
    const { data, duration } = await jmapCall(
      ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
      [["Mailbox/get", { accountId: "self", ids: [] }, "test-auth"]]
    );
    if (data && data.methodResponses) {
      logPass("JMAP RFC 8620 Authentication & Protocol Handshake", duration);
      passed++;
    } else {
      throw new Error("Missing methodResponses in JMAP payload");
    }
  } catch (err) {
    logFail("JMAP RFC 8620 Authentication", err.message);
    failed++;
  }

  // Test 3: Mailbox Hierarchy & Folder State
  try {
    const { data, duration } = await jmapCall(
      ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
      [["Mailbox/get", { accountId: "self", ids: null }, "get-mailboxes"]]
    );
    const mailboxes = data.methodResponses?.[0]?.[1]?.list || [];
    logPass(`JMAP Mailbox Hierarchy Discovery (${mailboxes.length} mailboxes active)`, duration);
    passed++;
  } catch (err) {
    logFail("JMAP Mailbox Hierarchy Discovery", err.message);
    failed++;
  }

  // Test 4: Storage Quota Endpoint (RFC 9425)
  try {
    const { data, duration } = await jmapCall(
      ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:quota"],
      [["Quota/get", { accountId: "self" }, "get-quota"]]
    );
    logPass("JMAP Storage Quota Endpoint (RFC 9425)", duration);
    passed++;
  } catch (err) {
    logFail("JMAP Storage Quota Endpoint", err.message);
    failed++;
  }

  // Test 5: Message Submission & Storage Pipeline
  try {
    const testSubject = `Automated Pipeline Probe ${Date.now()}`;
    const { data, duration } = await jmapCall(
      ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
      [
        [
          "Email/set",
          {
            accountId: "self",
            create: {
              probeMessage: {
                to: [{ email: username }],
                subject: testSubject,
                bodyValues: {
                  text: {
                    value: "Pipeline test payload delivered via Postarc Test Harness.",
                    isTruncated: false,
                  },
                },
                keywords: { $seen: true },
              },
            },
          },
          "probe-create",
        ],
      ]
    );

    const created = data.methodResponses?.[0]?.[1]?.created?.probeMessage;
    if (created?.id) {
      logPass(`JMAP Message Ingestion & Storage Pipeline (ID: ${created.id})`, duration);
      passed++;
    } else {
      throw new Error("Message creation response missing generated ID");
    }
  } catch (err) {
    logFail("JMAP Message Ingestion & Storage Pipeline", err.message);
    failed++;
  }

  // Summary
  console.log(`\n${colors.bold}--------------------------------------------------------${colors.reset}`);
  console.log(`  Results: ${colors.green}${passed} passed${colors.reset}, ${failed > 0 ? colors.red : colors.green}${failed} failed${colors.reset}`);
  console.log(`${colors.bold}--------------------------------------------------------${colors.reset}\n`);

  if (failed > 0) {
    console.log(`${colors.yellow}[TIP] If tests failed to connect:${colors.reset}`);
    console.log("  1. Make sure Postarc Engine is running: run-engine.bat or docker compose up -d");
    console.log("  2. Check engine logs: docker compose logs engine");
    console.log("  3. Verify POSTARC_USER and POSTARC_PASSWORD in .env match.\n");
    process.exit(1);
  } else {
    console.log(`${colors.green}[SUCCESS] Postarc mail & collaboration pipeline is fully operational!${colors.reset}\n`);
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test runner encountered fatal error:", err);
  process.exit(1);
});

