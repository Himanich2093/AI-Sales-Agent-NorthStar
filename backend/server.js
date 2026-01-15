import express from "express";
import cors from "cors";
import { runAgent } from "./agent.js";

const app = express();
app.use(cors());
app.use(express.json());

let agentState = {
  stage: "idle",
  customer: null,
  price: null,
  proposal: null,
  approvals: { finance: false, legal: false }
};

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const result = await runAgent(message, agentState);
  res.json({ reply: result.reply, state: agentState });
});

app.listen(5000, () => console.log("Agent running on port 5000"));
