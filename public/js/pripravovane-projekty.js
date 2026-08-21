// CAROUSEL + LIGHTBOX – sekce  (blocks/pripravovane-projekty.html)
//
// Řešení bez závislostí.
// Rozměr slidu určuje výška (--projects-slide-h), šířku dopočítá poměr stran
// konkrétního obrázku – možné vizualizace různých formátů.
// Pozice se počítají v JS (--track-x), boční slidy se skládají těsně za sebou (--shift),
// vyplní obrazovku v celé šířce.
(() => {

  const SLIDE_STEP_THRESHOLD = 0.12; // vzdálenost táhnutí pro přepnutí slajdu

  function initCarousel(root) {
    if (root.dataset.carouselReady) return;
    root.dataset.carouselReady = "true";

    const viewport = root.querySelector(".projects-viewport");
    const track = root.querySelector(".projects-track");
    const originals = [...track.children];
    const count = originals.length;
    if (!count) return;

    /* ## Smyčka: */
    const cloneSet = () => originals.map((slide) => {
      const clone = slide.cloneNode(true);
      clone.classList.add("is-clone");
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("button, a").forEach((el) => { el.tabIndex = -1; });
      return clone;
    });

    track.prepend(...cloneSet());
    track.append(...cloneSet());

    const slides = [...track.children];
    let index = count;        // první slide
    let inViewport = false;

    /* # Poměr stran a maximální velikost podle zdrojového obrázku */
    function measureSlide(slide) {
      const image = slide.querySelector("img");
      if (!image?.naturalWidth) return false;

      slide.style.aspectRatio = `${image.naturalWidth} / ${image.naturalHeight}`;
      slide.style.maxHeight = `${image.naturalHeight}px`;
      return true;
    }

    slides.forEach((slide) => {
      if (measureSlide(slide)) return;
      slide.querySelector("img")?.addEventListener("load", () => {
        measureSlide(slide);
        apply();
      }, { once: true });
    });

    /* # Vykreslení */
    function apply() {
      const scale = parseFloat(getComputedStyle(root).getPropertyValue("--projects-side-scale")) || 1;
      const active = slides[index];

      // vycentrování aktivního slidu (offsetLeft je nezávislý na transformacích)
      const trackX = viewport.clientWidth / 2 - (active.offsetLeft + active.offsetWidth / 2);
      track.style.setProperty("--track-x", `${trackX}px`);
      root.style.setProperty("--projects-active-w", `${active.offsetWidth}px`);

      slides.forEach((slide, i) => {
        const distance = i - index;
        slide.classList.toggle("is-active", distance === 0);
        slide.classList.toggle("is-before", distance < 0);
        slide.classList.toggle("is-after", distance > 0);
        slide.style.setProperty("--shift", "0px");
      });

      // Boční slidy se zmenšují k vnitřní hraně
  
      let shift = 0;
      for (let i = index + 1; i < slides.length; i += 1) {
        slides[i].style.setProperty("--shift", `${-shift}px`);
        shift += (1 - scale) * slides[i].offsetWidth;
      }

      shift = 0;
      for (let i = index - 1; i >= 0; i -= 1) {
        slides[i].style.setProperty("--shift", `${shift}px`);
        shift += (1 - scale) * slides[i].offsetWidth;
      }

      root.querySelectorAll("[data-carousel-status]").forEach((el) => {
        el.textContent = `${(index % count) + 1} / ${count}`;
      });
    }

    function go(direction) {
      index += direction;
      apply();
    }

    /* # Přeskočení na odpovídající slide uprostřed (bez animace) */
    function normalize() {
      const next = index >= count * 2 ? index - count
        : index < count ? index + count
          : index;

      if (next === index) return;

      index = next;
      track.classList.add("is-instant");
      apply();
      void track.offsetWidth; // vynutí reflow, pro neanimování změny
      track.classList.remove("is-instant");
    }

    track.addEventListener("transitionend", (event) => {
      if (event.target === track && event.propertyName === "translate") normalize();
    });

    /* # Přepočet při změně velikosti okna */
    function refresh() {
      track.classList.add("is-instant");
      apply();
      void track.offsetWidth;
      track.classList.remove("is-instant");
    }

    if ("ResizeObserver" in window) {
      let first = true;
      new ResizeObserver(() => {
        if (first) { first = false; return; }
        refresh();
      }).observe(viewport);
    } else {
      window.addEventListener("resize", refresh);
    }

    /* # Šipky */
    root.querySelector(".projects-nav--prev")?.addEventListener("click", () => go(-1));
    root.querySelector(".projects-nav--next")?.addEventListener("click", () => go(1));

    /* #ovládání kurzorem klávesnice */
    function onKeydown(event) {
      if (!root.isConnected) {
        document.removeEventListener("keydown", onKeydown);
        return;
      }
      if (!inViewport || lightbox?.open) return;
      if (event.target.closest("input, textarea, select, [contenteditable]")) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      }
    }

    document.addEventListener("keydown", onKeydown);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => { inViewport = entry.isIntersecting; }, { threshold: 0.35 })
        .observe(root);
    } else {
      inViewport = true;
    }

    /* ## Tažení myší/prstem */
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let delta = 0;
    let step = 0;
    let locked = false;

    function setDrag(px) {
      track.style.setProperty("--drag-offset", `${px}px`);
    }

    track.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || pointerId !== null) return;

      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      delta = 0;
      locked = false;
      step = slides[index].offsetWidth;
    });

    track.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;

      const dx = event.clientX - startX;
      const dy = event.clientY - startY;

      if (!locked) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dx) < Math.abs(dy)) {
          pointerId = null;
          return;
        }
        locked = true;
        track.classList.add("is-dragging");
        track.setPointerCapture(event.pointerId);
      }

      delta = dx;
      setDrag(delta);
    });

    function endDrag(event) {
      if (event.pointerId !== pointerId) return;
      pointerId = null;

      if (!locked) return;
      locked = false;

      track.classList.remove("is-dragging");
      setDrag(0);

      if (Math.abs(delta) > step * SLIDE_STEP_THRESHOLD) go(delta < 0 ? 1 : -1);
      delta = 0;
    }

    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);

    // po tažení nechceme otevřít lightbox
    track.addEventListener("click", (event) => {
      if (Math.abs(delta) > 5) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);

    /* # Lightbox */
    const lightbox = document.querySelector(".projects-lightbox");
    const lightboxImage = lightbox?.querySelector(".projects-lightbox-image");
    const lightboxCaption = lightbox?.querySelector(".projects-lightbox-caption");

    function showInLightbox() {
      if (!lightbox) return;

      const image = slides[index].querySelector("img");
      lightboxImage.src = image.dataset.full || image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = image.dataset.caption || image.alt;
    }

    track.addEventListener("click", (event) => {
      const button = event.target.closest(".projects-slide-btn");
      if (!button || !lightbox) return;

      const slideIndex = slides.indexOf(button.closest(".projects-slide"));
      if (slideIndex !== index) {
        index = slideIndex;
        apply();
      }

      showInLightbox();
      lightbox.showModal();
    });

    if (lightbox) {
      lightbox.querySelector(".projects-nav--prev")?.addEventListener("click", () => {
        go(-1);
        normalize();
        showInLightbox();
      });

      lightbox.querySelector(".projects-nav--next")?.addEventListener("click", () => {
        go(1);
        normalize();
        showInLightbox();
      });

      lightbox.querySelector(".projects-lightbox-close")?.addEventListener("click", () => lightbox.close());

      // zavření kliknutím mimo img
      lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) lightbox.close();
      });

      lightbox.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          go(-1);
          normalize();
          showInLightbox();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          go(1);
          normalize();
          showInLightbox();
        }
      });
    }

    apply();
  }

  document.querySelectorAll(".projects-carousel").forEach(initCarousel);

})();
