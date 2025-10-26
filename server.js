import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// Allow Roblox to access this server
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) return res.json({ reply: "❌ No message provided." });

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a helpful Roblox Scripting Assistant." },
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "❌ AI did not generate a reply.";
        res.json({ reply });
    } catch (err) {
        console.error("Server error:", err);
        res.json({ reply: "❌ Failed to contact AI." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Server running on PORT", PORT));
