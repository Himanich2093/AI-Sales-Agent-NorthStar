import fs from "fs";
import { askAI } from "./ai.js";

let timersStarted = false;

/* ---------------------------------------
   Safe AI wrapper (NEVER crashes)
--------------------------------------- */
async function safeAI(system, user) {
  try {
    return await askAI(system, user);
  } catch (e) {
    console.error("AI error:", e.message);
    return ""; // fallback to rule-based logic
  }
}

export async function runAgent(message, state) {

  // Polling must never hit AI
  if (message === "status") {
    return { reply: state.lastMessage || "Working…" };
  }

  // Initialize persistent memory
  if (!state.stage) {
    state.stage = "idle";
    state.approvals = { finance: false, legal: false };
    state.customerName = null;
    state.customer = null;
    state.customerEmail = null;
    state.price = null;
    state.proposal = null;
    state.attachments = [];
    state.lastMessage = "";
    state.aiIntent = null;
  }

  const crm = JSON.parse(fs.readFileSync("./crm.json"));
  const pricing = JSON.parse(fs.readFileSync("./pricing.json"));

  /* ---------------------------------------
     Run AI ONCE per lead
  --------------------------------------- */
  if (state.stage === "idle" && !state.aiIntent) {
    state.aiIntent = await safeAI(
      "Detect if this is a sales lead and extract the company name if present.",
      message
    );
  }

  /* ---------------------------------------
     Lead handling
  --------------------------------------- */
  if (state.stage === "idle") {
    const intent = (state.aiIntent || message).toLowerCase();

    let company = null;
    if (intent.includes("abc")) company = "ABC Corp";
    if (intent.includes("globex")) company = "Globex Inc";
    if (intent.includes("northwind")) company = "Northwind Ltd";

    if (intent.includes("lead") || company) {
      if (!company) {
        return { reply: "I detected a sales inquiry but couldn’t identify the company." };
      }

      state.customerName = company;
      state.customer = crm[company];
      state.customerEmail = company.toLowerCase().replace(/\s/g, "") + "@client.com";
      state.price = pricing[state.customer.industry];

      state.proposal = `📄 SALES PROPOSAL

Client: ${company}
Industry: ${state.customer.industry}
Company Size: ${state.customer.size}

Service: Cloud Security Platform

Final Price: $${state.price.basePrice - (state.price.basePrice * state.price.discount / 100)}

Includes:
• Threat Monitoring
• Compliance Reports
• 24/7 SOC
`;

      state.attachments = [
        "Northstar_CloudSecurity_Brochure.pdf",
        "Pricing_Details.xlsx"
      ];

      state.stage = "awaiting_approvals";
      state.lastMessage = `Drafting proposal for ${company} and sending to Finance & Legal (~6 seconds)… please click send button upon approval`;

      if (!timersStarted) {
        timersStarted = true;

        setTimeout(() => {
          state.approvals.finance = true;
          state.lastMessage = "Finance approved. Waiting for Legal.";
        }, 3000);

        setTimeout(() => {
          state.approvals.legal = true;
          state.stage = "ready";
          state.lastMessage =
            `All approvals received.\n\n${state.proposal}\n\n📎 ${state.attachments.join(
              ", "
            )}\n\nType **send** to email this to the customer.`;
        }, 6000);
      }

      return { reply: state.lastMessage };
    }
  }

  /* ---------------------------------------
     Waiting for approvals
  --------------------------------------- */
  if (state.stage === "awaiting_approvals") {
    return { reply: state.lastMessage };
  }

  /* ---------------------------------------
     Ready → Send
  --------------------------------------- */
  if (state.stage === "ready") {
    if (message.toLowerCase().includes("send")) {
      state.stage = "sent";

      const email = `To: ${state.customerEmail}
Subject: Proposal for ${state.customerName} – Northstar Enterprises

Dear ${state.customerName},

Please find our proposal below.

${state.proposal}

Attachments: ${state.attachments.join(", ")}

Best regards,
Northstar Sales Team`;

      return {
        reply: "📧 Proposal sent successfully.\n\n" + email
      };
    }

    return { reply: state.lastMessage };
  }

  /* ---------------------------------------
     After sent
  --------------------------------------- */
  if (state.stage === "sent") {
    return { reply: "The proposal has already been sent. You can start a new lead." };
  }

  return { reply: "Ready for the next sales lead." };
}
