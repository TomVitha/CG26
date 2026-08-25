// FILTR PROJEKTŮ – lokalita + „Dokončené byty"
//
// Kořenem je prvek s [data-project-filter] (sekce .project-tiles-section).
// Uvnitř se hledají:
//   [data-project-filter-region="…"]   … pilulky lokalit (přepínače, aria-pressed)
//   [data-project-filter-completed]    … checkbox „Dokončené byty"
//   [data-project-filter-empty]        … hláška, když nic neodpovídá
//   [data-project-region="…"]          … filtrované dlaždice; dokončené projekty
//                                        nesou navíc příznak data-project-completed
//
// Pravidla:
//   – lokalit jde zapnout víc najednou; žádná zapnutá = zobrazeno vše,
//   – checkbox se s výběrem lokalit kombinuje (AND),
//   – odfiltrované dlaždice dostanou atribut hidden (display: none řeší CSS).
(() => {

  function initFilter(root) {
    if (root.dataset.projectFilterReady) return;
    root.dataset.projectFilterReady = "true";

    const tiles = [...root.querySelectorAll("[data-project-region]")];
    const regionButtons = [...root.querySelectorAll("[data-project-filter-region]")];
    const completedToggle = root.querySelector("[data-project-filter-completed]");
    const emptyNote = root.querySelector("[data-project-filter-empty]");

    function apply() {
      const activeRegions = regionButtons
        .filter((btn) => btn.getAttribute("aria-pressed") === "true")
        .map((btn) => btn.dataset.projectFilterRegion);
      const completedOnly = completedToggle?.checked ?? false;

      let visible = 0;
      tiles.forEach((tile) => {
        const regionOk = activeRegions.length === 0
          || activeRegions.includes(tile.dataset.projectRegion);
        const completedOk = !completedOnly || tile.hasAttribute("data-project-completed");
        const show = regionOk && completedOk;
        tile.hidden = !show;
        if (show) visible += 1;
      });

      if (emptyNote) emptyNote.hidden = visible > 0;
    }

    regionButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const pressed = btn.getAttribute("aria-pressed") === "true";
        btn.setAttribute("aria-pressed", pressed ? "false" : "true");
        apply();
      });
    });

    completedToggle?.addEventListener("change", apply);

    apply();
  }

  document.querySelectorAll("[data-project-filter]").forEach(initFilter);

})();
