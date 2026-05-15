@"
import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL = "llama-3.3-70b-versatile"
SYSTEM_PROMPT = "You are a helpful, friendly, and intelligent AI assistant. Answer clearly and concisely."
"@ | Out-File -FilePath config.py -Encoding utf8