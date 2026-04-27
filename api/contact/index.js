const TENANT_ID = process.env.GRAPH_TENANT_ID;
const CLIENT_ID = process.env.GRAPH_CLIENT_ID;
const CLIENT_SECRET = process.env.GRAPH_CLIENT_SECRET;
const MAIL_FROM = process.env.MAIL_FROM;
const MAIL_TO = process.env.MAIL_TO || MAIL_FROM;

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 200, title: 200, organization: 200, email: 320, phone: 50, sector: 100, conversation: 100, systems: 5000 };

function clean(v, max) {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function getGraphToken() {
  const url = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials"
  });
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Token request failed: ${r.status} ${text}`);
  }
  const j = await r.json();
  return j.access_token;
}

async function sendViaGraph(token, upn, message) {
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(upn)}/sendMail`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message, saveToSentItems: true })
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`sendMail failed: ${r.status} ${text}`);
  }
}

module.exports = async function (context, req) {
  context.res = {
    headers: { "Content-Type": "application/json" }
  };

  if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET || !MAIL_FROM) {
    context.log.error("Missing required environment variables.");
    context.res.status = 500;
    context.res.body = { ok: false, error: "Server is not configured." };
    return;
  }

  const b = req.body || {};

  if (b._gotcha && String(b._gotcha).trim() !== "") {
    context.res.status = 200;
    context.res.body = { ok: true };
    return;
  }

  const name = clean(b.name, MAX.name);
  const title = clean(b.title, MAX.title);
  const organization = clean(b.organization, MAX.organization);
  const email = clean(b.email, MAX.email);
  const phone = clean(b.phone, MAX.phone);
  const sector = clean(b.sector, MAX.sector);
  const conversation = clean(b.conversation, MAX.conversation);
  const systems = clean(b.systems, MAX.systems);

  if (!name || !organization || !email) {
    context.res.status = 400;
    context.res.body = { ok: false, error: "Name, organization, and email are required." };
    return;
  }
  if (!EMAIL_RX.test(email)) {
    context.res.status = 400;
    context.res.body = { ok: false, error: "Please enter a valid email address." };
    return;
  }

  const subject = `New contact from cedarfortdigital.com — ${name} (${organization})`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1a1a1a;line-height:1.55">
      <h2 style="margin:0 0 12px;color:#0f4d4a">New contact from cedarfortdigital.com</h2>
      <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
        <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
        <tr><td><strong>Title</strong></td><td>${escapeHtml(title) || "&mdash;"}</td></tr>
        <tr><td><strong>Organization</strong></td><td>${escapeHtml(organization)}</td></tr>
        <tr><td><strong>Sector</strong></td><td>${escapeHtml(sector) || "&mdash;"}</td></tr>
        <tr><td><strong>Email</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(phone) || "&mdash;"}</td></tr>
        <tr><td><strong>Conversation</strong></td><td>${escapeHtml(conversation) || "&mdash;"}</td></tr>
      </table>
      <h3 style="margin:20px 0 6px;color:#0f4d4a">Systems they want to govern</h3>
      <div style="white-space:pre-wrap;border-left:3px solid #b87333;padding:6px 12px;background:#faf7f2">${escapeHtml(systems) || "(none provided)"}</div>
      <p style="margin-top:18px;color:#666;font-size:12px">Reply to this message to respond directly to ${escapeHtml(name)}.</p>
    </div>
  `;

  const message = {
    subject,
    body: { contentType: "HTML", content: html },
    toRecipients: [{ emailAddress: { address: MAIL_TO } }],
    replyTo: [{ emailAddress: { address: email, name: name } }]
  };

  try {
    const token = await getGraphToken();
    await sendViaGraph(token, MAIL_FROM, message);
    context.res.status = 200;
    context.res.body = { ok: true };
  } catch (err) {
    context.log.error("Contact send failed:", err.message);
    context.res.status = 502;
    context.res.body = {
      ok: false,
      error: "Could not send your message. Please email contact@cedarfortdigital.com directly."
    };
  }
};
