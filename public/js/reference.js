// REFERENCE – galerie projektů + lightbox + postupné načítání (blocks/reference.html)
//
// Řešení bez závislostí:
//   [data-gallery]   … hlavní obrázek + pás náhledů, poslední dlaždice „+ N dalších“
//   [data-reveal]    … postupné zobrazování projektů po kliknutí na tlačítko
//   .reference-lightbox … jeden sdílený <dialog> pro všechny galerie na stránce
//
// Počet náhledů v pásu určuje CSS (--gallery-thumbs), JS ho jen čte – díky tomu

(() => {

  /* ==========================================================================
     LIGHTBOX (společný pro všechny galerie)
     ========================================================================== */
  const lightbox = document.querySelector(".reference-lightbox");
  const lightboxImage = lightbox?.querySelector(".reference-lightbox-image");
  const lightboxCaption = lightbox?.querySelector(".reference-lightbox-caption");
  const lightboxCounter = lightbox?.querySelector(".reference-lightbox-counter");

  // galerie, ze které je lightbox právě otevřený
  let source = null;

  function renderLightbox() {
    if (!source) return;

    const image = source.images[source.index];
    lightboxImage.src = image.dataset.full || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.dataset.caption || image.alt;
    lightboxCounter.textContent = `${source.index + 1} / ${source.images.length}`;
  }

  function openLightbox(gallery, index) {
    if (!lightbox) return;

    source = gallery;
    source.select(index);
    renderLightbox();
    lightbox.showModal();
  }

  function stepLightbox(direction) {
    if (!source) return;
    source.select(source.index + direction);
    renderLightbox();
  }

  if (lightbox) {
    lightbox.querySelector(".reference-lightbox-prev")?.addEventListener("click", () => stepLightbox(-1));
    lightbox.querySelector(".reference-lightbox-next")?.addEventListener("click", () => stepLightbox(1));
    lightbox.querySelector(".reference-lightbox-close")?.addEventListener("click", () => lightbox.close());

    // zavření kliknutím mimo obrázek
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });

    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepLightbox(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        stepLightbox(1);
      }
    });

    lightbox.addEventListener("close", () => { source = null; });
  }

  /* ==========================================================================
     GALERIE
     ========================================================================== */
  function initGallery(root) {
    if (root.dataset.galleryReady) return;
    root.dataset.galleryReady = "true";

    const stageImage = root.querySelector(".gallery-image");
    const thumbsList = root.querySelector(".gallery-thumbs");
    const thumbs = [...root.querySelectorAll(".gallery-thumb")];
    const images = thumbs.map((thumb) => thumb.querySelector("img"));
    const moreItem = root.querySelector(".gallery-more");
    const moreCount = moreItem?.querySelector(".gallery-more-count");
    if (!stageImage || !thumbs.length) return;

    const gallery = { images, index: 0, select };

    function select(next) {
      const count = images.length;
      gallery.index = ((next % count) + count) % count;

      const image = images[gallery.index];
      stageImage.src = image.dataset.full || image.src;
      stageImage.alt = image.alt;

      thumbs.forEach((thumb, i) => {
        thumb.setAttribute("aria-current", String(i === gallery.index));
      });
    }

    /* # Kolik náhledů se do pásu vejde – hodnotu drží CSS */
    function layoutThumbs() {
      const columns = parseInt(getComputedStyle(thumbsList).getPropertyValue("--gallery-thumbs"), 10) || 4;
      // poslední dlaždice patří odkazu „+ N dalších“ (pokud je co skrývat)
      const visible = thumbs.length > columns ? columns - 1 : thumbs.length;
      const hidden = thumbs.length - visible;

      thumbs.forEach((thumb, i) => {
        thumb.closest("li").hidden = i >= visible;
      });

      if (moreItem) {
        moreItem.hidden = hidden === 0;
        // skloňování: 1–4 „další“, 5 a více „dalších“
        if (moreCount) moreCount.textContent = `+ ${hidden} ${hidden < 5 ? "další" : "dalších"}`;
      }
    }

    /* # Ovládání */
    root.querySelector(".gallery-nav--prev")?.addEventListener("click", () => select(gallery.index - 1));
    root.querySelector(".gallery-nav--next")?.addEventListener("click", () => select(gallery.index + 1));

    thumbsList.addEventListener("click", (event) => {
      const thumb = event.target.closest(".gallery-thumb");
      if (thumb) select(thumbs.indexOf(thumb));
    });

    root.querySelector(".gallery-zoom")?.addEventListener("click", () => openLightbox(gallery, gallery.index));

    // „+ N dalších“ otevře lightbox na prvním skrytém obrázku
    moreItem?.querySelector("button")?.addEventListener("click", () => {
      const columns = parseInt(getComputedStyle(thumbsList).getPropertyValue("--gallery-thumbs"), 10) || 4;
      openLightbox(gallery, Math.max(0, Math.min(columns - 1, images.length - 1)));
    });

    // dvojklik/klik na hlavní obrázek otevře lightbox
    root.querySelector(".gallery-stage-btn")?.addEventListener("click", () => openLightbox(gallery, gallery.index));

    if ("ResizeObserver" in window) {
      new ResizeObserver(layoutThumbs).observe(thumbsList);
    } else {
      window.addEventListener("resize", layoutThumbs);
    }

    layoutThumbs();
    select(0);
  }


  /* ==========================================================================
     POSTUPNÉ ZOBRAZOVÁNÍ PROJEKTŮ
     ========================================================================== */
  function initReveal(root) {
    if (root.dataset.revealReady) return;
    root.dataset.revealReady = "true";

    const step = parseInt(root.dataset.revealStep, 10) || 5;
    const button = document.getElementById(root.dataset.revealButton);
    const items = [...root.children];
    if (!button) return;

    function update() {
      const hidden = items.filter((item) => item.hidden);
      button.hidden = hidden.length === 0;
      const count = button.querySelector(".reference-more-count");
      if (count) count.textContent = hidden.length ? `(${hidden.length})` : "";
    }

    button.addEventListener("click", () => {
      const revealed = items.filter((item) => item.hidden).slice(0, step);
      revealed.forEach((item) => {
        item.hidden = false;
        // galerie se inicializuje až když je prvek v layoutu (kvůli měření pásu náhledů)
        item.querySelectorAll("[data-gallery]").forEach(initGallery);
      });

      update();

      // po doplnění přesuneme focus na první nový projekt
      const heading = revealed[0]?.querySelector(".project-title");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    });

    update();
  }


  document.querySelectorAll("[data-gallery]").forEach((root) => {
    if (!root.closest("[hidden]")) initGallery(root);
  });

  document.querySelectorAll("[data-reveal]").forEach(initReveal);

})();
