// ==========================================
// 1. CRITICAL UI (Runs Immediately, Optimized for 60fps)
// ==========================================
const dot = document.querySelector(".cursor-dot");
const outline = document.querySelector(".cursor-outline");
const progress = document.getElementById("progress-bar");

// Optimize Mouse Tracking with requestAnimationFrame
let isCursorTicking = false;
window.addEventListener(
  "mousemove",
  (e) => {
    if (!dot || !outline) return;

    if (!isCursorTicking) {
      window.requestAnimationFrame(() => {
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
        isCursorTicking = false;
      });
      isCursorTicking = true;
    }
  },
  { passive: true },
);

document.addEventListener("mouseleave", () => {
  if (dot) dot.style.opacity = "0";
  if (outline) outline.style.opacity = "0";
});

// Optimize Scroll Tracking with requestAnimationFrame
let isScrollTicking = false;
window.addEventListener(
  "scroll",
  () => {
    if (!isScrollTicking) {
      window.requestAnimationFrame(() => {
        const scrolled =
          (window.scrollY /
            (document.documentElement.scrollHeight - window.innerHeight)) *
          100;
        if (progress) progress.style.width = `${scrolled}%`;
        isScrollTicking = false;
      });
      isScrollTicking = true;
    }
  },
  { passive: true },
);

// ==========================================
// 2. NON-CRITICAL SYSTEMS (Deferred to drop TBT)
// ==========================================
window.addEventListener("load", () => {
  // --- Magnetic Button Effect ---
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

  // --- GitHub API Integration ---
  async function fetchRepos(username) {
    const container = document.getElementById("repo-container");
    if (!container) return;

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
      if (!response.ok) throw new Error("Failed to connect to GitHub Gateway.");

      const repos = await response.json();

      // Filter to only show actual projects if needed, or slice array
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

      applyMagneticEffect(); // Re-bind magnetic effect to dynamically injected elements
    } catch (error) {
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

  // --- Engineering Logs (Markdown Blog) ---
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

  window.renderPostList = function () {
    if (!blogContainer) return;
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
  };

  window.loadBlogPost = async function (fileName) {
    if (!blogContainer) return;
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
                    <button onclick="renderPostList()" class="btn-back" style="margin-top: 2rem;"><i class="fas fa-arrow-left"></i> Return to Logs</button>
                </div>
            `;
    } catch (err) {
      blogContainer.innerHTML = `<p style="color: #ff5f56;">[ERROR] ${err.message}</p>`;
    }
  };

  // --- Form Transmission Logic ---
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

  // --- Mobile Menu Logic ---
  const menuTrigger = document.getElementById("mobile-menu-trigger");
  const navMenu = document.querySelector(".nav-menu");

  if (menuTrigger && navMenu) {
    menuTrigger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      const spans = menuTrigger.querySelectorAll("span");
      const isActive = navMenu.classList.contains("active");

      if (spans.length === 3) {
        spans[0].style.transform = isActive
          ? "rotate(45deg) translate(5px, 6px)"
          : "none";
        spans[1].style.opacity = isActive ? "0" : "1";
        spans[2].style.transform = isActive
          ? "rotate(-45deg) translate(5px, -6px)"
          : "none";
      }
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        const spans = menuTrigger.querySelectorAll("span");
        spans.forEach((span) => {
          span.style.transform = "none";
          span.style.opacity = "1";
        });
      });
    });
  }

  // --- Initialize Data Feeds ---
  fetchRepos("Oluwafemi00");
  renderPostList();
  applyMagneticEffect();
});
