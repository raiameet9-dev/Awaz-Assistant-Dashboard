# Awaz-Assistant-Dashboard
Awaz — AI Voice AssistantAwaz (آواز, meaning "Voice" in Urdu) is a custom-built, Siri-style voice assistant web application designed specifically for Roman Urdu and English speaking users. The project demonstrates how voice recognition, AI language models, and browser automation can be combined into a single, lightweight, browser-based assistant.

**Awaz AI** is a full-stack, real-time AI voice assistant tailored for Roman Urdu and English voice interactions. Built with a Node.js Express backend and a responsive dark-themed frontend, it integrates Google Gemini API with local Pakistani utility endpoints (live weather, accurate prayer timings, and exchange rates) along with interactive Web Audio API frequency visualizations.

---



- **Brain Powered by Gemini AI:** Handles complex queries and returns concise, conversational responses in Roman Urdu.
- **Voice-to-Speech & Speech Recognition:** Native Web Speech API integration (`ur-PK` / English recognition) with text-to-speech feedback.
- **Real-Time Audio Visualizer:** Dynamic canvas wave analyzer using the HTML5 Web Audio API.
- **Direct Pakistan Utilities:**
  - 🕌 **Namaz Timings:** Live prayer schedule powered by Aladhan API.
  - 🌤️ **Karachi Weather:** Real-time temperature and wind speed via Open-Meteo.
  - 💵 **Currency Rate:** Live USD to PKR exchange rate tracking.
- **Secure Backend Routing:** API keys are protected in environment variables on the Node.js server rather than exposed on the frontend.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, `dotenv`, `cors`
- **Frontend:** Vanilla JavaScript (ES6+), HTML5 Canvas, Web Speech API, CSS3 Glassmorphism UI
- **AI Engine:** Google Gemini API (`gemini-3.6-flash`)
