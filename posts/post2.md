# Engineering Log 02: Architecting a Dynamic GitHub Hub

When building a developer portfolio, the standard approach is to use a static site generator or a default GitHub Pages theme. However, as a systems engineer, I wanted absolute control over the Document Object Model (DOM) and the Critical Rendering Path.

Instead of hardcoding my projects, I built a dynamic hub that acts as a real-time telemetry dashboard, pulling live repository data directly from the GitHub REST API.

> **Architect's Note:** Relying on heavy frontend frameworks like React for a simple data-fetching application introduces unnecessary JavaScript bloat. By utilizing Vanilla JS, we achieve a much faster Time to Interactive (TTI).

## The Infrastructure

To maintain a zero-dependency architecture (with the exception of the Markdown parser), the system is broken down into native web components:

| Component         | Technology         | Primary Function                                |
| :---------------- | :----------------- | :---------------------------------------------- |
| **Data Layer**    | GitHub API v3      | Fetches live repository metadata and URLs.      |
| **DOM Engine**    | Vanilla JS (ES6+)  | Dynamically injects HTML via Template Literals. |
| **Layout**        | CSS Grid / Flexbox | Renders the responsive "Bento Box" UI.          |
| **Documentation** | Marked.js          | Parses `.md` files into readable HTML logs.     |

## Handling the "Phantom CORS" Error

One of the most interesting architectural challenges of using the public GitHub API on a frontend application is the strict rate limiting. Unauthenticated requests are capped at **60 per hour per IP address**.

If you hit this limit, GitHub blocks the request with a `403 Forbidden` status. Because GitHub does not attach CORS headers to its error pages, the browser misinterprets this as a CORS violation.

To solve this, I implemented a **Graceful Fallback UI** circuit breaker:

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

    // Intercept rate limiting before the browser flags a CORS error
    if (response.status === 403 || response.status === 429) {
      throw new Error("GitHub API rate limit exceeded. Data stream paused.");
    }

    const repos = await response.json();
    renderBentoGrid(repos);
  } catch (error) {
    // Trigger Fallback UI
    renderSystemWarning(error.message);
  }
}
```

By anticipating the failure state, the system catches the `403` error and immediately swaps the repository grid for a branded `[SYSTEM_WARNING]` card, ensuring the user experience remains elite even when the API is cooling down.

## Conclusion

Building your own API-driven project site forces you to think about edge cases, asynchronous data streams, and raw CSS architecture. It is no longer just a website; it is a scalable system.

Check out the source code for this specific setup in [my repositories](https://github.com/Oluwafemi00/my-project-portfolio/).
