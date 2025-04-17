# Redora X — GPT Translate 🌐⚡  
> Instantly translate tweets on X (Twitter) using OpenAI's GPT models.

Redora X is a lightweight, blazing-fast Chrome extension that detects tweets in real-time while you scroll through X and translates them into your chosen target language using GPT-3.5, GPT-4, or GPT-4o.

---

## 🚀 Features

✅ Detects tweets on scroll  
✅ Translates using your OpenAI API key  
✅ Supports GPT-3.5, GPT-4, GPT-4o  
✅ Translates from any language to any target language  
✅ Skips re-translation of duplicates  
✅ Optimized for low token cost and speed  
✅ Clean UI & branding (Dark UI / Redora logo)  
✅ Fully open-source and privacy-friendly

---

## ⚙️ Settings

Accessible via the extension popup:

- **OpenAI API Key** → required  
- **Model selection** → gpt-3.5-turbo / gpt-4 / gpt-4o  
- **Target Language** → e.g., `en`, `tr`, `de`, `es`, `fr`

---

## 📦 Installation (Dev Mode)

1. Download or clone this repository  
2. Go to `chrome://extensions/`  
3. Enable **Developer Mode** (top-right toggle)  
4. Click **Load unpacked**  
5. Select the root directory of the extension  
6. Open popup, paste your OpenAI API key, choose model and target language

---

## 📷 Preview

![Preview](preview.png)

---

## 🛡 Privacy

This extension does **not** log, transmit, or store any user data.  
Your API key is stored **locally** via `chrome.storage.local`.

---

## 📡 Optional Dataset API 

- Logs source + translated texts
- Skips duplicate entries with LRU cache
- Rate-limited, secure, and open-source
- Perfect for building multilingual datasets

🔗 GitHub: `redora-x-translation-logger`  

---

## 🧠 Powered by

- [OpenAI API](https://platform.openai.com/)  
- [Redora](https://redora.co) – AI-enhanced productivity tools

---

## 👤 Developer

Built by [Şahincan Topaldemir](https://stopaldemir.com)  
GitHub: [@sctopaldemir](https://github.com/sctopaldemir)  
Website: [redora.co](https://redora.co)

---

## 📄 License

MIT — free to use, modify, and redistribute.
