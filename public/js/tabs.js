// TABY – obecná komponenta
//
// Markup:
//   <div role="tablist" data-tabs>
//     <button role="tab" id="…" aria-controls="…" aria-selected="true">…</button>
//   </div>
//   <div role="tabpanel" id="…" aria-labelledby="…" hidden>…</div>
//
// Bez JS zůstane viditelný panel, který nemá atribut hidden.
(() => {

  function initTabs(tablist) {
    if (tablist.dataset.tabsReady) return;
    tablist.dataset.tabsReady = "true";

    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    if (!tabs.length) return;

    const panelOf = (tab) => document.getElementById(tab.getAttribute("aria-controls"));

    function select(tab, { focus = false } = {}) {
      tabs.forEach((item) => {
        const isSelected = item === tab;
        item.setAttribute("aria-selected", String(isSelected));
        item.tabIndex = isSelected ? 0 : -1;

        const panel = panelOf(item);
        if (panel) panel.hidden = !isSelected;
      });

      if (focus) tab.focus();
    }

    tablist.addEventListener("click", (event) => {
      const tab = event.target.closest('[role="tab"]');
      if (tab) select(tab);
    });

    // Klávesnice: šipky (svisle i vodorovně podle breakpointu), Home / End
    tablist.addEventListener("keydown", (event) => {
      const currentIndex = tabs.indexOf(event.target.closest('[role="tab"]'));
      if (currentIndex === -1) return;

      const lastIndex = tabs.length - 1;
      let nextIndex = null;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = lastIndex;
          break;
      }

      if (nextIndex === null) return;
      event.preventDefault();
      select(tabs[nextIndex], { focus: true });
    });

    // Výchozí stav podle markupu (fallback: první tab)
    select(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0]);
  }

  document.querySelectorAll('[role="tablist"][data-tabs]').forEach(initTabs);

})();
