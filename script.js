// 1. Theme Toggle Logic
const btn = document.querySelector("#theme-toggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark") {
  document.body.classList.add("dark-theme");
}

btn.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  let theme = "light";
  if (document.body.classList.contains("dark-theme")) {
    theme = "dark";
  }
  localStorage.setItem("theme", theme);
});

// 2. GitHub API Integration
async function fetchRepos(username) {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated`,
  );
  const repos = await response.json();
  const container = document.getElementById("repo-container");

  container.innerHTML = repos
    .slice(0, repos.length)
    .map(
      (repo) => `
    <div class="repo-card">
        <div>
            <h3>${repo.name}</h3>
            <p>${repo.description || "No description provided for this awesome project."}</p>
        </div>
        <a href="${repo.html_url}" class="repo-link" target="_blank">Explore Source Code→</a>
    </div>
`,
    )
    .join("");
}

// 3. Simple Markdown Loader
async function loadBlogPost(fileName) {
  const response = await fetch(`./posts/${fileName}.md`);
  const text = await response.text();
  document.getElementById("blog-content").innerHTML = marked.parse(text);
}

// Initialize
fetchRepos("Oluwafemi00");

// 1. Your "Database" of posts
const blogPosts = [
  {
    title: "Building a Vanilla JS Portfolio",
    date: "2026-02-17",
    file: "post1",
  },
];

const blogContainer = document.getElementById("blog-content");

// 2. Function to display the list of all posts
function renderPostList() {
  const listHTML = blogPosts
    .map(
      (post) => `
        <div class="blog-item " onclick="loadBlogPost('${post.file}')">
            <span>${post.date}</span>
            <h3>${post.title}</h3>
            <p>Read more →</p>
        </div>
    `,
    )
    .join("");

  blogContainer.innerHTML = `<div class="blog-grid">${listHTML}</div>`;
}

// 3. Function to fetch and show a single post
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
            <button onclick="renderPostList()" class="back-btn">← Back to Blog</button>
        `;
  } catch (err) {
    blogContainer.innerHTML = `<p>Error loading post: ${err.message}</p>`;
  }
}

// Initialize the list on page load
renderPostList();

window.onscroll = function () {
  updateProgressBar();
};

function updateProgressBar() {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  // Calculate percentage
  const scrolled = (winScroll / height) * 100;

  // Update the width of the bar
  document.getElementById("progress-bar").style.width = scrolled + "%";
}

const contactForm = document.getElementById("contact-form");
const status = document.getElementById("form-status");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Stop page reload
  const data = new FormData(e.target);

  status.innerHTML = "Sending...";

  const response = await fetch(e.target.action, {
    method: contactForm.method,
    body: data,
    headers: { Accept: "application/json" },
  });

  if (response.ok) {
    status.innerHTML = "Thanks! Your message has been sent.";
    contactForm.reset();
  } else {
    status.innerHTML = "Oops! There was a problem submitting your form.";
  }
});
