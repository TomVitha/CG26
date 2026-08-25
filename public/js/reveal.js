// POSTUPNÉ ZOBRAZOVÁNÍ POLOŽEK – „Zobrazit další…"
//
// Sdílená komponenta pro dlouhé výpisy (reference, přehled aktualit). Položky nad
// výchozí počet mají v markupu atribut `hidden`, tlačítko je odkryje po dávkách.
// Když už není co odkrývat, tlačítko se schová.
//
// Markup:
//   <div data-reveal data-reveal-step="3" data-reveal-button="news-more">
//     <article>…</article>
//     <article hidden>…</article>
//   </div>
//   <button id="news-more">Zobrazit další… <span data-reveal-count></span></button>
//
// Volitelně:
//   data-reveal-focus="…"  … CSS selektor prvku, na který se po odkrytí přesune
//                             focus (výchozí je první nadpis v odkryté položce)
(() => {

  function initReveal(root) {
    if (root.dataset.revealReady) return;
    root.dataset.revealReady = "true";

    const step = parseInt(root.dataset.revealStep, 10) || 5;
    const button = document.getElementById(root.dataset.revealButton);
    const items = [...root.children];
    if (!button) return;

    const focusSelector = root.dataset.revealFocus || "h2, h3, h4";

    function update() {
      const hidden = items.filter((item) => item.hidden);
      button.hidden = hidden.length === 0;
      const count = button.querySelector("[data-reveal-count]");
      if (count) count.textContent = hidden.length ? `(${hidden.length})` : "";
    }

    button.addEventListener("click", () => {
      const revealed = items.filter((item) => item.hidden).slice(0, step);
      revealed.forEach((item) => {
        item.hidden = false;
        // galerie se inicializuje až když je prvek v layoutu (kvůli měření pásu náhledů)
        item.querySelectorAll("[data-cg-gallery]").forEach((el) => window.cgInitGallery?.(el));
      });

      update();

      // po doplnění přesuneme focus na první novou položku
      const heading = revealed[0]?.querySelector(focusSelector);
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    });

    update();
  }

  document.querySelectorAll("[data-reveal]").forEach(initReveal);

})();
