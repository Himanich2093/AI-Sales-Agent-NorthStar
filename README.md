# AI-Sales-Agent-NorthStar
🧠 Northstar – AI Sales Proposal Agent

A Microsoft Copilot–style autonomous sales agent

This project implements an AI-powered Sales Proposal Agent that operates like a Microsoft 365 Copilot extension. Instead of being a chatbot, the agent owns an end-to-end enterprise workflow: lead intake → CRM → pricing → proposal → approvals → email delivery.

It demonstrates how Generative AI + agent orchestration can automate real business processes inside enterprise productivity tools.

🚀 What This Agent Does

When a sales lead arrives, the agent automatically:

Understands the user message using AI

Identifies the customer

Pulls CRM data

Applies pricing rules

Generates a proposal document

Sends it for Finance & Legal approval

Waits asynchronously

Finalizes the proposal

Emails it to the customer with attachments

This mirrors how a real Microsoft 365 Copilot agent would operate inside Outlook, Teams, Word, and CRM systems.

🧩 How It Works
User (Copilot Chat)
        ↓
AI Understanding (GPT)
        ↓
Northstar Agent (State + Workflow Engine)
        ↓
--------------------------------
| CRM | Pricing | Docs | Approvals |
--------------------------------
        ↓
Email Delivery


The LLM handles natural language.
The Agent controls workflow, memory, approvals, and business rules.

🖥️ What You Can Do in the Demo

Try typing:

We got a lead from ABC Corp


The agent will:

Draft a proposal

Show approval progress

Generate the final document

Ask you to type send

Then type:

send


You will see the email that would be delivered to the customer, including attachments.

You can also try:

Northwind wants a proposal
Globex needs cloud security

🛠️ Tech Stack
Layer	Technology
Frontend	React (Copilot-style UI)
Backend	Node.js + Express
AI	OpenAI GPT (safe-guarded)
Agent	Stateful workflow engine
Data	JSON-based CRM & Pricing
Hosting	Render + GitHub
🧠 Why This Is an Agent (Not a Chatbot)

This system:

Maintains long-running state

Waits for asynchronous approvals

Coordinates multiple systems

Prevents hallucinated pricing

Enforces enterprise rules

This is the same architecture used in real Copilot extensions.

🔐 Safety & Reliability

AI is never allowed to invent prices, customers, or contracts

All values come from controlled systems (CRM, pricing)

OpenAI failures never crash the workflow

External sending is blocked until approvals complete

🏁 Running Locally

Backend

cd backend
npm install
node server.js


Frontend

cd frontend
npm install
npm start


Open:

http://localhost:3000

🌍 Deployment

Backend and frontend are deployed on Render for a live interactive demo.
