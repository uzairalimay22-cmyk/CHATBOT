let chatHistory = [];

const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const typingIndicator = document.getElementById("typingIndicator");

function handleKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 140) + "px";
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addMessage(role, content) {
  const div = document.createElement("div");
  div.className = `message ${role === "user" ? "user-message" : "bot-message"}`;

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = "⚡";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = content;

  div.appendChild(avatar);
  div.appendChild(bubble);
  chatMessages.appendChild(div);
  scrollToBottom();
}

function showTyping() {
  typingIndicator.classList.add("active");
  scrollToBottom();
}

function hideTyping() {
  typingIndicator.classList.remove("active");
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // Add user message
  addMessage("user", message);
  chatHistory.push({ role: "user", content: message });

  // Clear input
  userInput.value = "";
  userInput.style.height = "auto";
  sendBtn.disabled = true;

  // Show typing
  showTyping();

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: chatHistory.slice(-10) }),
    });

    const data = await res.json();

    hideTyping();

    if (data.response) {
      addMessage("bot", data.response);
      chatHistory.push({ role: "assistant", content: data.response });
    } else {
      addMessage("bot", "Sorry, something went wrong. Please try again.");
    }
  } catch (err) {
    hideTyping();
    addMessage("bot", "Connection error. Make sure Flask server is running.");
    console.error(err);
  }

  sendBtn.disabled = false;
  userInput.focus();
}

function clearChat() {
  chatHistory = [];
  chatMessages.innerHTML = `
    <div class="message bot-message">
      <div class="message-avatar">⚡</div>
      <div class="message-bubble">
        Chat cleared! How can I help you? 😊
      </div>
    </div>
  `;
}

// Focus input on load
window.onload = () => userInput.focus();