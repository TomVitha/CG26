// LOOP VIDEO – malé smyčky na pozadí bannerů, boxů a dlaždic ([data-loop-video])
//
// Doplněk k js/hero-video.js, které řeší velké video v hlavičce stránky.
// Více menších smyček na jedné stránce - nespouští se všechny naráz.
//
// Režimy:
//   data-loop-video           … přehrává se, dokud je prvek ve viewportu; mimo něj pauza
//   data-loop-video="hover"   … přehraje se až po najetí kurzorem (nebo fokusu uvnitř),
//                               po odjezdu pauza a návrat na začátek. Na dotykových
//                               zařízeních se nespustí vůbec – tam platí obrázek pod videem. - tady možná provedeme změnu na HP prime banner
//
// Videa mají v markupu preload="none"
// Souběžně běží nejvýš MAX_PLAYING smyček – iOS Safari drží každé inline video v paměti
// - při větším počtu začne zahazovat dekodéry.
//
// Vypnutí všech smyček na stránce (připraveno pro budoucí tlačítko pauzy v heru):
//   document.documentElement.dataset.loopsPaused = "true"   → pauza
//   delete document.documentElement.dataset.loopsPaused     → zpět
// Změnu atributu skript hlídá sám, stačí ho přepnout. Automaticky se smyčky nepřehrávají
// při prefers-reduced-motion: reduce a v úsporném režimu dat.
//
// Markup:
//   <div class="…-media">
//     <img src="…" alt="">                       <!-- fallback i poster před spuštěním -->
//     <video data-loop-video muted loop playsinline preload="none"
//            aria-hidden="true" tabindex="-1">
//       <source src="…webm" type="video/webm">
//       <source src="…mp4" type="video/mp4">
//     </video>
//   </div>
(() => {

  const MAX_PLAYING = 3;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canHover = window.matchMedia("(hover: hover)");
  const saveData = navigator.connection?.saveData === true;
  const root = document.documentElement;

  const items = new Map();      // video -> { mode, visible, hovered }
  const playing = new Set();    // právě přehrávaná videa, v pořadí spuštění

  const allowed = () => !reducedMotion.matches && !saveData && root.dataset.loopsPaused !== "true";

  function wantsToPlay(video) {
    const item = items.get(video);
    if (!item || !allowed()) return false;
    return item.mode === "hover" ? item.hovered : item.visible;
  }

  function stop(video) {
    playing.delete(video);
    video.pause();
    if (items.get(video)?.mode === "hover") video.currentTime = 0;
  }

  function start(video) {
    if (playing.has(video)) return;

    // přes limit souběžných videí pauzujeme to nejdéle běžící, které není pod kurzorem
    if (playing.size >= MAX_PLAYING) {
      const victim = [...playing].find((other) => items.get(other)?.mode !== "hover" || !items.get(other).hovered);
      if (!victim) return;
      stop(victim);
    }

    playing.add(video);
    video.play()?.catch(() => playing.delete(video));   // odmítnuté přehrání = zůstane obrázek
  }

  function update(video) {
    wantsToPlay(video) ? start(video) : stop(video);
  }

  function updateAll() {
    items.forEach((item, video) => update(video));
  }

  /* # Viditelnost ve viewportu */
  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          const item = items.get(video);
          if (!item) return;
          item.visible = entry.isIntersecting;
          update(video);
        });
      }, { rootMargin: "100px", threshold: 0.2 })
    : null;

  /* # Inicializace jednoho videa */
  function initLoopVideo(video) {
    if (video.dataset.loopVideoReady) return;
    video.dataset.loopVideoReady = "true";

    const mode = video.dataset.loopVideo === "hover" ? "hover" : "viewport";
    const item = { mode, visible: false, hovered: false };
    items.set(video, item);

    // pojistka, kdyby v markupu chyběly – bez muted prohlížeč přehrání odmítne
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    if (mode === "hover") {
      // dotykové zařízení: hover neexistuje, video by se spustilo při prvním ťuknutí na odkaz
      if (!canHover.matches) return;

      const target = video.closest("a, button, article, .hp-banner") || video.parentElement;
      const setHovered = (state) => {
        item.hovered = state;
        update(video);
      };

      target.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "touch") return;
        setHovered(true);
      });
      target.addEventListener("pointerleave", () => setHovered(false));
      target.addEventListener("focusin", () => setHovered(true));
      target.addEventListener("focusout", () => setHovered(false));
      return;
    }

    if (observer) observer.observe(video);
    else {
      item.visible = true;
      update(video);
    }
  }

  /* # Reakce na změny prostředí */
  reducedMotion.addEventListener("change", updateAll);

  // přepnutí data-loops-paused na <html> (např. z tlačítka pauzy v heru)
  new MutationObserver(updateAll)
    .observe(root, { attributes: true, attributeFilter: ["data-loops-paused"] });

  document.querySelectorAll("video[data-loop-video]").forEach(initLoopVideo);

})();
