# Engineering Log 01: Building a High-Performance Portfolio with Vanilla JS

**Date:** February 17, 2026  
**Read Time:** 5 mins

Most developers would reach for React or Next.js to build a portfolio.

I didn’t.

As a backend-focused engineer working with Node.js, Express, and PostgreSQL, I wanted my portfolio to reflect the same principles I apply on the server:

**Performance. Structure. Efficiency.**

So instead of using a framework or template, I built the entire frontend from scratch using **Vanilla JavaScript**.

This wasn't about avoiding frameworks, it was about being intentional.

I wanted a system that respects the browser, minimizes overhead, and loads fast.

This engineering log explains why I chose that path and how I structured the system without a framework.

---

## Why Vanilla JS?

Modern frameworks are powerful, but a portfolio site doesn't need an entire runtime just to render a few pages.
Vanilla JS gave me complete control over the architecture.

### Key Decisions

### Zero Dependencies

No node_modules.
No build pipeline.
No third-party packages breaking after updates.
Just the browser and the platform.

That means:

- Smaller footprint
- Faster load times
- Fewer failure points

---

### Respecting the Critical Rendering Path

Frameworks often ship large JavaScript bundles before the page becomes interactive.
I wanted the browser to paint immediately.
Minimal JavaScript means:

- Faster first paint
- Faster interaction
- Better real-world performance

---

### Engineering Discipline

Building without a framework forced me to think carefully about structure:

- How components render
- How data flows
- How scripts execute
- How the DOM updates efficiently

This is the same discipline required when designing backend systems.

> You don't need half a megabyte of JavaScript to render a portfolio.  
> Good engineering starts with using only what is necessary.

---

## Technical Breakdown

### 1. A Lightweight Component Pattern

Even without a framework, modularity matters.

Instead of static HTML pages, I built small rendering functions that generate UI components dynamically and inject them into the DOM.

```javascript
container.innerHTML = repos
  .map(
    (repo) => `
    <div class="bento-item">
        <div>
            <span class="tag">Repository</span>
            <h3>${repo.name}</h3>
            <p>${repo.description || "Architectural component without description."}</p>
        </div>
        <a href="${repo.html_url}" class="repo-link magnetic" target="_blank">
            View Source →
        </a>
    </div>
  `,
  )
  .join("");
```

### 2. Dynamic Engineering Logs (Markdown Loader)

Instead of using a static site generator like Jekyll or Hugo, I built a lightweight system to load Markdown files dynamically.

The browser fetches raw .md files and converts them into HTML on demand.

```javascript
async function loadBlogPost(fileName) {
  try {
    // 1. Trigger terminal loader UI
    blogContainer.innerHTML = `<div class="terminal-loader">> decrypting_file...</div>`;

    // 2. Fetch the raw Markdown payload
    const response = await fetch(`./posts/${fileName}.md`);
    if (!response.ok) throw new Error("File corrupted or missing.");

    const text = await response.text();

    // 3. Parse and inject into the DOM
    blogContainer.innerHTML = `
        <div class="blog-article">
            <button onclick="renderPostList()" class="btn-back">← Return to Logs</button>
            <div class="markdown-body">
                ${marked.parse(text)}
            </div>
        </div>
    `;
  } catch (err) {
    blogContainer.innerHTML = `<p style="color: #ff5f56;">[ERROR] ${err.message}</p>`;
  }
}
```

**This gives me:**

- Dynamic content without a backend
- Clean architecture
- Easy updates
- No static-site tooling

## System Telemetry & Takeaways

Modern browsers are already powerful execution environments.

Routing, network requests, DOM observation, and rendering are all built into the platform.
You don’t always need extra layers.
Sometimes the best architecture is the simplest one.

### Performance is a Feature

By yielding the main thread and deferring non-critical scripts, this architecture achieved a **98/100 Performance, 100/100 Best Practices, and 100/100 SEO** score on Google Lighthouse mobile audits.

### Fundamentals Are Forever

Frameworks change.
The web platform doesn't.
The DOM, the network model, and CSS fundamentals will always matter.
And as an engineer, understanding those layers is a long-term advantage.
