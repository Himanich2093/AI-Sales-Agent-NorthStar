import { useState } from "react";
import { sendMessage } from "./api";

export default function App() {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");

  async function send() {
    const res = await sendMessage(input);
    setChat([...chat, { user: input }, { agent: res.reply }]);
  }

  return (
    <div>
      <h2>Northstar Copilot</h2>
      {chat.map((c, i) => (
        <div key={i}>{c.user || c.agent}</div>
      ))}
      <input onChange={e => setInput(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}
