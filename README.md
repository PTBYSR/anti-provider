<p align="center">
  <img src="anti-provider-hero.png" alt="Piwa" width="100"/>
</p>

# Anti-Provider

Anti-Provider is a lightweight, zero-dependency Node.js bridge that wraps your authenticated Google Cloud Code Assist ("Antigravity") session behind a standard **OpenAI-compatible REST API**.

This allows you to use powerful Google-internal AI models (like Gemini 3 Flash, Claude Opus, and Claude Sonnet) directly inside your favorite AI coding environments—such as Cursor, Continue, Aider, Claude Code, or any other tool that accepts an OpenAI base URL and API key.

---

## ⚡ Quick Start: Get Your API Key

Follow these steps to generate your local API key and start using the models immediately.

### 1. Install & Authenticate
Clone the repository. Since it has zero external dependencies, no `npm install` is required!

```bash
git clone https://github.com/PTBYSR/anti-provider.git
cd anti-provider
```

First, authenticate your Google account via OAuth 2.0 PKCE:
```bash
npm start
```
When prompted in the chat interface, type `/login`. This will open your browser to log in with your Google account. Your session token is saved securely to a local `auth.json`. Once authenticated, you can exit the chat (`Ctrl+C`).

### 2. Start the API Server
Launch the OpenAI-compatible proxy server:
```bash
npm run server
```

On the first run, the server will automatically generate a unique API Key (starting with `ap-`) and print it to your terminal. It will also bind to the first available port (default `3737`).

### 3. Use Your API Key
You can now point **any** OpenAI-compatible client to your local server!

- **Base URL:** `http://localhost:3737/v1`
- **API Key:** `ap-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Available Models:** `gemini-3-flash`, `claude-opus-4-6-thinking`, `claude-sonnet-4-6`, `gpt-oss-120b-medium`, and more.

**Example for Cursor / Continue:**
```yaml
models:
  - name: Anti-Provider
    provider: openai
    model: auto
    apiBase: http://localhost:3737/v1
    apiKey: ap-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🧪 How to Test and Configure

### Test your Login (Chat CLI)
Use the interactive terminal chat as a gauge to verify your account login is working correctly:
```bash
npm start
```
If your current account gets rate-limited by the API, you can authorize a new account instantly from within the chat:
```bash
You: /login
```

### View/Configure your Setup (Config CLI)
Need to quickly see your API key or change your default model?
```bash
npm run config
```
```text
Welcome to the Antigravity Configuration CLI!

--- Antigravity Configuration Menu ---
1. View architecture status (Gmail, Project, Model)
2. Change default model
3. Exit
--------------------------------------
Select an option (1-3): 1
```

---

## 🛠️ Advanced Usage

### Features
- **Zero Dependencies:** Built entirely using Node.js native modules (`http`, `crypto`, `fs`).
- **Endpoint Cascading:** Automatically routes requests across Google's `daily`, `autopush`, and `prod` endpoints to maximize uptime and bypass sandbox limitations.
- **Auto Token Refresh:** Silently refreshes your OAuth token in the background when it expires.
- **Streaming & Buffering:** Fully supports both SSE streaming (`stream: true`) and buffered JSON responses for maximum client compatibility.
- **Constant-Time Validation:** API key validation uses `crypto.timingSafeEqual` to prevent timing attacks.
- **Built-in Chat Client:** Includes a sleek, dark-mode `test-chat.html` you can open in your browser to test the API directly.

### Configuration (`config.json`)
When you run the server, it creates a `config.json` file. You can modify this to set your default model or view your generated API key manually.

```json
{
  "model": "gemini-3-flash",
  "apiKey": "ap-38137c347030070fae20b6a84c17f2b33f6d47496a9c034f"
}
```

### Endpoints
The server exposes the following endpoints on `http://localhost:3737`:
- `GET /v1/models` - Lists all available Antigravity models in OpenAI format.
- `POST /v1/chat/completions` - The main chat endpoint. Translates standard OpenAI JSON requests into the Antigravity format.
- `GET /health` - Simple health check to verify server status and authentication state.

### Using with Claude Code
If you want to use this with Anthropic-specific tools (like the `claude` CLI), note that `claude` expects the Anthropic `/v1/messages` format, not OpenAI. To use Anti-Provider with Claude Code, you will need to pass it through a translation proxy (like FreeLLMAPI) or use an OpenAI-compatible agent instead.

---

## ⚖️ Legal & Disclaimer

**Anti-Provider is an independent, unofficial developer tool.** 
This project is provided "as is", without warranty of any kind. 

- This tool acts solely as a local HTTP proxy wrapper around your own authenticated sessions. 
- It does not distribute, host, or claim ownership over any Google APIs, endpoints, models, or internal Intellectual Property (IP).
- All requests are made using the user's explicit consent and OAuth 2.0 tokens.
- The developers of Anti-Provider are not affiliated, associated, authorized, endorsed by, or in any way officially connected with Google LLC or Alphabet Inc.
- The terms "Cloud Code", "Antigravity", "Gemini", and related names are trademarks of their respective owners.

Users are solely responsible for ensuring their usage of this proxy complies with the Terms of Service of their respective Google Cloud / Google Workspace agreements.
