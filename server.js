const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Gemini AI Endpoint
app.post('/api/ask', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Sawal darkar hai.' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server par GEMINI_API_KEY mawjood nahi hai (.env check karein).' });
  }

  // Google recommended active model
  const activeModel = 'gemini-3.6-flash';

  const systemPrompt = "Aap 'Awaz AI' hain, ek intehai zaheen Urdu voice assistant. Har sawal ka mukhtasar (2-3 lines), durust aur seedha Roman Urdu mein jawab dein.";

  const payload = {
    contents: [
      {
        parts: [{ text: `${systemPrompt}\n\nUser Question: ${prompt}` }]
      }
    ]
  };

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const apiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await apiRes.json();

    if (apiRes.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
      const responseText = data.candidates[0].content.parts[0].text.trim();
      return res.json({ reply: responseText });
    } else {
      console.error('API Error:', data);
      return res.status(503).json({ error: data.error?.message || 'AI generate nahi kar saka.' });
    }
  } catch (err) {
    console.error('Fetch Error:', err.message);
    return res.status(500).json({ error: err.message });
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

const { exec } = require('child_process');

app.listen(PORT, () => {
  console.log(`Awaz AI server running at: http://localhost:${PORT}`);
  // Windows par browser automatically direct open karne ke liye:
  exec(`start http://localhost:${PORT}`);
});