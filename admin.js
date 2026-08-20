(function () {
  const data = PortfolioData;
  let content = data.loadContent();
  let editingId = null;
  const $ = (selector) => document.querySelector(selector);
  const notice = $("#notice");

  function showNotice(message, type = "success") {
    notice.textContent = message;
    notice.className = `notice visible ${type}`;
    setTimeout(() => notice.classList.remove("visible"), 3000);
  }

  function setFormValues(form, values) {
    Object.entries(values).forEach(([name, value]) => {
      const field = form.elements[name];
      if (field) field.value = value || "";
    });
  }

  function renderBrand() {
    setFormValues($("#brand-form"), {
      heroName: content.hero.name, heroTitle: content.hero.title, heroSubtitle: content.hero.subtitle,
      heroDescription: content.hero.description, aboutHeading: content.about.heading,
      aboutVideo: content.about.video, aboutDescription: content.about.description
    });
  }

  function renderStats() {
    $("#stats-form").innerHTML = content.stats.map((stat, index) => `
      <label><span>Stat ${index + 1} value</span><input name="value-${index}" value="${escapeAttr(stat.value)}" required></label>
      <label><span>Stat ${index + 1} label</span><input name="label-${index}" value="${escapeAttr(stat.label)}" required></label>
    `).join("");
  }

  function renderContact() {
    setFormValues($("#contact-form"), content.contact);
  }

  function renderReels() {
    $("#reel-count").textContent = content.reels.length;
    $("#reel-list").innerHTML = content.reels.map((reel, index) => `
      <article class="reel-row" data-id="${reel.id}">
        <div class="reel-order">${String(index + 1).padStart(2, "0")}</div>
        <div class="reel-info"><strong>${escapeHtml(reel.title)}</strong><span>${escapeHtml(reel.category)} · ${reel.featured ? "Featured" : "Library only"}</span></div>
        <div class="row-actions">
          <button class="icon-button" data-action="up" ${index === 0 ? "disabled" : ""}>↑</button>
          <button class="icon-button" data-action="down" ${index === content.reels.length - 1 ? "disabled" : ""}>↓</button>
          <button class="text-button" data-action="edit">Edit</button>
          <button class="text-button danger" data-action="delete">Delete</button>
        </div>
      </article>
    `).join("") || '<p class="empty-state">No reels yet. Add your first edit above.</p>';
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  }
  function escapeAttr(value) { return escapeHtml(value); }

  $("#brand-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    content.hero = { name: form.get("heroName"), title: form.get("heroTitle"), subtitle: form.get("heroSubtitle"), description: form.get("heroDescription") };
    content.about = { heading: form.get("aboutHeading"), video: form.get("aboutVideo"), description: form.get("aboutDescription") };
    data.saveContent(content); showNotice("Brand story saved.");
  });
  $("#stats-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    content.stats = content.stats.map((_, index) => ({ value: form.get(`value-${index}`), label: form.get(`label-${index}`) }));
    data.saveContent(content); showNotice("Stats saved.");
  });
  $("#contact-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    content.contact = Object.fromEntries(["heading", "description", "instagram", "email", "footer", "tagline"].map((key) => [key, form.get(key)]));
    data.saveContent(content); showNotice("Contact details saved.");
  });

  $("#reel-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get("title").trim(), category = form.get("category").trim();
    let src = form.get("src").trim();
    const file = form.get("file");
    const id = editingId || `reel-${Date.now()}`;
    if (file && file.size) {
      await data.saveMedia(id, file);
      src = `indexeddb:${id}`;
    }
    const reel = { id, title, category, src, featured: form.get("featured") === "on" };
    const existingIndex = content.reels.findIndex((item) => item.id === id);
    if (existingIndex === -1) content.reels.push(reel); else content.reels[existingIndex] = reel;
    data.saveContent(content);
    event.currentTarget.reset(); editingId = null; $("#reel-submit").textContent = "Add reel";
    renderReels(); showNotice(existingIndex === -1 ? "Reel added to your library." : "Reel updated.");
  });
  $("#reel-cancel").addEventListener("click", () => {
    editingId = null; $("#reel-form").reset(); $("#reel-submit").textContent = "Add reel";
  });
  $("#reel-list").addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const row = button.closest("[data-id]"), id = row.dataset.id;
    const index = content.reels.findIndex((item) => item.id === id);
    if (button.dataset.action === "delete") {
      if (!confirm("Delete this reel from your portfolio?")) return;
      const reel = content.reels[index]; content.reels.splice(index, 1);
      if (reel.src.startsWith("indexeddb:")) await data.deleteMedia(reel.src.slice(9));
      data.saveContent(content); renderReels(); showNotice("Reel deleted.");
    }
    if (button.dataset.action === "edit") {
      const reel = content.reels[index]; editingId = id;
      setFormValues($("#reel-form"), reel); $("#reel-form").elements.featured.checked = reel.featured;
      $("#reel-submit").textContent = "Update reel"; $("#reel-form").scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (button.dataset.action === "up" && index > 0) [content.reels[index - 1], content.reels[index]] = [content.reels[index], content.reels[index - 1]];
    if (button.dataset.action === "down" && index < content.reels.length - 1) [content.reels[index + 1], content.reels[index]] = [content.reels[index], content.reels[index + 1]];
    if (["up", "down"].includes(button.dataset.action)) { data.saveContent(content); renderReels(); }
  });
  $("#reset-reels").addEventListener("click", () => {
    if (!confirm("Restore the original reel list?")) return;
    content.reels = JSON.parse(JSON.stringify(data.defaultContent.reels)); data.saveContent(content); renderReels(); showNotice("Default reels restored.");
  });
  $("#export-content").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "pankaj-portfolio-backup.json"; link.click(); URL.revokeObjectURL(link.href);
  });
  $("#reset-content").addEventListener("click", () => {
    if (!confirm("Reset all portfolio content to the original defaults?")) return;
    content = JSON.parse(JSON.stringify(data.defaultContent)); data.saveContent(content);
    renderBrand(); renderStats(); renderContact(); renderReels(); showNotice("All content reset.");
  });
  document.querySelectorAll(".save-button").forEach((button) => {
    button.addEventListener("click", (event) => event.currentTarget.closest("section").querySelector("form").requestSubmit());
  });
  renderBrand(); renderStats(); renderContact(); renderReels();
})();