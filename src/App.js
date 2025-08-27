import { useState, useRef } from "react";
import "./index.css";

function App() {
  const [systemPrompt, setSystemPrompt] = useState(
    "Ты преподаватель русского языка. Объясняй темы по-русски простым языком."
  );
  const [topic, setTopic] = useState("");
  const [test, setTest] = useState("");
  const [answers, setAnswers] = useState("");
  const [apiKey, setApiKey] = useState("");
  const audioRef = useRef(null);
  const dcRef = useRef(null);

  const startSession = async () => {
    const tokenRes = await fetch("/session", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const token = await tokenRes.json();
    const pc = new RTCPeerConnection();
    const dc = pc.createDataChannel("oai-events");
    dcRef.current = dc;
    dc.onmessage = (ev) => {
      console.log("message", ev.data);
    };
    pc.ontrack = (e) => {
      audioRef.current.srcObject = e.streams[0];
    };
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    const baseUrl =
      "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17";
    const resp = await fetch(baseUrl, {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${token.client_secret}`,
        "Content-Type": "application/sdp",
      },
    });
    const answer = await resp.text();
    await pc.setRemoteDescription({ type: "answer", sdp: answer });
    dc.addEventListener("open", () => {
      dc.send(
        JSON.stringify({
          type: "session.update",
          session: { instructions: systemPrompt },
        })
      );
      dc.send(
        JSON.stringify({
          type: "response.create",
          response: {
            conversation: [
              {
                role: "user",
                content: [
                  { type: "input_text", text: `Объясни тему \"${topic}\"` },
                ],
              },
            ],
          },
        })
      );
    });
  };

  const generateTest = async () => {
    const res = await fetch("/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ topic, systemPrompt }),
    });
    const data = await res.json();
    setTest(data.test);
  };

  const gradeTest = async () => {
    const res = await fetch("/grade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ topic, test, answers, systemPrompt }),
    });
    const data = await res.json();
    alert(data.result);
  };

  return (
    <div className="app">
      <div className="left">
        <h3>Системные промты</h3>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        ></textarea>
      </div>
      <div className="right">
        <input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="OpenAI API Key"
        />
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Тема или правило"
        />
        <div className="buttons">
          <button onClick={startSession}>Объяснить голосом</button>
          <button onClick={generateTest}>Получить тест</button>
        </div>
        {test && (
          <div className="test">
            <p>{test}</p>
            <textarea
              value={answers}
              onChange={(e) => setAnswers(e.target.value)}
              placeholder="Ваши ответы"
            ></textarea>
            <button onClick={gradeTest}>Проверить</button>
          </div>
        )}
        <audio ref={audioRef} autoPlay></audio>
      </div>
    </div>
  );
}

export default App;

