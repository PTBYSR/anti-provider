# Antigravity Proxy (anti-provider)

A standalone Node.js CLI chatbot that mimics the authentication architecture and endpoints of the internal Google Cloud Code Assist Antigravity provider. 

It allows you to securely authenticate via OAuth (PKCE flow) and interact with models like Gemini 3 Pro, Claude Opus, and GPT-OSS directly from your terminal.

## Features

- **Direct Antigravity API Access:** Fully authenticates your Google account against the internal Cloud Code API.
- **Dynamic Project Discovery:** Automatically provisions and binds to your assigned sandbox Google Cloud project (`cloudaicompanionProject`).
- **Endpoint Cascading:** Handles 403 and 404 errors by smartly cascading through Google's sandbox environments (`daily` -> `autopush` -> `prod`).
- **Model Configuration CLI:** A separate tool to manage your default model globally without editing code.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PTBYSR/anti-provider.git
   cd anti-provider
   ```
2. Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

## Usage

### 1. Chatbot
To start chatting, run:
```bash
npm start
```
*or* `node antigravity-chat.mjs`

On your first run, the script will prompt you to type `/login`. This generates an OAuth consent link. Open the link in your browser, approve the Google Cloud Code permissions, and the CLI will automatically intercept the callback and save your access tokens securely.

Once authenticated, just type your prompt and press Enter.

**In-chat commands:**
- `/login` : Re-authenticate and fetch new tokens.
- `/model <tag>` : Switch the active AI model mid-conversation (e.g., `/model claude-3-5-sonnet`).

### 2. Configuration CLI
To check your account status or change your default model, run:
```bash
npm run config
```
*or* `node antigravity-config.mjs`

This brings up an interactive menu where you can:
1. **View Status:** See the currently authenticated Gmail address and Project ID.
2. **Change Model:** Pick from a numbered list of available Antigravity models to set as your global default.

## Supported Models
- `claude-opus-4-6-thinking`
- `claude-opus-4-5-thinking`
- `claude-sonnet-4-6`
- `claude-sonnet-4-5`
- `claude-sonnet-4-5-thinking`
- `gemini-3.1-pro-high`
- `gemini-3.1-pro-low`
- `gemini-3-flash`
- `gpt-oss-120b-medium`

## Security
This project uses the OAuth PKCE flow. Your access tokens and configuration preferences are saved locally in `auth.json` and `config.json` respectively. These files are added to `.gitignore` and are **never** pushed to the repository. 
