# ⚡ Groq AI Chatbot

A blazing-fast AI chatbot powered by **Groq API** and **LLaMA 3.3 70B**, 
built with Python & Flask with a sleek modern dark UI.

## ✨ Features
- 🚀 Super fast responses via Groq API
- 🧠 LLaMA 3.3 70B language model
- 💬 Full conversation memory
- 🎨 Beautiful dark theme UI
- ⌨️ Typing indicator animation
- 📱 Fully responsive design

## 🛠️ Tech Stack
- **Backend:** Python, Flask
- **AI Model:** LLaMA 3.3 70B via Groq
- **Frontend:** HTML, CSS, JavaScript
- **Environment:** UV virtual environment

## 🚀 Quick Start

### 1. Clone the repo
git clone https://github.com/yourusername/ai-chatbot.git
cd ai-chatbot

### 2. Install dependencies
uv pip install -r requirements.txt

### 3. Add your Groq API key
Create a .env file:
GROQ_API_KEY=your_groq_api_key_here

Get your free key at https://console.groq.com

### 4. Run the app
python app.py

### 5. Open in browser
http://localhost:5000

## 📁 Project Structure
ai-chatbot/
├── app.py            # Flask server
├── chatbot.py        # Groq API logic
├── config.py         # Configuration
├── requirements.txt  # Dependencies
├── .env              # API keys (never commit!)
├── templates/
│   └── index.html    # Chat UI
└── static/
    ├── css/style.css
    └── js/script.js

## ⚙️ Environment Variables
| Variable | Description |
|----------|-------------|
| GROQ_API_KEY | Your Groq API key from console.groq.com |

## 📄 License
MIT License — feel free to use and modify!

## 🙏 Credits
- [Groq](https://groq.com) for the lightning fast API
- [Meta](https://ai.meta.com) for LLaMA 3.3 model