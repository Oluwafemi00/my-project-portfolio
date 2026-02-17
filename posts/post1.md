# Building a High-Performance Portfolio with Vanilla JavaScript

**Date:** February 17, 2026  
**Read Time:** 5 mins  
**Tags:** #JavaScript #WebDev #Performance #Portfolio

In a world dominated by React, Vue, and Next.js, it’s easy to forget the power of "The Platform." For my latest portfolio update, I decided to strip everything back and build using **Vanilla JavaScript**.

As a developer working with the full stack (Node.js, Express, and PostgreSQL), I wanted to prove that I could handle the frontend with the same precision and efficiency I bring to the backend. In this post, I’ll walk through why I chose this path and how I handled modularity without a framework.

---

## Why Vanilla JS?

While I love the ecosystem of React, building with plain JS offers several advantages:

- **Zero Dependencies:** No `node_modules` bloat or security vulnerabilities from obscure packages.
- **Lightning Fast Load Times:** Minimal bundle size means a near-perfect Lighthouse score and better SEO.
- **Mastering the Fundamentals:** It forced me to dive deep into the DOM API and asynchronous operations.

---

## The Technical Breakdown

### 1. The Component Pattern & The DOM

Even without a framework, I wanted my code to be modular. I used a functional approach to render UI components dynamically by manipulating the Document Object Model.

```javascript
// A simple reusable grid-content component
container.innerHTML = repos
  .slice(0, 10)
  .map(
    (repo) => `
    <div class="repo-card">
        <div>
            <h3>${repo.name}</h3>
            <p>${repo.description || "No description provided for this awesome project."}</p>
        </div>
        <a href="${repo.html_url}" class="repo-link" target="_blank">Explore Source →</a>
    </div>
`,
  )
  .join("");
```

## 2. Fetching Data with RESTful APIs

Since I’m used to building APIs with Node.js and Express, I set up a simple `fetch` call to pull my project data from my database. This keeps the portfolio dynamic without hardcoding every single project card.

### JavaScript

```javascript
async function loadBlogPost(fileName) {
  try {
    const response = await fetch(`./posts/${fileName}.md`);
    if (!response.ok) throw new Error("Post not found");

    const text = await response.text();

    // Add a "Back" button and the parsed Markdown
    blogContainer.innerHTML = `
            <button onclick="renderPostList()" class="back-btn">← Back to Blog</button>
            <article class="markdown-body">
                ${marked.parse(text)}
            </article>
        `;
  } catch (err) {
    blogContainer.innerHTML = `<p>Error loading post: ${err.message}</p>`;
  }
}
```

---

## Lessons Learned

Building this way reminded me that browsers are incredibly capable. Many features we reach for libraries to solve (like routing, animations, and fetching data) are now built-in and highly optimized.

---

## Key Takeaways

### 🚀 Performance Matters

My site now scores **100/100 on Google PageSpeed Insights**.

### 🏛 Fundamentals Are Forever

Frameworks change every few years, but the DOM is here to stay.

### ⚡ Efficiency Over Hype

You don't always need 50kb of JavaScript to show a beautiful list of projects.
