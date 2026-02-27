# Engineering Log 02 — Architecting a Dynamic GitHub Hub

Most portfolio websites hardcode projects or use a static site generator.

I didn't want that.

As a backend-focused engineer, I wanted my portfolio to behave like a system, not just a collection of pages. Instead of manually listing projects, I built a dynamic GitHub hub that pulls live repository data directly from the GitHub REST API.

This turns the portfolio into a real-time project dashboard instead of a static website.

The goal was simple:

**One source of truth — GitHub.**

Every time I push a repository update, the portfolio reflects it automatically.
No manual edits required.

---

## Why a Dynamic System?

Hardcoding projects creates duplication.
You update GitHub.
Then update your portfolio.
Then update your README.
That is unnecessary friction.
By connecting directly to the GitHub API, the system stays synchronized automatically.
It also keeps the architecture clean and maintainable.
And most importantly, fast.

> A portfolio doesn't need a heavy frontend framework just to fetch data from an API.
> The browser is already powerful enough.

Vanilla JavaScript allowed me to build exactly what was needed without introducing unnecessary complexity.

---

## System Architecture

To keep the system lightweight, everything is built on native web technologies with almost zero dependencies.

| Component         | Technology         | Purpose                          |
| ----------------- | ------------------ | -------------------------------- |
| **Data Layer**    | GitHub API v3      | Fetches live repository data     |
| **DOM Engine**    | Vanilla JS         | Renders repositories dynamically |
| **Layout**        | CSS Grid / Flexbox | Responsive Bento-style layout    |
| **Documentation** | Marked.js          | Converts Markdown logs into HTML |

This structure keeps the system predictable and easy to extend.

No build tools.
No framework runtime.
No unnecessary abstraction.
Just the platform.

---

## Handling GitHub Rate Limits

One interesting problem with using the public GitHub API on a frontend application is rate limiting.

Unauthenticated requests are limited to **60 requests per hour per IP address.**

Once that limit is reached, GitHub returns a `403 Forbidden` response.

Because GitHub does not attach proper CORS headers to the error response, the browser can interpret it as a CORS failure.

Instead of letting the interface break, I designed a fallback system that detects the rate limit early and switches the UI into a controlled warning state.

```javascript
async function fetchRepos(username) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated`,
      {
        method: "GET",
        headers: { Accept: "application/vnd.github.v3+json" },
      },
    );

    if (response.status === 403 || response.status === 429) {
      throw new Error("GitHub API rate limit exceeded. Data stream paused.");
    }

    const repos = await response.json();

    renderBentoGrid(repos);
  } catch (error) {
    renderSystemWarning(error.message);
  }
}
```

Instead of showing a broken page, the system switches to a branded `[SYSTEM WARNING]` state while the API cools down.
The user experience remains stable even during failure conditions.

## Takeaways

Building this system reinforced something important:
A portfolio can be engineered like a real application.

It handles:

- External APIs
- Failure states
- Dynamic rendering
- Performance constraints

This is no longer just a personal website.
It is a small but complete system.
And the best part is that GitHub remains the single source of truth.
Whenever a repository changes, the portfolio updates automatically.
