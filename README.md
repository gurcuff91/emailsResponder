# Small Email-Autoresponder

**Small Email-Autoresponder** is a lightweight demo webapp built with **Node.js** , **Express** and **KaibanJS**. It simulates an email autoresponder that classifies email content and automatically generates replies based on sentiment, intent, and area.

---

## ✨ Features

- 📬 **Email Classification**
  - **Sentiment**: Positive, Neutral, Negative
  - **Intent**: Support Request, Feedback, Sales Inquiry
  - **Area**: Product, Billing, Technical

- 🤖 **Auto-Reply Generation**
  - Replies based on classification and email contents

---

## 📦 Tech Stack

- Node.js
- KaibanJS
- Express
- EJS
- Htmx

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

```bash
git clone git@github.com:gurcuff91/emailsResponder.git
cd emailsResponder
npm install
```

### Environment Variables

To access the OpenAI API, this app requires your API key stored in a `.env` file.

> 🔐 **Note:** For security reasons, the `.env` file is **excluded** from version control. A `.env.template` file is included to show the required structure.

1. Copy the template file to `.env`:

```bash
cp .env.template .env
```

2. Open the `.env` file and insert your OpenAI API key:

```
OPENAI_API_KEY=<your_openai_api_key_here>
PORT=<your_webapp_port_here>
```

---

## 🏃 Running the WebApp

```bash
npm start
```

This will execute a webapp on: `http://locahost:PORT`.
