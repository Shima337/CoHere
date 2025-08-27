const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3003;
const app = express();
app.use(cors());
app.use(express.json());

app.post("/session", async (req, res) => {
  const openaiKey = req.header("Authorization")?.replace("Bearer ", "");
  if (!openaiKey) return res.status(400).send({ error: "Missing Authorization header" });
  try {
    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "alloy",
      }),
    });
    const data = await r.json();
    res.send(data);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.post("/test", async (req, res) => {
  const { topic, systemPrompt } = req.body;
  const openaiKey = req.header("Authorization")?.replace("Bearer ", "");
  if (!openaiKey) return res.status(400).send({ error: "Missing Authorization header" });
  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: `${systemPrompt}\nСоставь короткий тест (3 вопроса) по теме: ${topic}.`,
      }),
    });
    const data = await r.json();
    res.send({ test: data?.output_text || "" });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.post("/grade", async (req, res) => {
  const { topic, test, answers, systemPrompt } = req.body;
  const openaiKey = req.header("Authorization")?.replace("Bearer ", "");
  if (!openaiKey) return res.status(400).send({ error: "Missing Authorization header" });
  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: `${systemPrompt}\nТема: ${topic}\nТест:\n${test}\nОтветы ученика:\n${answers}\nПроверь ответы и дай короткую обратную связь на русском.`,
      }),
    });
    const data = await r.json();
    res.send({ result: data?.output_text || "" });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

