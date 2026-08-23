// HERO VIDEO – smyčka na pozadí hero sekce (.hero > video.hero-bg)
//
// Markup zůstává funkční i bez JS (prohlížeč si vybere <source> podle media při načtení).
// JS doplňuje to, co HTML samo neumí:
//   1) <source media> se vyhodnotí jen jednou při načtení – po změně šířky okna nebo
//      otočení displeje prohlížeč zdroj nepřepne. Tady se přepíná i za běhu.
//   2) poster jde v HTML zadat jen jeden – varianta pro každý zdroj je v data-poster.
//   3) prefers-reduced-motion a úsporný režim dat: video se nepřehrává, zůstane poster.
//   4) WCAG 2.2.2 – pohyb delší než 5 s musí jít zastavit; doplní se nenápadné tlačítko
//      do rohu hero sekce (v HTML nemá smysl, bez JS by nefungovalo).
//   5) Mimo viewport se přehrávání pozastaví (šetří CPU a baterii).
//
// Markup:
//   <video class="hero-bg" data-hero-video poster="…" autoplay muted loop playsinline>
//     <source src="…" type="video/mp4" media="(min-width: 768px)" data-poster="…">
//     <source src="…" type="video/mp4" data-poster="…">   <!-- výchozí (mobil) -->
//   </video>
(() => {

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const saveData = navigator.connection?.saveData === true;

  function absolute(url) {
    return url ? new URL(url, document.baseURI).href : "";
  }

  function initHeroVideo(video) {
    if (video.dataset.heroVideoReady) return;
    video.dataset.heroVideoReady = "true";

    const sources = [...video.querySelectorAll("source")];
    if (!sources.length) return;

    const hero = video.closest(".hero") || video.parentElement;

    // null = uživatel zatím nerozhodl, jinak jeho volba (přebíjí systémové nastavení)
    let userWants = null;
    let inView = true;

    const allowed = () => !reducedMotion.matches && !saveData;
    const wantsPlaying = () => (userWants === null ? allowed() : userWants);

    /* # Výběr zdroje – první, jehož media dotaz odpovídá (bez media = výchozí) */
    function pickSource() {
      return sources.find((source) => {
        const media = source.getAttribute("media");
        return !media || window.matchMedia(media).matches;
      }) || sources[sources.length - 1];
    }

    function applySource() {
      const source = pickSource();
      const src = absolute(source.getAttribute("src"));

      if (source.dataset.poster) video.poster = source.dataset.poster;
      if (absolute(video.currentSrc) === src) return;

      video.src = src;
      video.load();
      updatePlayback();
    }

    /* # Přehrávání */
    function safePlay() {
      video.play()?.catch(() => {
        // autoplay může odmítnout prohlížeč (úsporný režim iOS apod.) – zůstane poster
        syncToggle();
      });
    }

    function updatePlayback() {
      const play = wantsPlaying() && inView;

      // atribut autoplay musí sledovat stav – po video.load() by se jinak pozastavené
      // video rozjelo znovu (a stejně tak při prvním načtení s reduced-motion)
      video.autoplay = play;

      if (play) safePlay();
      else video.pause();

      syncToggle();
    }

    /* # Tlačítko pauzy */
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "hero-media-toggle";
    toggle.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i>';
    toggle.addEventListener("click", () => {
      userWants = !wantsPlaying();
      updatePlayback();
    });
    hero.appendChild(toggle);

    function syncToggle() {
      const playing = !video.paused;
      const label = playing ? "Pozastavit video na pozadí" : "Spustit video na pozadí";
      toggle.setAttribute("aria-label", label);
      toggle.title = label;
      toggle.firstElementChild.className = playing ? "fa-solid fa-pause" : "fa-solid fa-play";
    }

    /* # Reakce na změny prostředí */
    // každý použitý media dotaz hlídáme zvlášť – pokrývá i otočení displeje
    new Set(sources.map((source) => source.getAttribute("media")).filter(Boolean))
      .forEach((media) => window.matchMedia(media).addEventListener("change", applySource));

    reducedMotion.addEventListener("change", updatePlayback);

    video.addEventListener("play", syncToggle);
    video.addEventListener("pause", syncToggle);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting;
        updatePlayback();
      }).observe(hero);
    }

    // Prohlížeč, který media na <source> ignoruje, si vybere první zdroj – po načtení
    // metadat proto zkontrolujeme, jestli hraje ten správný.
    video.addEventListener("loadedmetadata", applySource, { once: true });

    /* # Výchozí stav */
    video.poster = pickSource().dataset.poster || video.poster;
    updatePlayback();
  }

  document.querySelectorAll("video[data-hero-video]").forEach(initHeroVideo);

})();
