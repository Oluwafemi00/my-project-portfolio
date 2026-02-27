// ==========================================
// 1. CURSOR & PROGRESS BAR SYSTEM
// ==========================================
const dot = document.querySelector(".cursor-dot");
const outline = document.querySelector(".cursor-outline");
const progress = document.getElementById("progress-bar");

// Always track mouse. CSS will hide the dots on touch devices.
window.addEventListener("mousemove", (e) => {
  if (!dot || !outline) return; // Failsafe

  // Make visible on first move
  dot.style.opacity = "1";
  outline.style.opacity = "1";

  // Direct position update
  dot.style.left = `${e.clientX}px`;
  dot.style.top = `${e.clientY}px`;

  // Smooth trailing animation
  outline.animate(
    { left: `${e.clientX}px`, top: `${e.clientY}px` },
    { duration: 400, fill: "forwards" },
  );
});

// Hide when cursor leaves the browser window
document.addEventListener("mouseleave", () => {
  if (dot) dot.style.opacity = "0";
  if (outline) outline.style.opacity = "0";
});

// Scroll Progress
window.addEventListener("scroll", () => {
  const scrolled =
    (window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight)) *
    100;
  if (progress) progress.style.width = `${scrolled}%`;
});

// ==========================================
// 2. GITHUB API INTEGRATION (With Rate Limit Handling)
// ==========================================
async function fetchRepos(username) {
  const container = document.getElementById("repo-container");
  try {
    // Explicitly requesting API v3 to ensure standard response headers
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    // Intercept rate limiting before it fails parsing
    if (response.status === 403 || response.status === 429) {
      throw new Error("GitHub API rate limit exceeded. Data stream paused.");
    }

    if (!response.ok) throw new Error("Failed to connect to GitHub Gateway.");

    const repos = await response.json();

    container.innerHTML = repos
      .map(
        (repo) => `
            <div class="bento-item">
                <div>
                    <span class="tag">Repository</span>
                    <h3>${repo.name}</h3>
                    <p>${repo.description || "Architectural component without description."}</p>
                </div>
                <a href="${repo.html_url}" class="repo-link magnetic" target="_blank">View Source →</a>
            </div>
        `,
      )
      .join("");

    if (typeof applyMagneticEffect === "function") applyMagneticEffect();
  } catch (error) {
    // Elite Fallback UI: What the user sees if the API blocks us
    container.innerHTML = `
            <div class="bento-item" style="border-color: #ff5f56; grid-column: 1 / -1;">
                <div>
                    <span class="tag" style="color: #ff5f56;">[SYSTEM_WARNING]</span>
                    <h3 style="color: #ff5f56;">Telemetry Paused</h3>
                    <p>${error.message.includes("rate limit") ? error.message : "CORS/Network error preventing live repository fetch."}</p>
                    <p style="font-size: 0.85rem;">While the API cools down, you can view my architecture directly on GitHub.</p>
                </div>
                <a href="https://github.com/${username}" class="btn-premium magnetic" target="_blank" style="align-self: flex-start; margin-top: 1rem; background: #ff5f56;">
                    Access GitHub Directly
                </a>
            </div>
        `;
  }
}

// ==========================================
// 3. ENGINEERING LOGS (Markdown Blog)
// ==========================================
const blogPosts = [
  {
    title: "Building a Vanilla JS Portfolio",
    date: "2026-02-17",
    file: "post1",
  },
  {
    title: "Building a Github Project Website",
    date: "2026-02-27",
    file: "post2",
  },
];
const blogContainer = document.getElementById("blog-content");

function renderPostList() {
  const listHTML = blogPosts
    .map(
      (post) => `
        <div class="bento-item" onclick="loadBlogPost('${post.file}')" style="cursor: pointer;">
            <div>
                <span class="tag">${post.date}</span>
                <h3>${post.title}</h3>
            </div>
            <p style="color: var(--accent); margin: 0; font-size: 0.8rem; text-transform: uppercase;">Read Protocol →</p>
        </div>
    `,
    )
    .join("");

  blogContainer.innerHTML = `<div class="bento-grid">${listHTML}</div>`;
}

async function loadBlogPost(fileName) {
  try {
    blogContainer.innerHTML = `<div class="terminal-loader">> decrypting_file...</div>`;
    const response = await fetch(`./posts/${fileName}.md`);
    if (!response.ok) throw new Error("File corrupted or missing.");

    const text = await response.text();

    blogContainer.innerHTML = `
            <div class="blog-article">
                <button onclick="renderPostList()" class="btn-back"><i class="fas fa-arrow-left"></i> Return to Logs</button>
                <div class="markdown-body">
                    ${marked.parse(text)}
                </div>
                <button onclick="renderPostList()" class="btn-back"><i class="fas fa-arrow-left"></i> Return to Logs</button>
            </div>
        `;
  } catch (err) {
    blogContainer.innerHTML = `<p style="color: #ff5f56;">[ERROR] ${err.message}</p>`;
  }
}

// ==========================================
// 4. INTERACTIONS & FORM
// ==========================================
function applyMagneticEffect() {
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.4}px)`;
    });
    el.addEventListener(
      "mouseleave",
      () => (el.style.transform = `translate(0, 0)`),
    );
  });
}

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector("button");
    btn.innerText = "TRANSMITTING...";
    btn.style.opacity = "0.5";
    btn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        contactForm.innerHTML = `<div class="success-state" style="text-align: center; padding: 4rem; border: 1px dashed var(--accent); border-radius: 16px;"><h3 class="italic-serif" style="font-size: 2rem;">Transmission Successful.</h3><p style="color: var(--text-dim);">I will review your inquiry shortly.</p></div>`;
      } else throw new Error();
    } catch (error) {
      btn.innerText = "TRANSMISSION_FAILED. RE-TRY?";
      btn.style.opacity = "1";
      btn.disabled = false;
    }
  });
}

// ==========================================
// 5. MOBILE MENU LOGIC
// ==========================================
const menuTrigger = document.getElementById("mobile-menu-trigger");
const navMenu = document.querySelector(".nav-menu");

if (menuTrigger && navMenu) {
  menuTrigger.addEventListener("click", () => {
    // Toggle the slide-out drawer
    navMenu.classList.toggle("active");

    // Morph the hamburger into an 'X'
    const spans = menuTrigger.querySelectorAll("span");
    const isActive = navMenu.classList.contains("active");

    spans[0].style.transform = isActive
      ? "rotate(45deg) translate(5px, 6px)"
      : "none";
    spans[1].style.opacity = isActive ? "0" : "1";
    spans[2].style.transform = isActive
      ? "rotate(-45deg) translate(5px, -6px)"
      : "none";
  });

  // Close menu smoothly when a link is clicked
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");

      // Reset hamburger icon
      const spans = menuTrigger.querySelectorAll("span");
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    });
  });
}

// Initialize Apps
fetchRepos("Oluwafemi00");
renderPostList();
applyMagneticEffect();
