// GALERIE – hlavní obrázek + pás náhledů + společný lightbox
//
// Sdílená komponenta (styly v partials/components.css). Používá reference (galerie
// u projektů) i detail aktuality; funguje pro libovolný počet galerií na stránce.
//
// Markup:
//   [data-cg-gallery]          … obal s .cg-gallery-stage a .cg-gallery-thumbs
//   .cg-lightbox       … jeden <dialog> na stránku, sdílený všemi galeriemi
//
// Počet náhledů v pásu určuje CSS (--cg-gallery-thumbs), JS ho jen čte – dlaždice
// „+ N dalších" se doplní sama podle toho, kolik se jich nevejde.
//
// Galerii, která se do stránky dostane až později (např. po rozbalení dalších
// projektů), lze doinicializovat přes window.cgInitGallery(element).
(() => {

  /* ==========================================================================
     LIGHTBOX (společný pro všechny galerie)
     ========================================================================== */
  const lightbox = document.querySelector(".cg-lightbox");
  const lightboxImage = lightbox?.querySelector(".cg-lightbox-image");
  const lightboxCaption = lightbox?.querySelector(".cg-lightbox-caption");
  const lightboxCounter = lightbox?.querySelector(".cg-lightbox-counter");

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
    lightbox.querySelector(".cg-lightbox-prev")?.addEventListener("click", () => stepLightbox(-1));
    lightbox.querySelector(".cg-lightbox-next")?.addEventListener("click", () => stepLightbox(1));
    lightbox.querySelector(".cg-lightbox-close")?.addEventListener("click", () => lightbox.close());

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
    if (root.dataset.cgGalleryReady) return;
    root.dataset.cgGalleryReady = "true";

    const stageImage = root.querySelector(".cg-gallery-image");
    const thumbsList = root.querySelector(".cg-gallery-thumbs");
    const thumbs = [...root.querySelectorAll(".cg-gallery-thumb")];
    const images = thumbs.map((thumb) => thumb.querySelector("img"));
    const moreItem = root.querySelector(".cg-gallery-more");
    const moreCount = moreItem?.querySelector(".cg-gallery-more-count");
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
      const columns = parseInt(getComputedStyle(thumbsList).getPropertyValue("--cg-gallery-thumbs"), 10) || 4;
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
    root.querySelector(".cg-gallery-nav--prev")?.addEventListener("click", () => select(gallery.index - 1));
    root.querySelector(".cg-gallery-nav--next")?.addEventListener("click", () => select(gallery.index + 1));

    thumbsList.addEventListener("click", (event) => {
      const thumb = event.target.closest(".cg-gallery-thumb");
      if (thumb) select(thumbs.indexOf(thumb));
    });

    root.querySelector(".cg-gallery-zoom")?.addEventListener("click", () => openLightbox(gallery, gallery.index));

    // „+ N dalších“ otevře lightbox na prvním skrytém obrázku
    moreItem?.querySelector("button")?.addEventListener("click", () => {
      const columns = parseInt(getComputedStyle(thumbsList).getPropertyValue("--cg-gallery-thumbs"), 10) || 4;
      openLightbox(gallery, Math.max(0, Math.min(columns - 1, images.length - 1)));
    });

    // dvojklik/klik na hlavní obrázek otevře lightbox
    root.querySelector(".cg-gallery-stage-btn")?.addEventListener("click", () => openLightbox(gallery, gallery.index));

    if ("ResizeObserver" in window) {
      new ResizeObserver(layoutThumbs).observe(thumbsList);
    } else {
      window.addEventListener("resize", layoutThumbs);
    }

    layoutThumbs();
    select(0);
  }

  document.querySelectorAll("[data-cg-gallery]").forEach((root) => {
    if (!root.closest("[hidden]")) initGallery(root);
  });

  // pro obsah, který se objeví až za běhu (viz js/reference.js)
  window.cgInitGallery = initGallery;

})();
