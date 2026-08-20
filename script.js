/* --------------------------------------------------
   FORCE ENABLE SCROLLING ON PAGE LOAD
-------------------------------------------------- */
window.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    console.log('Scroll enabled on page load');
});

/* --------------------------------------------------
   MOBILE MENU TOGGLE
-------------------------------------------------- */
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

// Toggle mobile menu
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        const isActive = mobileMenuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = isActive ? 'hidden' : 'auto';
    });
}

// Close menu when clicking a link
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('active') && 
        !mobileMenu.contains(e.target) && 
        !mobileMenuToggle.contains(e.target)) {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

/* --------------------------------------------------
   ABOUT VIDEO CARD - HOVER TO PLAY
-------------------------------------------------- */
const aboutVideo = document.querySelector(".about-video");
const aboutVideoCard = document.querySelector(".about-video-card");

if (aboutVideo && aboutVideoCard) {
    aboutVideo.muted = true;
    
    aboutVideoCard.addEventListener("mouseenter", () => {
        aboutVideo.play().catch(err => console.log("Play error:", err));
    });
    
    aboutVideoCard.addEventListener("mouseleave", () => {
        aboutVideo.pause();
        aboutVideo.currentTime = 0;
    });
    
    // Click to play/pause with sound
    aboutVideoCard.addEventListener("click", () => {
        if (aboutVideo.paused) {
            aboutVideo.muted = false;
            aboutVideo.volume = 0.8;
            aboutVideo.play();
        } else {
            aboutVideo.pause();
        }
    });
}

/* --------------------------------------------------
   AUDIO UNLOCK FOR OTHER VIDEOS
-------------------------------------------------- */
let audioUnlocked = false;

document.addEventListener("click", () => {
    audioUnlocked = true;
}, { once: true }); // Only run once

/* --------------------------------------------------
   HOVER VIDEO PLAY FOR RECENT EDITS (WITH SOUND)
-------------------------------------------------- */
document.querySelectorAll(".recent-item video").forEach(video => {
    video.muted = true;

    video.addEventListener("mouseenter", () => {
        video.currentTime = 0;
        video.play().catch(err => console.log("Play error:", err));
        
        if (audioUnlocked) {
            video.muted = false;
            video.volume = 0.7;
        }
    });

    video.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;
        video.muted = true;
    });
});

/* --------------------------------------------------
   HOVER VIDEO PLAY FOR REEL SLIDER (WITH SOUND)
-------------------------------------------------- */
document.querySelectorAll(".slider video").forEach(video => {
    video.muted = true;

    video.addEventListener("mouseenter", () => {
        video.currentTime = 0;
        video.play().catch(err => console.log("Play error:", err));
        
        if (audioUnlocked) {
            video.muted = false;
            video.volume = 0.7;
        }
    });

    video.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;
        video.muted = true;
    });
});

/* --------------------------------------------------
   CURSOR GLOW
-------------------------------------------------- */
const glow = document.createElement("div");
glow.classList.add("cursor-glow");
document.body.appendChild(glow);

document.addEventListener("mousemove", e => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
});

/* --------------------------------------------------
   REVEAL ANIMATION
-------------------------------------------------- */
const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.05 });

revealEls.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "1s ease";
    revealObserver.observe(el);
});

/* --------------------------------------------------
   MAGNETIC BUTTONS
-------------------------------------------------- */
document.querySelectorAll(".btn, .cta-btn").forEach(btn => {
    btn.addEventListener("mousemove", e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0,0)";
    });
});

/* --------------------------------------------------
   3D TILT HERO TITLE
-------------------------------------------------- */
const heroTitle = document.querySelector(".main-title");

if (heroTitle) {
    document.addEventListener("mousemove", e => {
        const x = (window.innerWidth / 2 - e.clientX) / 60;
        const y = (window.innerHeight / 2 - e.clientY) / 60;
        heroTitle.style.transform = `rotateX(${y}deg) rotateY(${-x}deg)`;
    });
}

/* --------------------------------------------------
   SMOOTH PARALLAX ENGINE
-------------------------------------------------- */
const parallaxLayers = document.querySelectorAll(".parallax-layer");

if (parallaxLayers.length > 0) {
    document.addEventListener("mousemove", e => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        parallaxLayers.forEach(layer => {
            const depth = layer.getAttribute("data-depth");
            const moveX = x * depth * 20;
            const moveY = y * depth * 20;

            layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0px)`;
        });
    });
}

/* --------------------------------------------------
   PORTFOLIO CONTENT MANAGER
   The admin page saves content in the same browser origin.
-------------------------------------------------- */
(async function renderPortfolioContent() {
    if (!window.PortfolioData) return;
    const content = PortfolioData.loadContent();
    const get = (path) => path.split(".").reduce((value, key) => value && value[key], content);

    document.querySelectorAll("[data-content]").forEach((element) => {
        const value = get(element.dataset.content);
        if (value !== undefined) element.textContent = value;
    });
    document.querySelectorAll("[data-contact-link]").forEach((element) => {
        const type = element.dataset.contactLink;
        const value = content.contact[type];
        if (!value) return;
        element.href = type === "email" ? `mailto:${value}` : value;
        if (type === "email" && element.closest(".email-text")) element.textContent = value;
    });

    content.stats.forEach((stat, index) => {
        const value = document.querySelector(`[data-stat-value="${index}"]`);
        const label = document.querySelector(`[data-stat-label="${index}"]`);
        if (value) value.textContent = stat.value;
        if (label) label.textContent = stat.label;
    });

    const aboutVideo = document.querySelector("[data-video='about']");
    if (aboutVideo) aboutVideo.src = await PortfolioData.resolveMediaSource(content.about.video);

    const recentGrid = document.querySelector("#recent-grid");
    const slider = document.querySelector("#reel-slider");
    const recentReels = content.reels.slice(0, 3);
    const featuredReels = content.reels.filter((reel) => reel.featured);
    const videoMarkup = (reel, sliderMode = false) => {
        const classes = sliderMode ? "" : "class=\"portfolio-reel-video\"";
        return `<video ${classes} data-reel-id="${reel.id}" src="${reel.src}" muted playsinline loop preload="metadata" aria-label="${reel.title}"></video>`;
    };

    if (recentGrid) {
        recentGrid.innerHTML = recentReels.map((reel) => `<div class="recent-item" data-reel-card="${reel.id}">${videoMarkup(reel)}</div>`).join("");
    }
    if (slider) {
        slider.innerHTML = featuredReels.map((reel) => videoMarkup(reel, true)).join("");
    }

    const mediaVideos = [...document.querySelectorAll("[data-reel-id]")];
    await Promise.all(mediaVideos.map(async (video) => {
        const reel = content.reels.find((item) => item.id === video.dataset.reelId);
        if (reel) video.src = await PortfolioData.resolveMediaSource(reel.src);
    }));
    mediaVideos.forEach((video) => {
        video.addEventListener("mouseenter", () => video.play().catch(() => {}));
        video.addEventListener("mouseleave", () => { video.pause(); video.currentTime = 0; });
    });
})();
