# 🗄️ System Repositories & Engineering Logs

[![Live Deployment](https://img.shields.io/badge/Live_Deployment-Operational-27c93f?style=for-the-badge)](https://oluwafemi00.github.io/my-project-portfolio/)
[![Architecture](https://img.shields.io/badge/Architecture-Vanilla_JS-c5a059?style=for-the-badge)]()
[![Performance](https://img.shields.io/badge/Lighthouse-91%25-success?style=for-the-badge)]()

A dynamic GitHub project hub and engineering log system built entirely with **Vanilla JavaScript and native browser APIs.**

Instead of hardcoding projects or using a static site generator, this system pulls live repository data directly from GitHub and renders it dynamically in the browser.

The goal was simple:

**One source of truth — GitHub.**

Whenever I update a repository, the portfolio updates automatically.

No duplication.
No manual edits.

Just the platform.

---

## Architecture

This system was built to avoid heavy frameworks and static-site tooling. Everything runs directly in the browser with minimal dependencies.

It serves as both:

- A live project hub
- A technical documentation system
- A performance-focused frontend architecture

The focus was on **speed, simplicity, and control.**

---

## Core Systems

### Live Repository Data

The portfolio connects directly to the GitHub API and renders repositories dynamically when the page loads.

This keeps everything synchronized automatically without maintaining multiple project lists.

---

### Rate Limit Fallback System

GitHub limits unauthenticated API requests to **60 requests per hour per IP address.**

If that limit is reached, GitHub returns a `403` response which can appear as a CORS error in the browser.

Instead of letting the interface break, the system detects the failure and switches to a controlled **[SYSTEM WARNING]** state.

This keeps the user experience stable even when the API is unavailable.

---

### Dynamic Engineering Logs

Engineering logs are written in Markdown and loaded dynamically.

The browser fetches raw `.md` files and converts them into styled HTML documents on demand.

This makes it easy to add new logs without rebuilding the site.

---

### Stable Layout Rendering

Dynamic content containers use strict `min-height` reservations to prevent layout shifting while data loads.

This keeps the interface visually stable during asynchronous operations.

Cumulative Layout Shift (CLS) is kept at **0.00**.

---

## 📊 Performance Metrics

This system was designed to respect the **Critical Rendering Path** and minimize main thread work.

Performance was a core requirement from the beginning.

- **Total Blocking Time:** `10ms`
- **Cumulative Layout Shift:** `0.00`
- **Lighthouse Mobile Score:** `91 / 100`

---

## 💻 Tech Stack

**Structure**

- HTML5

**Styling**

- CSS3
- CSS Variables
- Bento-style layout

**Logic**

- Vanilla JavaScript (ES6+)
- Async/Await
- Fetch API
- Event Delegation

**Parsing**

- Marked.js (Deferred Loading)
