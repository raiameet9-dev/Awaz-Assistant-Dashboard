const express = require('express');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


const GEMINI_API_KEY = "AQ.Ab8RN6I9W9Dx1MNQwbj5YZkTNfsQLpdHPeAxHkAd3Hf10LkNCg";
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Gemini AI Endpoint
app.post('/api/ask', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Sawal darkar hai.' });
  }

  const candidateModels = [
    'gemini-3.6-flash',
    'gemini-3.5-flash-lite'
  ];

  const systemPrompt = "Aap 'Awaz AI' hain, ek intehai zaheen Urdu voice assistant. Har sawal ka mukhtasar (2-3 lines), durust aur seedha Roman Urdu mein jawab dein.";

  const payload = {
    contents: [
      {
        parts: [{ text: `${systemPrompt}\n\nUser Question: ${prompt}` }]
      }
    ]
  };

  let responseText = null;
  let lastErrorMessage = '';

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
      const apiRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await apiRes.json();

      if (apiRes.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText = data.candidates[0].content.parts[0].text.trim();
        break;
      } else {
        lastErrorMessage = data.error?.message || `HTTP ${apiRes.status}`;
        console.error(`Model ${model} issue:`, lastErrorMessage);
      }
    } catch (err) {
      lastErrorMessage = err.message;
      console.error(`Failed to reach ${model}:`, err.message);
    }
  }

  if (responseText) {
    return res.json({ reply: responseText });
  } else {
    return res.status(503).json({ error: `Google API Error: ${lastErrorMessage}` });
  }
});

// 2. Namaz Timings Endpoint
app.get('/api/namaz', async (req, res) => {
  try {
    const city = req.query.city || 'Karachi';
    const r = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Pakistan&method=1`);
    const d = await r.json();
    res.json(d.data.timings);
  } catch (err) {
    res.status(500).json({ error: 'Namaz timings load nahi ho sakin.' });
  }
});

// 3. Weather Endpoint
app.get('/api/weather', async (req, res) => {
  try {
    const lat = req.query.lat || '24.8607';
    const lon = req.query.lon || '67.0011';
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const d = await r.json();
    res.json(d.current_weather);
  } catch (err) {
    res.status(500).json({ error: 'Mausam ka data nahi mil saka.' });
  }
});

// 4. USD to PKR Exchange Rate Endpoint
app.get('/api/dollar', async (req, res) => {
  try {
    const r = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const d = await r.json();
    res.json({ pkr: d.rates.PKR });
  } catch (err) {
    res.status(500).json({ error: 'Dollar rate fetch nahi ho saka.' });
  }
});

app.listen(PORT, () => {
  console.log(`Awaz AI server running at: http://localhost:${PORT}`);
  exec(`start http://localhost:${PORT}`);
});