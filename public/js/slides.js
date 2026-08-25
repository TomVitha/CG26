// PŘEPÍNÁNÍ OBRÁZKŮ V SADĚ – šipky pod obrázkem
//
// Sdílená komponenta pro jednoduché sady vizualizací (efektivní dispozice).
// V sadě je viditelný vždy jeden obrázek, šipky cyklí dopředu/dozadu.
//
// Markup:
//   <div data-slides>
//     <div class="…-slides">          … obal obrázků (data-slides-list, nebo
//       <img …>                          první potomek s více <img>)
//       <img … hidden>
//     </div>
//     <button data-slides-prev>…</button>
//     <button data-slides-next>…</button>
//   </div>
//
// Bez JS zůstane viditelný obrázek, který nemá atribut hidden.
(() => {

  function initSlides(root) {
    if (root.dataset.slidesReady) return;
    root.dataset.slidesReady = "true";

    const list = root.querySelector("[data-slides-list]") || root;
    const slides = [...list.querySelectorAll("img")];
    if (slides.length < 2) return;

    let index = Math.max(0, slides.findIndex((img) => !img.hidden));

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach((img, i) => {
        img.hidden = i !== index;
        // obrázek se stahuje až ve chvíli, kdy na něj dojde řada
        if (i === index) img.loading = "eager";
      });
    }

    root.querySelector("[data-slides-prev]")
      ?.addEventListener("click", () => show(index - 1));
    root.querySelector("[data-slides-next]")
      ?.addEventListener("click", () => show(index + 1));

    show(index);
  }

  document.querySelectorAll("[data-slides]").forEach(initSlides);

})();
