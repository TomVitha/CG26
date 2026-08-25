// REFERENCE – postupné načítání projektů (blocks/reference.html)
//
// Galerie a lightbox řeší sdílený js/gallery.js, který si blok linkuje před tímto
// souborem. Nově zobrazené projekty se doinicializují přes window.cgInitGallery.
(() => {

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
        item.querySelectorAll("[data-cg-gallery]").forEach((el) => window.cgInitGallery?.(el));
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

  document.querySelectorAll("[data-reveal]").forEach(initReveal);

})();
