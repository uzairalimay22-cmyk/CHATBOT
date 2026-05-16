let chatHistory = [];

const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const typingIndicator = document.getElementById("typingIndicator");
const sidebar = document.getElementById("sidebar");
const historyList = document.getElementById("historyList");

// Load history on page load
window.onload = () => {
  userInput.focus();
  loadHistory();
};

function toggleSidebar() {
  sidebar.classList.toggle("open");
  if (sidebar.classList.contains("open")) loadHistory();
}

function handleKey(e) {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
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
  bubble.innerHTML = content.replace(/\n/g, "<br>");
  div.appendChild(avatar);
  div.appendChild(bubble);
  chatMessages.appendChild(div);
  scrollToBottom();
}

function showTyping() { typingIndicator.classList.add("active"); scrollToBottom(); }
function hideTyping() { typingIndicator.classList.remove("active"); }

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  addMessage("user", message);
  chatHistory.push({ role: "user", content: message });
  userInput.value = "";
  userInput.style.height = "auto";
  sendBtn.disabled = true;
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
    addMessage("bot", "Connection error. Please try again.");
  }
  sendBtn.disabled = false;
  userInput.focus();
}

function clearChat() {
  chatHistory = [];
  chatMessages.innerHTML = `
    <div class="message bot-message">
      <div class="message-avatar">⚡</div>
      <div class="message-bubble">Chat cleared! Ask me anything 😊</div>
    </div>`;
}

function newChat() {
  clearChat();
  sidebar.classList.remove("open");
}

async function loadHistory() {
  historyList.innerHTML = '<div class="history-loading">Loading...</div>';
  try {
    const res = await fetch("/history");
    const data = await res.json();
    const history = data.history || [];
    if (history.length === 0) {
      historyList.innerHTML = '<div class="history-empty">No chat history yet</div>';
      return;
    }
    historyList.innerHTML = "";
    // Show most recent first
    [...history].reverse().forEach(item => {
      const div = document.createElement("div");
      div.className = "history-item";
      div.innerHTML = `
        <div class="history-item-q">You: ${escapeHtml(item.user)}</div>
        <div class="history-item-a">AI: ${escapeHtml(item.bot)}</div>
        <div class="history-item-time">${item.time}</div>`;
      div.onclick = () => loadHistoryItem(item);
      historyList.appendChild(div);
    });
  } catch (err) {
    historyList.innerHTML = '<div class="history-empty">Failed to load history</div>';
  }
}

function loadHistoryItem(item) {
  chatMessages.innerHTML = "";
  chatHistory = [];
  addMessage("user", item.user);
  addMessage("bot", item.bot);
  chatHistory.push({ role: "user", content: item.user });
  chatHistory.push({ role: "assistant", content: item.bot });
  sidebar.classList.remove("open");
}

async function clearAllHistory() {
  if (!confirm("Clear all chat history?")) return;
  await fetch("/clear_history", { method: "POST" });
  loadHistory();
}

function escapeHtml(text) {
  return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").substring(0, 60) + (text.length > 60 ? "..." : "");
}