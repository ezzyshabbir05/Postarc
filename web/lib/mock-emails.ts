import type { EmailThread } from "@/types/email"

const amazonPayHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" style="margin-top:0;padding:0;margin:0;background-color:rgb(240, 240, 240);">
<head>
    <title>Amazon Pay Reminders</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
</head>
<body style="margin-top:0; padding:0; margin:0; background-color:rgb(240, 240, 240);">
<div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;font-family: sans-serif;">
    Hi Shabbir, Your prepaid recharge bill payment was <span style="color:#c45500;"><b>due</b></span> on <span style="color:#c45500;"><b>07 Nov 2026</b></span>
</div>
<div style="margin-top:0; padding:0; margin:0; background-color:rgb(240, 240, 240);">
    <table style="width:100%!important;table-layout:fixed;border-collapse:collapse;font-family:'Amazon Ember', Arial, Helvetica, sans-serif;border-spacing:0;background-color: rgb(246, 246, 246);" width="100%" border="0" cellpadding="0" cellspacing="0">
        <tbody>
        <tr>
            <td align="center" style="margin-top:0; padding: 20px 0; background-color: rgb(240, 240, 240);">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 480px; border-spacing:0; background-color:rgb(255,255,255); border-radius: 8px; overflow: hidden; border: 1px solid rgb(228, 228, 228); box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <tbody>
                    <tr>
                        <td align="center">
                            <table class="content-shell-table" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 480px; border-spacing:0; border-top: 5px solid #eda039;">
                                <tbody>
                                <tr>
                                    <td style="border-collapse:collapse">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; border-spacing:0">
                                            <tbody>
                                            <tr>
                                                <td align="left" style="padding-left: 20px; padding-right: 20px; padding-top:20px; text-align:left;">
                                                    <a href="https://www.amazon.in/amazonpay/home?ref_=email_p2p_dasp" target="_blank" rel="noreferrer" style="color:inherit">
                                                        <img src="https://m.media-amazon.com/images/G/31/AP4/Notifications/ApayLogoWhiteBG.jpg" alt="Amazon Pay" width="200" border="0" style="border:none; outline:none; border-collapse:collapse; border-style:none">
                                                    </a>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-collapse:collapse">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; border-spacing:0">
                                            <tbody>
                                            <tr>
                                                <td align="left" style="padding-left: 20px; padding-right: 20px; padding-top:20px; text-align:left; font-family: 'Amazon Ember', Arial, Helvetica, sans-serif; font-size: 15px; line-height: 25px;">
                                                    Hi Shabbir,
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left" style="padding-left: 20px; padding-right: 20px; padding-top:10px; text-align:left; font-family: 'Amazon Ember', Arial, Helvetica, sans-serif; font-size: 15px; line-height: 28px;">
                                                    Your prepaid recharge bill payment was <span style="color:#c45500;"><b>due</b></span> on <span style="color:#c45500;"><b>07 Nov 2026</b></span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left" style="padding-left: 20px; padding-right: 20px; padding-top:10px; text-align:left; font-family: 'Amazon Ember', Arial, Helvetica, sans-serif; font-size: 15px; line-height: 28px; color: #028A0F;">
                                                    Earn ₹75 back on this payment with Amazon Pay UPI.
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-collapse:collapse">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; border-spacing:0">
                                            <tbody>
                                            <tr>
                                                <td align="left" style="padding: 20px; text-align:left; font-family: 'Amazon Ember', Arial, Helvetica, sans-serif;">
                                                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; border-spacing:0">
                                                        <tbody>
                                                        <tr>
                                                            <td align="left" width="50%" style="text-align:left; font-family: 'Amazon Ember', Arial, Helvetica, sans-serif; font-size: 13px; line-height: 25px; color:#767676;">
                                                                Due for
                                                            </td>
                                                            <td align="right" width="50%" style="text-align:right; font-family: 'Amazon Ember', Arial, Helvetica, sans-serif; font-size: 13px; line-height: 25px; color:#767676;">
                                                                Amount
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="left" width="50%">
                                                                <table cellpadding="0" cellspacing="0" border="0">
                                                                    <tr>
                                                                        <td style="vertical-align: middle;">
                                                                            <img src="https://m.media-amazon.com/images/G/31/HFC/PREPAID_RECHARGE/JIO_PRE.gif" height="35" width="35" alt="Jio" style="display:block;" />
                                                                        </td>
                                                                        <td style="padding-left: 8px; text-align: left; vertical-align: middle; font-size: 14px; font-weight: bold;">
                                                                            Jio
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                            <td align="right" width="50%" style="font-size: 24px; font-weight: bold; text-align: right; line-height: 25px; font-family: 'Amazon Ember', Arial, Helvetica, sans-serif; color: #111;">
                                                                ₹ 859
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-collapse: collapse; padding: 0 20px;">
                                        <div style="border-top: 1px solid #e4e4e4; width: 100%;"></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-collapse:collapse">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; border-spacing:0">
                                            <tbody>
                                            <tr>
                                                <td align="left" style="padding: 16px 20px; text-align:left; font-family: 'Amazon Ember', Arial, Helvetica, sans-serif;">
                                                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; border-spacing:0">
                                                        <tbody>
                                                        <tr>
                                                            <td align="left" style="text-align:left; font-family: 'Amazon Ember', Arial, Helvetica, sans-serif; font-size: 13px; line-height: 20px; color: #555;">
                                                                Mobile Number
                                                            </td>
                                                            <td align="right" style="text-align:right; font-family: 'Amazon Ember', Arial, Helvetica, sans-serif; font-size: 13px; line-height: 20px; font-weight:bold; color: #111;">
                                                                9423494252
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-collapse:collapse">
                                        <!-- Primary CTA button -->
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; border-spacing:0">
                                            <tbody>
                                            <tr>
                                                <td align="left" style="padding: 10px 20px 20px 20px; text-align:left; font-family: 'Amazon Ember', Arial, Helvetica, sans-serif;">
                                                    <table cellpadding="0" cellspacing="0" bgcolor="#ffd852" border="0" style="border-spacing:0; border-radius: 6px; text-decoration: none; width: 100%; border: 1px solid #e5c03e; background-color: #ffd852;" width="100%">
                                                        <tbody>
                                                        <tr>
                                                            <td align="center" height="42" style="text-align:center; font-family: 'Amazon Ember', Arial, Helvetica, sans-serif; font-size: 14px; line-height: 42px; color: #222222; font-weight: bold;">
                                                                <a href="https://www.amazon.in/apay/detail/mobile-prepaid?orderId=408-9425097-2491521&authRefId=f752b96b-82ef-48db-b5dc-3416750ea3e7" style="text-decoration: none; color: #222222; text-align: center; display: block; width: 100%; height: 100%; font-weight: bold;" target="_blank">
                                                                    Recharge Now
                                                                </a>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-collapse:collapse; padding: 0 20px 20px 20px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f7f7f7; border-radius: 6px; border: 1px solid #e7e7e7;">
                                            <tbody>
                                            <tr>
                                                <td style="padding: 8px 12px; font-size: 11px; line-height: 18px; color: #555; text-align: center;">
                                                    To unsubscribe from this reminder, please click <a href="https://www.amazon.in/rpe/localunsubscribe" style="color: #0066c0; text-decoration: none;" target="_blank">here</a>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-collapse:collapse; padding: 0 20px 20px 20px; font-family: 'Amazon Ember', Arial, Helvetica, sans-serif; font-size: 11px; line-height: 15px; color: #888; text-align: center;">
                                        This email was sent from an email address that can't receive emails. Please don't reply to this email.
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        </tbody>
    </table>
</div>
</body>
</html>`

const HDFC_LOGO_URI = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='12' fill='%23ffffff'/%3E%3Crect x='8' y='8' width='84' height='84' rx='6' fill='%23004c8f'/%3E%3Crect x='20' y='20' width='60' height='60' fill='%23ffffff'/%3E%3Crect x='36' y='20' width='28' height='60' fill='%23ed232a'/%3E%3Crect x='20' y='36' width='60' height='28' fill='%23ed232a'/%3E%3Crect x='36' y='36' width='28' height='28' fill='%23004c8f'/%3E%3C/svg%3E"

export const initialMockEmails: EmailThread[] = [
  // ── INBOX: PRIMARY ──────────────────────────────────────────────
  {
    id: "msg_01",
    senderName: "HDFC Bank InstaAlerts",
    senderAvatar: HDFC_LOGO_URI,
    isVerified: true,
    threadCount: 2,
    senderEmail: "alerts@hdfcbank.net",
    recipientEmail: "ezzyshabbir05@gmail.com",
    replyToEmail: "alerts@hdfcbank.net",
    subject: "Pixel Credit Card Payment received!",
    snippet: "Dear Customer, We have received payment of INR 15000.00 on your Pixel Play credit card on 08/11/26 10:20. Sincer...",
    body: "Dear Customer,\n\nWe have received payment of INR 507.03 on your Pixel Play credit card on 08/11/26 10:21.",
    timestamp: "10:21",
    fullDate: "8 Nov 2026, 10:21",
    mailedBy: "krxemails.hdfcbank.net",
    signedBy: "hdfcbank.net",
    security: "Standard encryption (TLS)",
    category: "primary",
    folder: "inbox",
    isUnread: true,
    isStarred: false,
    label: "Invoices",
    messages: [
      {
        id: "msg_01_m1",
        senderName: "HDFC Bank InstaAlerts",
        senderAvatar: HDFC_LOGO_URI,
        isVerified: true,
        senderEmail: "alerts@hdfcbank.net",
        recipientEmail: "ezzyshabbir05@gmail.com",
        replyToEmail: "alerts@hdfcbank.net",
        body: "Dear Customer, We have received payment of INR 15000.00 on your Pixel Play credit card on 08/11/26 10:20. Sincerely, Pixel Play Credit Card",
        timestamp: "10:20 (5 hours ago)",
        fullDate: "8 Nov 2026, 10:20",
        mailedBy: "krxemails.hdfcbank.net",
        signedBy: "hdfcbank.net",
        security: "Standard encryption (TLS)",
      },
      {
        id: "msg_01_m2",
        senderName: "HDFC Bank InstaAlerts",
        senderAvatar: HDFC_LOGO_URI,
        isVerified: true,
        senderEmail: "alerts@hdfcbank.net",
        recipientEmail: "ezzyshabbir05@gmail.com",
        replyToEmail: "alerts@hdfcbank.net",
        body: "Dear Customer,\n\nWe have received payment of INR 507.03 on your Pixel Play credit card on 08/11/26 10:21.",
        timestamp: "10:21 (4 hours ago)",
        fullDate: "8 Nov 2026, 10:21",
        mailedBy: "krxemails.hdfcbank.net",
        signedBy: "hdfcbank.net",
        security: "Standard encryption (TLS)",
      },
    ],
  },
  {
    id: "msg_02",
    senderName: "Amazon Pay India",
    senderEmail: "no-reply@amazonpay.in",
    recipientEmail: "ezzyshabbir05@gmail.com",
    replyToEmail: "no-reply@amazonpay.in",
    subject: "Payment Reminder",
    snippet: "Hi Shabbir, Your prepaid recharge bill payment was due on 07 Nov 2026. Earn ₹75 back on this payment with Amazon Pay UPI.",
    body: `Hi Shabbir,\n\nYour prepaid recharge bill payment was due on 07 Nov 2026.\nEarn ₹75 back on this payment with Amazon Pay UPI.\n\nDue for Jio: ₹ 859\nMobile Number: 9423494252`,
    htmlBody: amazonPayHtml,
    timestamp: "4:35 AM",
    fullDate: "Sun, 8 Nov 2026, 04:35:35 GMT",
    category: "primary",
    folder: "inbox",
    isUnread: true,
    isStarred: false,
    label: "Invoices",
    mailedBy: "ap-south-1.amazonses.com",
    signedBy: "amazonpay.in",
    security: "Standard encryption (TLS)",
    messages: [
      {
        id: "msg_02_m1",
        senderName: "Amazon Pay India",
        senderEmail: "no-reply@amazonpay.in",
        recipientEmail: "ezzyshabbir05@gmail.com",
        replyToEmail: "no-reply@amazonpay.in",
        body: `Hi Shabbir,\n\nYour prepaid recharge bill payment was due on 07 Nov 2026.\nEarn ₹75 back on this payment with Amazon Pay UPI.\n\nDue for Jio: ₹ 859\nMobile Number: 9423494252`,
        htmlBody: amazonPayHtml,
        timestamp: "4:35 AM",
        fullDate: "Sun, 8 Nov 2026, 04:35:35 GMT",
        mailedBy: "ap-south-1.amazonses.com",
        signedBy: "amazonpay.in",
        security: "Standard encryption (TLS)",
      },
    ],
  },
  {
    id: "msg_03",
    senderName: "bankalerts",
    threadCount: 2,
    senderEmail: "alerts@bankalerts.com",
    recipientEmail: "alex@enterprise.corp",
    subject: "IMPS Credit Transaction",
    snippet: "Dear SHABBIR EZZY We wish to inform you that your account xx4487 is credited by Rs. 15000.00 on 08-Nov-2026 for IMPS trans...",
    body: `Dear SHABBIR EZZY,\n\nWe wish to inform you that your account xx4487 is credited by Rs. 15,000.00 on 08-Nov-2026 for IMPS transaction ref #431289412.\n\nAvailable Balance: Rs. 84,250.00.\n\nThank you for choosing our banking services.`,
    timestamp: "10:04",
    fullDate: "Nov 8, 2026, 10:04 AM",
    category: "primary",
    folder: "inbox",
    isUnread: true,
    isStarred: false,
  },
  {
    id: "msg_04",
    senderName: "HDFC Bank InstaAler.",
    threadCount: 2,
    senderEmail: "instaalerts@hdfcbank.net",
    recipientEmail: "alex@enterprise.corp",
    subject: "Rs.15000.00 debited via Debit Card **4555",
    snippet: "Dear Customer, Greetings from HDFC Bank! Rs.15000.00 is debited from your HDFC Bank Debit Card ending...",
    body: `Dear Customer,\n\nGreetings from HDFC Bank!\n\nRs. 15,000.00 is debited from your HDFC Bank Debit Card ending **4555 towards online payment at POSTARC ENTERPRISE.\n\nAvailable Balance: Rs. 69,250.00.\n\nWarm regards,\nHDFC Bank InstaAlerts`,
    timestamp: "10:04",
    fullDate: "Nov 8, 2026, 10:04 AM",
    category: "primary",
    folder: "inbox",
    isUnread: true,
    isStarred: false,
  },
  {
    id: "msg_primary_10",
    senderName: "Sarah Jenkins",
    threadCount: 3,
    senderEmail: "sjenkins@acmecorp.com",
    recipientEmail: "alex@enterprise.corp",
    subject: "Updated Master Services Agreement & SOW for Q1 2027",
    snippet: "Hi Alex, Legal finished reviewing the clause regarding data sovereignty and Postarc encryption standards. Attached is the revised MSA...",
    body: `Hi Alex,\n\nOur legal and compliance team has completed their review of the enterprise partnership agreement.\n\nWe were particularly impressed by Postarc's zero-knowledge admin architecture and SOC2 compliance guarantee. We've countersigned the updated Statement of Work (SOW) covering 250 enterprise mailbox seats beginning January 2027.\n\nPlease find the signed PDF agreement attached for your records.\n\nBest regards,\nSarah Jenkins\nDirector of Global Procurement | Acme Corp`,
    timestamp: "9:42 AM",
    fullDate: "Nov 8, 2026, 9:42 AM",
    category: "primary",
    folder: "inbox",
    isUnread: true,
    isStarred: true,
    label: "Clients",
    attachments: [
      {
        id: "att_msa_acme",
        name: "Acme_Master_Services_Agreement_2027.pdf",
        size: "2.1 MB",
        type: "pdf",
      },
    ],
    messages: [
      {
        id: "msg_acme_1",
        senderName: "Sarah Jenkins",
        senderEmail: "sjenkins@acmecorp.com",
        recipientEmail: "alex@enterprise.corp",
        replyToEmail: "sjenkins@acmecorp.com",
        body: "Hi Alex,\n\nWe're eager to formalize our partnership for Q1 2027. Ahead of our contract sign-off, could you please confirm Postarc's data sovereignty protocols and encryption at rest standards?",
        timestamp: "Nov 5",
        fullDate: "Nov 5, 2026, 11:20 AM",
        isStarred: true,
      },
      {
        id: "msg_acme_2",
        senderName: "Alex Rivera",
        senderEmail: "alex@enterprise.corp",
        recipientEmail: "sjenkins@acmecorp.com",
        replyToEmail: "alex@enterprise.corp",
        body: "Hi Sarah,\n\nAbsolutely. Postarc uses AES-256 envelope encryption at rest with tenant-isolated KMS keyrings. Administrators have zero backdoor to inspect mailbox contents, and all credential resets are permanently logged in tamper-proof SOC2 audit trails.",
        timestamp: "Nov 6",
        fullDate: "Nov 6, 2026, 2:15 PM",
        isStarred: true,
        isFromMe: true,
      },
      {
        id: "msg_acme_3",
        senderName: "Sarah Jenkins",
        senderEmail: "sjenkins@acmecorp.com",
        recipientEmail: "alex@enterprise.corp",
        replyToEmail: "sjenkins@acmecorp.com",
        body: "Hi Alex,\n\nOur legal and compliance team has completed their review of the enterprise partnership agreement.\n\nWe were particularly impressed by Postarc's zero-knowledge admin architecture and SOC2 compliance guarantee. We've countersigned the updated Statement of Work (SOW) covering 250 enterprise mailbox seats beginning January 2027.\n\nPlease find the signed PDF agreement attached for your records.\n\nBest regards,\nSarah Jenkins\nDirector of Global Procurement | Acme Corp",
        timestamp: "9:42 AM",
        fullDate: "Nov 8, 2026, 9:42 AM",
        isStarred: true,
        attachments: [
          {
            id: "att_msa_acme",
            name: "Acme_Master_Services_Agreement_2027.pdf",
            size: "2.1 MB",
            type: "pdf",
          },
        ],
      },
    ],
  },
  {
    id: "msg_primary_11",
    senderName: "David Miller",
    senderEmail: "david@enterprise.corp",
    recipientEmail: "alex@enterprise.corp",
    subject: "Executive Team Offsite Agenda - Napa Valley (Nov 15-18)",
    snippet: "Team, please review the finalized itinerary and break-out session topics for next week's executive strategic offsite...",
    body: `Team,\n\nHere is the finalized agenda for our upcoming strategic retreat in Napa Valley from November 15 to 18.\n\nKey Session Focus Areas:\n1. 2027 Revenue targets and enterprise pipeline velocity\n2. Postarc custom domain integration roadmap & IMAP/SMTP gateway expansion\n3. Storage pool unit economics and self-service quota controls\n\nPlease review the attached slide deck and schedule ahead of our departure Monday morning.\n\nBest,\nDavid Miller\nVP of Operations`,
    timestamp: "8:30 AM",
    fullDate: "Nov 8, 2026, 8:30 AM",
    category: "primary",
    folder: "inbox",
    isUnread: false,
    isStarred: false,
    label: "Work",
    attachments: [
      {
        id: "att_offsite_pdf",
        name: "Executive_Offsite_Agenda_2026.pdf",
        size: "3.4 MB",
        type: "pdf",
      },
    ],
  },
  {
    id: "msg_hdfc_statement",
    senderName: "HDFC Bank",
    senderEmail: "statements@hdfcbank.net",
    recipientEmail: "alex@enterprise.corp",
    subject: "Your HDFC Bank Pixel Play Credit Card Statement for Oct 2026",
    snippet: "Your Pixel Play Credit Card E-Statement generated Dear Customer, Please find attached your monthly statement...",
    body: `Dear Customer,\n\nPlease find attached your HDFC Bank Pixel Play Credit Card Statement for October 2026.\n\nTotal Due: INR 15,000.00\nPayment Due Date: 24 Nov 2026\n\nTo view your password-protected PDF e-statement, use your 4-digit date of birth followed by the last 4 digits of your card.\n\nWarm regards,\nHDFC Bank Credit Cards`,
    timestamp: "4 Nov",
    fullDate: "Nov 4, 2026, 6:30 PM",
    category: "primary",
    folder: "inbox",
    isUnread: true,
    isStarred: false,
    label: "Invoices",
    attachments: [
      {
        id: "att_hdfc_statement",
        name: "HDFC Bank Pixel Play Statement.pdf",
        size: "485 KB",
        type: "pdf",
      },
    ],
  },
  {
    id: "msg_05",
    senderName: "Kotak811",
    senderEmail: "service@kotak811.com",
    recipientEmail: "alex@enterprise.corp",
    subject: "Payment of INR 15000.00 successful",
    snippet: "If you are unable to view the below e-mailer, please click here. Dear customer, You have successfully made a UPI paym...",
    body: `Dear customer,\n\nYou have successfully made a UPI payment of INR 15,000.00 to merchant ID postarc@icici.\n\nUPI Ref: 489201938201.\n\nKotak Mahindra Bank.`,
    timestamp: "10:03",
    fullDate: "Nov 8, 2026, 10:03 AM",
    category: "primary",
    folder: "inbox",
    isUnread: false,
    isStarred: false,
  },
  {
    id: "msg_primary_12",
    senderName: "Priya Sharma",
    senderEmail: "priya@enterprise.corp",
    recipientEmail: "alex@enterprise.corp",
    subject: "Q3 Financial Audit Sign-off & Expense Reports Reconciliation",
    snippet: "Alex, all departmental expense receipts have been matched against our monthly pool charges and credit line. Please verify...",
    body: `Hi Alex,\n\nThe finance team has concluded reconciliation for Q3 operating expenses.\n\nAll SaaS subscriptions, email infrastructure hosting invoices, and domain registration expenses have been balanced against general ledger accounts. Take a look at the attached Excel sheet for any adjustments before we submit to external auditors on Friday.\n\nThanks,\nPriya Sharma\nFinance Lead`,
    timestamp: "Nov 6",
    fullDate: "Nov 6, 2026, 4:10 PM",
    category: "primary",
    folder: "inbox",
    isUnread: false,
    isStarred: false,
    label: "Invoices",
    attachments: [
      {
        id: "att_q3_expenses",
        name: "Q3_Expense_Reconciliation.xlsx",
        size: "820 KB",
        type: "spreadsheet",
      },
    ],
  },
  {
    id: "msg_primary_13",
    senderName: "Marcus Vance",
    threadCount: 2,
    senderEmail: "marcus@enterprise.corp",
    recipientEmail: "alex@enterprise.corp",
    subject: "Review of Postarc Enterprise Mailbox Deployment",
    snippet: "The marketing and sales team successfully transitioned to Postarc webmail this morning. Everything synced flawlessly...",
    body: `Hey Alex,\n\nJust wanted to report that our entire team moved over to Postarc today. The onboarding flow was painless—setting up App Passwords for Apple Mail on iPhones took less than a minute.\n\nAlso, the catch-all address support has already prevented several customer bounce-backs after a typo in our latest campaign.\n\nKudos on a great rollout!\n\nMarcus Vance\nHead of Growth | Enterprise Corp`,
    timestamp: "Nov 5",
    fullDate: "Nov 5, 2026, 2:15 PM",
    category: "primary",
    folder: "inbox",
    isUnread: false,
    isStarred: true,
    label: "Work",
    messages: [
      {
        id: "msg_marcus_1",
        senderName: "Alex Rivera",
        senderEmail: "alex@enterprise.corp",
        recipientEmail: "marcus@enterprise.corp",
        body: "Hey Marcus,\n\nWe're migrating the marketing distribution groups (press@ and sales@) to Postarc this morning. Let me know once your team sets up their app passwords on mobile.",
        timestamp: "Nov 5",
        fullDate: "Nov 5, 2026, 10:00 AM",
        isFromMe: true,
      },
      {
        id: "msg_marcus_2",
        senderName: "Marcus Vance",
        senderEmail: "marcus@enterprise.corp",
        recipientEmail: "alex@enterprise.corp",
        body: `Hey Alex,\n\nJust wanted to report that our entire team moved over to Postarc today. The onboarding flow was painless—setting up App Passwords for Apple Mail on iPhones took less than a minute.\n\nAlso, the catch-all address support has already prevented several customer bounce-backs after a typo in our latest campaign.\n\nKudos on a great rollout!\n\nMarcus Vance\nHead of Growth | Enterprise Corp`,
        timestamp: "Nov 5",
        fullDate: "Nov 5, 2026, 2:15 PM",
      },
    ],
  },
  {
    id: "msg_primary_14",
    senderName: "Julian Rossi",
    senderEmail: "jrossi@apexcap.com",
    recipientEmail: "alex@enterprise.corp",
    subject: "Series B Term Sheet Discussion Follow-up & Due Diligence Room",
    snippet: "Alex, great speaking with you and the founders yesterday. We have populated the diligence data room checklist...",
    body: `Hi Alex,\n\nThank you for the thorough walkthrough of Enterprise Corp's unit economics and tech stack yesterday. Our investment committee was very impressed with your low infrastructure overhead and custom mailbox margins.\n\nWe have set up the virtual data room and look forward to reviewing the historical financial model and IP assignments.\n\nBest,\nJulian Rossi\nPartner | Apex Capital Partners`,
    timestamp: "Nov 3",
    fullDate: "Nov 3, 2026, 11:30 AM",
    category: "primary",
    folder: "inbox",
    isUnread: false,
    isStarred: true,
    label: "Clients",
  },
  {
    id: "msg_06",
    senderName: "HDFC Bank InstaAler.",
    senderEmail: "instaalerts@hdfcbank.net",
    recipientEmail: "alex@enterprise.corp",
    subject: "View: Account update for your HDFC Bank A/c",
    snippet: "Dear Customer, Greetings from HDFC Bank! We're writing to inform you that Rs.15000.00 has been succe...",
    body: `Dear Customer,\n\nGreetings from HDFC Bank! We're writing to inform you that your monthly e-statement for October 2026 has been generated.\n\nPlease find your password-protected PDF e-statement attached.`,
    timestamp: "10:03",
    fullDate: "Nov 8, 2026, 10:03 AM",
    category: "primary",
    folder: "inbox",
    isUnread: true,
    isStarred: false,
    attachments: [
      {
        id: "att_01",
        name: "e-statement_oct2026.pdf",
        size: "420 KB",
        type: "pdf",
      },
      {
        id: "att_01_dat",
        name: "statement_checksum.dat",
        size: "4 KB",
        type: "binary",
      },
    ],
  },

  // ── INBOX: PROMOTIONS ───────────────────────────────────────────
  {
    id: "msg_promo_01",
    senderName: "Figma Team",
    senderEmail: "news@figma.com",
    recipientEmail: "alex@enterprise.corp",
    subject: "Introducing FigJam AI: Brainstorm, diagram, and summarize faster",
    snippet: "Turn sticky notes into action items, generate timeline templates, and synthesize brainstorming sessions in seconds...",
    body: `Hey Alex,\n\nWe're thrilled to introduce FigJam AI—a suite of generative AI tools built directly into FigJam.\n\nWith FigJam AI, you can:\n- Convert raw meeting brainstorms into prioritized action lists\n- Generate flowchart and system architecture diagrams with natural language prompts\n- Automatically summarize workshop sticky notes for stakeholders\n\nTry it free in your Enterprise Corp workspace today.\n\nThe Figma Team`,
    timestamp: "Nov 8",
    fullDate: "Nov 8, 2026, 7:15 AM",
    category: "promotions",
    folder: "inbox",
    isUnread: true,
    isStarred: false,
  },
  {
    id: "msg_promo_02",
    senderName: "Linear",
    senderEmail: "product@linear.app",
    recipientEmail: "alex@enterprise.corp",
    subject: "Linear Asks is here: Turn workplace requests into actionable issues",
    snippet: "Bridge the gap between Slack, email, and engineering tickets. Capture requests without context switching...",
    body: `Hi Alex,\n\nCross-functional collaboration just got easier. Introducing Linear Asks.\n\nNow, your support reps, account managers, and internal teams can submit requests directly from Slack or webhooks, and your engineering team can triage them without leaving their sprint board.\n\nExplore Linear Asks in your workspace settings.\n\nBuilt for high-performance software teams,\nLinear`,
    timestamp: "Nov 7",
    fullDate: "Nov 7, 2026, 4:20 PM",
    category: "promotions",
    folder: "inbox",
    isUnread: false,
    isStarred: false,
  },
  {
    id: "msg_08",
    senderName: "Paisabazaar",
    senderEmail: "offers@paisabazaar.com",
    recipientEmail: "alex@enterprise.corp",
    subject: "Your next credit card starts with a comparison",
    snippet: "Follow us on: Download our App: Google Play App Store CIN No. U74900HR2011PTC044581 © Copyright 2...",
    body: `Dear Shabbir,\n\nCompare lifetime-free credit cards tailored to your credit score (790+).\n\nEnjoy airport lounge access, 5% cashback on dining, and zero annual fees.\n\nApply in 2 minutes with no physical paperwork.`,
    timestamp: "7 Nov",
    fullDate: "Nov 7, 2026, 3:45 PM",
    category: "promotions",
    folder: "inbox",
    isUnread: true,
    isStarred: false,
  },
  {
    id: "msg_promo_03",
    senderName: "Vercel",
    senderEmail: "updates@vercel.com",
    recipientEmail: "alex@enterprise.corp",
    subject: "Next.js Conf 2026 Keynote Recap & Turbopack 2.0 Benchmarks",
    snippet: "Watch the full keynote on demand: Next.js 16 with Partial Prerendering, Turbopack for production, and AI SDK 4.0...",
    body: `Hi Alex,\n\nMissed Next.js Conf yesterday? Catch up on the biggest announcements:\n\n1. Turbopack in Production: 5x faster cold builds and 10x faster HMR than Webpack.\n2. Partial Prerendering (PPR): Instant static shells with streaming dynamic holes.\n3. Server Actions 2.0: Optimistic mutations with progressive enhancement out of the box.\n\nWatch the recordings and check out the starter templates now.\n\nThe Vercel Team`,
    timestamp: "Nov 6",
    fullDate: "Nov 6, 2026, 1:10 PM",
    category: "promotions",
    folder: "inbox",
    isUnread: false,
    isStarred: false,
  },
  {
    id: "msg_promo_04",
    senderName: "JetBlue Airways",
    senderEmail: "deals@jetblue.com",
    recipientEmail: "alex@enterprise.corp",
    subject: "Fall Getaways: Nonstop coast-to-coast flights from $99",
    snippet: "Pack your bags! Book by Thursday for exclusive travel discounts through January 2027...",
    body: `Hey Alex,\n\nAutumn travel is calling! Book by Thursday 11:59 PM to save big on nonstop flights across North America.\n\nPopular routes:\n- San Francisco (SFO) to New York (JFK) from $99\n- Boston (BOS) to Austin (AUS) from $79\n- Seattle (SEA) to Fort Lauderdale (FLL) from $119\n\nEnjoy free high-speed Fly-Fi, extra legroom, and complimentary snacks on every flight.\n\nJetBlue Airways`,
    timestamp: "Nov 5",
    fullDate: "Nov 5, 2026, 10:00 AM",
    category: "promotions",
    folder: "inbox",
    isUnread: false,
    isStarred: false,
  },

  // ── INBOX: SOCIAL ───────────────────────────────────────────────
  {
    id: "msg_social_01",
    senderName: "GitHub Notifications",
    senderEmail: "notifications@github.com",
    recipientEmail: "alex@enterprise.corp",
    subject: "[postarc/core] Pull request #142: feat(auth): add TOTP 2FA verification",
    snippet: "@dev-elena requested your review on PR #142: 'Implement RFC 6238 TOTP algorithm with QR provisioning'...",
    body: `Hey @alex-rivera,\n\n@dev-elena has requested your review on postarc/core#142.\n\nPR Title: feat(auth): add TOTP 2FA verification and backup recovery codes\n\nChanges Summary:\n- Added standard HMAC-SHA1 TOTP token verification with +/- 1 drift window.\n- Implemented AES-256 encrypted storage for user TOTP secret keys.\n- Added recovery codes generation during setup modal.\n\nView diff and approve: https://github.com/postarc/core/pull/142`,
    timestamp: "9:15 AM",
    fullDate: "Nov 8, 2026, 9:15 AM",
    category: "social",
    folder: "inbox",
    isUnread: true,
    isStarred: true,
    label: "Work",
  },
  {
    id: "msg_social_02",
    senderName: "LinkedIn",
    senderEmail: "updates@linkedin.com",
    recipientEmail: "alex@enterprise.corp",
    subject: "Liam Chen and 3 other connections have new job updates",
    snippet: "Congratulate Liam Chen on starting as VP of Engineering at ScaleCloud Inc. See other network updates...",
    body: `Hi Alex,\n\nHere is your weekly network digest:\n\n- Liam Chen started a new position as VP of Engineering at ScaleCloud Inc.\n- Clara Oswald published a new article: "Building Zero-Trust Corporate Email on Modern Web Protocols"\n- Marcus Vance endorsed you for "Cloud Architecture" and "Enterprise Security"\n\nStay connected with your professional network today.`,
    timestamp: "Nov 8",
    fullDate: "Nov 8, 2026, 6:00 AM",
    category: "social",
    folder: "inbox",
    isUnread: false,
    isStarred: false,
  },
  {
    id: "msg_07",
    senderName: "Snapchat",
    senderEmail: "team@snapchat.com",
    recipientEmail: "alex@enterprise.corp",
    subject: "Shabbir, remember this?",
    snippet: "On 4 November 2022...",
    body: `Hey Shabbir,\n\nTake a look back at your Memories from 4 November 2022!\n\nOpen Snapchat to view your saved Snaps and share them with your friends.`,
    timestamp: "7 Nov",
    fullDate: "Nov 7, 2026, 8:15 PM",
    category: "social",
    folder: "inbox",
    isUnread: false,
    isStarred: false,
    label: "Personal",
  },
  {
    id: "msg_social_03",
    senderName: "Slack Daily Digest",
    senderEmail: "digest@slack.com",
    recipientEmail: "alex@enterprise.corp",
    subject: "Enterprise Corp Slack: 14 unread mentions in #architecture and #general",
    snippet: "Elena: 'Let's confirm the IMAP port 993 SSL certificates before the customer demo at 2 PM'...",
    body: `Hi Alex,\n\nHere are the top unread conversations from your Enterprise Corp Slack workspace:\n\n#architecture:\n- Elena Rostova: "@alex Let's confirm the IMAP port 993 SSL certificates before the customer demo at 2 PM"\n- Jordan Lee: "All DNS propagations look rock solid on Route 53"\n\n#announcements:\n- David Miller: "Reminder: All hands meeting tomorrow at 10 AM PST in Main Hall"\n\nOpen Slack to reply to your team.`,
    timestamp: "Nov 7",
    fullDate: "Nov 7, 2026, 5:30 PM",
    category: "social",
    folder: "inbox",
    isUnread: true,
    isStarred: false,
  },
  {
    id: "msg_social_04",
    senderName: "Discord Community",
    senderEmail: "notifications@discord.com",
    recipientEmail: "alex@enterprise.corp",
    subject: "Open Source Email Protocol Working Group: Monthly Town Hall Today",
    snippet: "Join us in the voice channel at 18:00 UTC for discussions on JMAP protocol adoption and modern SMTP safety...",
    body: `Hey everyone,\n\nOur monthly Open Source Email Working Group town hall is kicking off today at 18:00 UTC in the #stage channel.\n\nTopics:\n1. JMAP RFC updates and real-time push synchronization\n2. DMARC reporting automation and SPF record compression techniques\n3. Q&A with mail server engineers from Postarc and Fastmail\n\nSee you there!`,
    timestamp: "Nov 5",
    fullDate: "Nov 5, 2026, 12:00 PM",
    category: "social",
    folder: "inbox",
    isUnread: false,
    isStarred: false,
  },

  // ── INBOX: UPDATES ──────────────────────────────────────────────
  {
    id: "msg_update_01",
    senderName: "Stripe Billing",
    senderEmail: "invoices@stripe.com",
    recipientEmail: "alex@enterprise.corp",
    subject: "Invoice #INV-2026-1108 for Enterprise Corp ($1,250.00)",
    snippet: "Your receipt for Postarc Enterprise Pool Plan (100 GB Pool + 10 Seats). Paid successfully via Amex ending in 1004...",
    body: `Hello Alex Rivera,\n\nThank you for your payment of $1,250.00 to Postarc Inc for your monthly subscription.\n\nInvoice Summary:\n- Invoice ID: INV-2026-1108\n- Plan: Postarc Enterprise Pool (100 GB Pooled Storage, 10 Mailbox Seats)\n- Add-on: Custom Domain DKIM/SPF Automated Probing\n- Payment Method: American Express ending in 1004\n\nPlease find your official PDF tax invoice attached.\n\nThanks,\nThe Stripe Team`,
    timestamp: "10:15 AM",
    fullDate: "Nov 8, 2026, 10:15 AM",
    category: "updates",
    folder: "inbox",
    isUnread: true,
    isStarred: false,
    label: "Invoices",
    attachments: [
      {
        id: "att_stripe_inv",
        name: "Stripe_Invoice_INV-2026-1108.pdf",
        size: "185 KB",
        type: "pdf",
      },
    ],
  },
  {
    id: "msg_update_02",
    senderName: "AWS CloudWatch",
    senderEmail: "no-reply@amazon.com",
    recipientEmail: "alex@enterprise.corp",
    subject: "ALARM: 'Postarc-S3-StoragePool-80Percent' in US-East (N. Virginia)",
    snippet: "You are receiving this email because your Amazon CloudWatch Alarm 'Postarc-S3-StoragePool-80Percent' transitioned to ALARM...",
    body: `Alarm Details:\n- Name: Postarc-S3-StoragePool-80Percent\n- Description: Triggers when pooled email blob storage exceeds 80 GB of 100 GB pool\n- State Change: OK -> ALARM\n- Reason: Threshold Crossed: 1 datapoint [82.4 GB] was greater than the threshold (80.0 GB)\n- Timestamp: Saturday 08 November, 2026 09:30:00 UTC\n\nAction: Please review user quotas on the Postarc Company Admin Console (/admin/storage).`,
    timestamp: "9:31 AM",
    fullDate: "Nov 8, 2026, 9:31 AM",
    category: "updates",
    folder: "inbox",
    isUnread: true,
    isStarred: true,
    label: "Work",
  },
  {
    id: "msg_09",
    senderName: "Elena Rostova",
    senderEmail: "elena@enterprise.corp",
    recipientEmail: "alex@enterprise.corp",
    subject: "Q4 Deliverability & Domain MX Validation Report",
    snippet: "Jordan confirmed that SPF, DKIM, and DMARC quarantine policies are 100% active on Cloudflare DNS. Review the attached report...",
    body: `Hi Alex,\n\nI have finished auditing our email deliverability benchmarks for Q4 across enterprise.corp.\n\nKey Highlights:\n- Inbound MX records are resolving with 0ms latency through mail.postarc.com.\n- SPF and DKIM pass rate is at 99.8% across Gmail and Outlook receiving filters.\n- DMARC quarantine policy is successfully stopping unauthorized spoofing attempts.\n\nPlease find the full deliverability breakdown attached.\n\nBest,\nElena Rostova\nVP of Technology | Enterprise Corp`,
    timestamp: "6 Nov",
    fullDate: "Nov 6, 2026, 9:15 AM",
    category: "updates",
    folder: "inbox",
    isUnread: false,
    isStarred: true,
    label: "Work",
    attachments: [
      {
        id: "att_02",
        name: "deliverability_report_q4.pdf",
        size: "1.4 MB",
        type: "pdf",
      },
      {
        id: "att_03",
        name: "q4_metrics_export.xlsx",
        size: "620 KB",
        type: "spreadsheet",
      },
    ],
  },
  {
    id: "msg_update_03",
    senderName: "Jira Software",
    senderEmail: "jira@enterprise.atlassian.net",
    recipientEmail: "alex@enterprise.corp",
    subject: "[SEC-204] Resolved: Enforce TOTP 2FA requirement on all company accounts",
    snippet: "Jordan Lee resolved SEC-204 as Fixed: 'Company-wide TOTP policy enforcement activated on Postarc Admin Console'...",
    body: `Issue: SEC-204 (Enforce TOTP 2FA requirement on all enterprise company accounts)\nStatus: Closed (Resolved)\nAssignee: Jordan Lee\nReporter: Alex Rivera\n\nResolution Notes:\nAll 6 employee mailboxes have successfully paired authenticator apps. Zero-trust login requirement verified with automated end-to-end tests.\n\nView Issue: https://enterprise.atlassian.net/browse/SEC-204`,
    timestamp: "Nov 4",
    fullDate: "Nov 4, 2026, 3:20 PM",
    category: "updates",
    folder: "inbox",
    isUnread: false,
    isStarred: false,
    label: "Work",
  },
  {
    id: "msg_update_04",
    senderName: "Cloudflare Status",
    senderEmail: "notifications@cloudflare.com",
    recipientEmail: "alex@enterprise.corp",
    subject: "[Resolved] DNSSEC Key Roll & Global Edge Propagation Completed",
    snippet: "The scheduled DNSSEC KSK rollover for enterprise.corp completed with zero dropped queries. Edge zones are healthy...",
    body: `Cloudflare Maintenance Resolution Notice:\n\nDomain: enterprise.corp\nOperation: Automated DNSSEC Key Signing Key (KSK) Rollover\nStatus: Successfully Completed\n\nAll global recursive resolvers (Google 8.8.8.8, Cloudflare 1.1.1.1, Quad9) have refreshed public DS records. Email delivery and SMTP handshakes remained unaffected throughout the transition window.`,
    timestamp: "Nov 2",
    fullDate: "Nov 2, 2026, 1:45 PM",
    category: "updates",
    folder: "inbox",
    isUnread: false,
    isStarred: false,
  },

  // ── SENT ────────────────────────────────────────────────────────
  {
    id: "msg_sent_01",
    senderName: "Alex Rivera",
    senderEmail: "alex@enterprise.corp",
    recipientEmail: "sjenkins@acmecorp.com",
    subject: "Re: Updated Master Services Agreement & SOW for Q1 2027",
    snippet: "Hi Sarah, Thank you for sending over the signed agreement. We have countersigned and forwarded a copy to our finance team...",
    body: `Hi Sarah,\n\nThank you for sending over the signed agreement. We have countersigned and forwarded a copy to our finance team to provision your dedicated instance.\n\nOur onboarding lead will reach out next Tuesday to schedule domain DNS verification and employee mailbox import.\n\nWarm regards,\nAlex Rivera\nSenior Operations Lead | Enterprise Corp`,
    timestamp: "10:10 AM",
    fullDate: "Nov 8, 2026, 10:10 AM",
    category: "primary",
    folder: "sent",
    isUnread: false,
    isStarred: false,
    label: "Clients",
    attachments: [
      {
        id: "att_sent_msa",
        name: "Acme_SOW_Countersigned.pdf",
        size: "2.3 MB",
        type: "pdf",
      },
    ],
  },
  {
    id: "msg_sent_02",
    senderName: "Alex Rivera",
    senderEmail: "alex@enterprise.corp",
    recipientEmail: "david@enterprise.corp",
    subject: "Re: Executive Team Offsite Agenda - Napa Valley (Nov 15-18)",
    snippet: "David, the agenda looks comprehensive. I've added a 30-minute block on Day 2 to demo Postarc's automated storage allocation...",
    body: `Hi David,\n\nThe agenda looks comprehensive. I've added a 30-minute block on Day 2 to demo Postarc's automated storage allocation and the new catch-all address routing features.\n\nFlight tickets and ground transportation have been booked for the team.\n\nBest,\nAlex`,
    timestamp: "Nov 7",
    fullDate: "Nov 7, 2026, 4:45 PM",
    category: "primary",
    folder: "sent",
    isUnread: false,
    isStarred: false,
    label: "Work",
  },
  {
    id: "msg_sent_03",
    senderName: "Alex Rivera",
    senderEmail: "alex@enterprise.corp",
    recipientEmail: "priya@enterprise.corp",
    subject: "Approved: Q3 Hardware & Cloud Infrastructure Reconciliations",
    snippet: "Priya, I reviewed the Q3 expense breakdown sheet. All entries have been approved and reconciled against credit line...",
    body: `Hi Priya,\n\nI reviewed the attached Q3 expense breakdown. All entries have been approved and reconciled against our operating credit facility.\n\nYou have the green light to proceed with the external auditor filing.\n\nThanks,\nAlex`,
    timestamp: "Nov 6",
    fullDate: "Nov 6, 2026, 5:20 PM",
    category: "primary",
    folder: "sent",
    isUnread: false,
    isStarred: false,
    label: "Invoices",
  },

  // ── DRAFTS ──────────────────────────────────────────────────────
  {
    id: "msg_draft_01",
    senderName: "Alex Rivera",
    senderEmail: "alex@enterprise.corp",
    recipientEmail: "board@enterprise.corp",
    subject: "Q4 Board Briefing: Mail Infrastructure Stability & Margin Expansion",
    snippet: "Members of the Board, Ahead of our quarterly meeting on Nov 20, please find a draft summary of our operations...",
    body: `Members of the Board,\n\nAhead of our quarterly meeting on November 20, here is our preliminary summary of operational achievements and cost efficiencies for Q4:\n\n1. Enterprise Mail Migration: Zero downtime migration of 6 core departments to Postarc.\n2. Infrastructure Cost Reduction: 42% reduction in per-seat email software licensing fees.\n3. Security & Compliance: Full SOC2 Type II audit trail compliance and automated 2FA enforcement.\n\n[Draft ongoing - will attach finalized financials before sending Thursday]`,
    timestamp: "Yesterday",
    fullDate: "Nov 7, 2026, 6:15 PM",
    category: "primary",
    folder: "drafts",
    isUnread: false,
    isStarred: false,
    label: "Work",
  },
  {
    id: "msg_draft_02",
    senderName: "Alex Rivera",
    senderEmail: "alex@enterprise.corp",
    recipientEmail: "legal@enterprise.corp",
    subject: "Draft Policy: Employee Mailbox Privacy & Data Retention Guidelines",
    snippet: "Team, please review the revised internal policy draft prohibiting administrative inspection of employee inbox contents...",
    body: `Hi Legal Team,\n\nAttached is the revised draft of our Employee Privacy & Electronic Communications Policy.\n\nCore Principles:\n- Administrators have zero backdoor to inspect or search employee inboxes without a signed legal subpoena.\n- All credential resets trigger non-repudiable entries in the immutable security audit log.\n- Employees leaving the organization are granted a 14-day archival export window.\n\nPlease provide feedback by Monday.`,
    timestamp: "Nov 4",
    fullDate: "Nov 4, 2026, 2:00 PM",
    category: "primary",
    folder: "drafts",
    isUnread: false,
    isStarred: false,
  },

  // ── ARCHIVE ─────────────────────────────────────────────────────
  {
    id: "msg_archive_01",
    senderName: "Google Cloud Platform",
    senderEmail: "gcp-support@google.com",
    recipientEmail: "alex@enterprise.corp",
    subject: "Completed: Cloud KMS Keyring Rotation for project 'postarc-prod-01'",
    snippet: "Your Google Cloud Platform security keys have been rotated successfully with zero cryptographic downtime...",
    body: `Dear Google Cloud Customer,\n\nThis is an automated confirmation that Cloud KMS Keyring Rotation for project 'postarc-prod-01' has finished.\n\nAll existing ciphertexts remain decryptable via key version history, and new envelope encryptions will utilize Key Version 4.\n\nGoogle Cloud Security Team`,
    timestamp: "Oct 28",
    fullDate: "Oct 28, 2026, 3:00 AM",
    category: "updates",
    folder: "archive",
    isUnread: false,
    isStarred: false,
  },
  {
    id: "msg_archive_02",
    senderName: "DocuSign System",
    senderEmail: "dse@docusign.net",
    recipientEmail: "alex@enterprise.corp",
    subject: "Completed: Commercial Office Lease Amendment 2026-2029",
    snippet: "All parties have completed signing 'Commercial Office Lease Amendment 2026-2029'. Download your completed document...",
    body: `Your document has been completed by all parties.\n\nDocument: Commercial Office Lease Amendment 2026-2029\nParties: Enterprise Corp & Transbay Property Management LLC\nCertificate of Completion Attached.`,
    timestamp: "Oct 15",
    fullDate: "Oct 15, 2026, 11:20 AM",
    category: "primary",
    folder: "archive",
    isUnread: false,
    isStarred: false,
    label: "Work",
    attachments: [
      {
        id: "att_lease_doc",
        name: "Office_Lease_Amendment_Executed.pdf",
        size: "4.8 MB",
        type: "pdf",
      },
    ],
  },

  // ── SPAM ────────────────────────────────────────────────────────
  {
    id: "msg_spam_01",
    senderName: "Global Wealth Syndicate",
    senderEmail: "rewards@crypto-wealth-daily.xyz",
    recipientEmail: "alex@enterprise.corp",
    subject: "URGENT: Claim your $5,000 USDT allocation before network hard fork",
    snippet: "You have been selected to receive 5000 USDT in decentralized liquidity mining tokens. Click here to connect your wallet...",
    body: `Congratulations!\n\nYour address has been chosen in our random community distribution.\n\nClaim your 5,000 USDT voucher immediately before the reward pool expires.\n\nClick here: http://suspicious-crypto-claim.xyz`,
    timestamp: "Nov 8",
    fullDate: "Nov 8, 2026, 4:12 AM",
    category: "promotions",
    folder: "spam",
    isUnread: true,
    isStarred: false,
  },
  {
    id: "msg_spam_02",
    senderName: "Commercial Fast Funding",
    senderEmail: "approvals@instant-biz-capital.biz",
    recipientEmail: "alex@enterprise.corp",
    subject: "Pre-approved: $250,000 unsecured line of credit for Enterprise Corp",
    snippet: "No tax returns required! Same-day deposit for qualified small business accounts. Reply with your phone number...",
    body: `Alex,\n\nWe noticed Enterprise Corp is expanding. You qualify for an unsecured revolving credit line up to $250,000 at competitive daily interest.\n\nNo collateral or credit check needed. Reply now to speak with a loan specialist.`,
    timestamp: "Nov 7",
    fullDate: "Nov 7, 2026, 2:00 AM",
    category: "promotions",
    folder: "spam",
    isUnread: true,
    isStarred: false,
  },

  // ── TRASH ───────────────────────────────────────────────────────
  {
    id: "msg_trash_01",
    senderName: "Growth Hackers Weekly",
    senderEmail: "newsletter@growthjunkies.co",
    recipientEmail: "alex@enterprise.corp",
    subject: "10 Cold Email Subject Lines That Get 80% Open Rates in 2026",
    snippet: "Stop getting sent to the spam folder. Here are 10 psychological email hooks to boost your outbound pipeline...",
    body: `Hey Alex,\n\nCold email isn't dead—boring email is.\n\nHere are the top 10 subject lines our agency tested across 500,000 outbound touches this month...\n\n[Moved to trash by user]`,
    timestamp: "Nov 3",
    fullDate: "Nov 3, 2026, 8:45 AM",
    category: "promotions",
    folder: "trash",
    isUnread: false,
    isStarred: false,
  },

  // ── SNOOZED ─────────────────────────────────────────────────────
  {
    id: "msg_snooze_01",
    senderName: "Rachel Green",
    senderEmail: "rachel@enterprise.corp",
    recipientEmail: "alex@enterprise.corp",
    subject: "Follow up: Annual Cyber Liability Insurance Policy Renewal",
    snippet: "Alex, snoozing this until Friday when the insurance broker sends over the updated premium schedule...",
    body: `Hi Alex,\n\nOur cyber liability insurance policy is up for renewal at the end of December.\n\nThe underwriter requires confirmation of our 2FA enforcement and backup recovery procedures before providing the final premium quote.\n\nI'll follow up on Friday with the proposal.\n\nBest,\nRachel Green\nLegal & Risk Management`,
    timestamp: "Snoozed until Friday",
    fullDate: "Nov 6, 2026, 11:00 AM",
    category: "primary",
    folder: "snoozed",
    isUnread: false,
    isStarred: true,
    label: "Work",
    attachments: [
      {
        id: "att_cyber_insurance",
        name: "Cyber_Insurance_Questionnaire_2026.pdf",
        size: "950 KB",
        type: "pdf",
      },
    ],
  },
]
