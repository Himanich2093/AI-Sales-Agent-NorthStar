import axios from "axios";

export const sendMessage = async (msg) => {
  const res = await axios.post("http://localhost:5000/chat", { message: msg });
  return res.data;
};
