(function () {
  const CONTENT_KEY = "pankajPortfolioContent";
  const DB_NAME = "pankajPortfolioMedia";
  const STORE_NAME = "videos";

  const defaultContent = {
    hero: {
      name: "Pankaj'S",
      title: "PORTFOLIO",
      subtitle: "Unleash Your Viral Potential With Pro Video Editing",
      description: "I transform raw footage into captivating content that gets seen, shared, and loved. Take your channel to the next level with our expert editing magic."
    },
    about: {
      heading: "About Me",
      video: "assets/PankuVID.mp4",
      description: "I specialize in turning raw footage into compelling short stories — focusing on pacing, transitions, color grading and emotional beats. I produce social-ready edits and cinematic shorts that help creators & brands stand out."
    },
    stats: [
      { value: "10+", label: "Projects Completed" },
      { value: "5+", label: "Happy Clients" },
      { value: "10k", label: "Total Views" }
    ],
    projects: {
      heading: "My Recent Edits",
      description: "We imagine and build experiences, products and businesses that disrupt the status quo, win hearts and realize the future. Explore how we work."
    },
    contact: {
      heading: "Let's Create Something Cinematic",
      description: "Reels, promos, travel edits, or brand videos — I handle editing, color grading, and final delivery. Let's bring your vision to life!",
      instagram: "https://www.instagram.com/wssup_panku/",
      email: "panki23@gmail.com",
      footer: "© 2025 Pankaj (@wassup_panku) — Cinematic Video Editor",
      tagline: "Transforming raw footage into viral content"
    },
    reels: [
      { id: "reel-1", title: "Panku intro", category: "Featured", src: "assets/PankuVID.mp4", featured: true },
      { id: "reel-2", title: "About me", category: "Featured", src: "assets/AboutMEPnak.mp4", featured: true },
      { id: "reel-3", title: "Client edit", category: "Client work", src: "assets/client.mp4", featured: true },
      { id: "reel-4", title: "Ajat reel", category: "Featured", src: "assets/Ajat.mp4", featured: true },
      { id: "reel-5", title: "Vickyy reel", category: "Featured", src: "assets/Vickyy.mp4", featured: true },
      { id: "reel-6", title: "DSA reel", category: "Featured", src: "assets/dsa.mp4", featured: true },
      { id: "reel-7", title: "Pri reel", category: "Featured", src: "assets/pri.mp4", featured: true }
    ]
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadContent() {
    try {
      const stored = JSON.parse(localStorage.getItem(CONTENT_KEY));
      if (!stored) return clone(defaultContent);
      return {
        ...clone(defaultContent),
        ...stored,
        hero: { ...defaultContent.hero, ...(stored.hero || {}) },
        about: { ...defaultContent.about, ...(stored.about || {}) },
        projects: { ...defaultContent.projects, ...(stored.projects || {}) },
        contact: { ...defaultContent.contact, ...(stored.contact || {}) },
        stats: Array.isArray(stored.stats) ? stored.stats : clone(defaultContent.stats),
        reels: Array.isArray(stored.reels) ? stored.reels : clone(defaultContent.reels)
      };
    } catch (error) {
      console.warn("Could not load saved portfolio content.", error);
      return clone(defaultContent);
    }
  }

  function saveContent(content) {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
    window.dispatchEvent(new CustomEvent("portfolio-content-updated"));
  }

  function openMediaDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function saveMedia(id, file) {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put(file, id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async function getMedia(id) {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME).objectStore(STORE_NAME).get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async function deleteMedia(id) {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).delete(id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async function resolveMediaSource(src) {
    if (!src || !src.startsWith("indexeddb:")) return src;
    const blob = await getMedia(src.slice("indexeddb:".length));
    return blob ? URL.createObjectURL(blob) : "";
  }

  window.PortfolioData = {
    defaultContent,
    loadContent,
    saveContent,
    saveMedia,
    deleteMedia,
    resolveMediaSource
  };
})();