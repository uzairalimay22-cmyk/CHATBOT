$content = @'
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from chatbot import get_response
from history import save_message, get_history, clear_history
import os
import json

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "supersecretkey123")

USERS_FILE = "users.json"

def load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f)

@app.route("/")
def index():
    if "username" not in session:
        return redirect(url_for("login"))
    return render_template("index.html", username=session["username"])

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.get_json()
        username = data.get("username", "").strip().lower()
        password = data.get("password", "").strip()
        users = load_users()
        if username in users and users[username] == password:
            session["username"] = username
            return jsonify({"success": True})
        return jsonify({"success": False, "error": "Invalid username or password"})
    return render_template("login.html")

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username", "").strip().lower()
    password = data.get("password", "").strip()
    if not username or not password:
        return jsonify({"success": False, "error": "Username and password required"})
    users = load_users()
    if username in users:
        return jsonify({"success": False, "error": "Username already exists"})
    users[username] = password
    save_users(users)
    session["username"] = username
    return jsonify({"success": True})

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

@app.route("/chat", methods=["POST"])
def chat():
    if "username" not in session:
        return jsonify({"error": "Not logged in"}), 401
    data = request.get_json()
    user_message = data.get("message", "")
    history = data.get("history", [])
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
    response = get_response(user_message, history)
    save_message(session["username"], user_message, response)
    return jsonify({"response": response})

@app.route("/history")
def history():
    if "username" not in session:
        return jsonify({"error": "Not logged in"}), 401
    return jsonify({"history": get_history(session["username"])})

@app.route("/clear_history", methods=["POST"])
def clear():
    if "username" not in session:
        return jsonify({"error": "Not logged in"}), 401
    clear_history(session["username"])
    return jsonify({"success": True})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
'@
$content | Out-File -FilePath "C:\Users\Uzair ali\Desktop\AI chatbot\app.py" -Encoding utf8