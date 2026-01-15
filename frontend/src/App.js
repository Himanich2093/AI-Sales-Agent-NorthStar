import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";


function App() {
  const [state, setState] = useState({});
  const [chat, setChat] = useState([
    {
      role: "agent",
      text: "👋 Welcome to Northstar Sales Copilot. Try typing: **We got a lead from ABC Corp**"
    }
  ]);

  const [input, setInput] = useState("");
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await axios.post("http://localhost:5000/chat", { message: "status" });
      setState(res.data.state);
    }, 2000);

    return () => clearInterval(interval);
  }, []);


  async function send() {
    const res = await axios.post("http://localhost:5000/chat", {
      message: input,
    });

    setChat([
      ...chat,
      { role: "user", text: input },
      { role: "agent", text: res.data.reply }
    ]);

    setState(res.data.state);
    setInput("");
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>🧠 Northstar Sales Copilot</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        
        {/* Chat */}
        <div style={{ border: "1px solid #ccc", padding: 10 }}>
          <h3>Copilot Chat</h3>
          {chat.map((c, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <b>{c.role === "user" ? "You" : "Agent"}:</b> {c.text}
            </div>
          ))}

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ width: "80%" }}
          />
          <button onClick={send}>Send</button>
        </div>

        {/* CRM */}
        <div style={{ border: "1px solid #ccc", padding: 10 }}>
          <h3>CRM</h3>
          {state.customer && (
            <>
              <p><b>Industry:</b> {state.customer.industry}</p>
              <p><b>Company Size:</b> {state.customer.size}</p>
              <p><b>Past Client:</b> {state.customer.pastDeal}</p>
            </>
          )}
        </div>

        {/* Pricing */}
        <div style={{ border: "1px solid #ccc", padding: 10 }}>
          <h3>Pricing</h3>
          {state.price && (
            <>
              <p><b>Base Price:</b> ${state.price.basePrice}</p>
              <p><b>Discount:</b> {state.price.discount}%</p>
              <p><b>Final Quote:</b> ${state.price.basePrice - (state.price.basePrice * state.price.discount)/100}</p>
            </>
          )}
        </div>

        {/* Proposal */}
        <div style={{ border: "1px solid #ccc", padding: 10 }}>
          <h3>Proposal</h3>
          <div style={{
            background:"#f9f9f9",
            padding:15,
            minHeight:200,
            whiteSpace:"pre-wrap",
            border:"1px solid #ddd"
          }}>
            {state.proposal || "No proposal yet"}
          </div>
        </div>

        {/* Approvals */}
        <div style={{ border: "1px solid #ccc", padding: 10 }}>
          <h3>Approval Workflow</h3>
          <p>Finance: {state.approvals?.finance ? "Approved ✅" : "Pending ⏳"}</p>
          <p>Legal: {state.approvals?.legal ? "Approved ✅" : "Pending ⏳"}</p>

          {state.stage === "ready" && <p><b>Proposal is ready to send 📤</b></p>}
        </div>

      </div>
    </div>
  );
}

export default App;
