import { createRouter } from "./url-router.js";

const routerOptions = {
  // titlePrefix: '',
  titleSuffix: ' - CENTRAL GROUP',
  // isActiveLinkClass: false,
  // activeLinkClass: 'router-active',
  routes: [
    {
      path: "/",
      name: "index",
      title: "Domovská stránka",
      description: "Jsme největší český největší developer s největším výběrem bytů a největší vzorkovnou.",
      blocks: [
        { src: "meta-common", type: "meta" },
        { src: "hp/hero" },
        { src: "hp/lokality" },
        { src: "hp/clanky" },
        { src: "hp/novinky-nadpis" },
        { src: "hp/bannery" },
        { src: "hp/form-registrace-newsletter" },

      ],
    },
    {
      path: "/404",
      name: "404",
      title: "404",
      description: "404 - Stránka neexistuje",
      blocks: [
        { src: "meta-common", type: "meta" },
        { src: "404" },
      ],
    },
    {
      path: "/hypoteka",
      name: "hypoteka",
      title: "Hypotéka",
      description: "Výhodné financování bez zbytečných poplatků – hypotéka na míru od CENTRAL GROUP.",
      blocks: [
        { src: "meta-common" },
        { src: "hypoteka" },
      ],
    },
    {
      path: "/postup-koupe",
      name: "postup-koupe",
      title: "Postup koupě",
      description: "Jak probíhá koupě nového bytu – od výběru přes rezervaci a financování až po předání klíčů.",
      blocks: [
        { src: "meta-common" },
        { src: "postup-koupe" },
      ],
    },
    {
      path: "/pripravovane-projekty",
      name: "pripravovane-projekty",
      title: "Připravované projekty",
      description: "Podívejte se, co připravujeme – nové rezidenční čtvrti i komorní bytové projekty po celé Praze.",
      blocks: [
        { src: "meta-common" },
        { src: "pripravovane-projekty" },
      ],
    },
    {
      path: "/financovani",
      name: "financovani",
      title: "Možnosti financování",
      description: "Nejširší možnosti financování nového bydlení – záloha 10 %, zvýhodněná hypotéka, slevy i unikátní finanční programy.",
      blocks: [
        { src: "meta-common" },
        { src: "financovani" },
      ],
    },
    {
      path: "/proc-central-group",
      name: "proc-central-group",
      title: "Proč si vybrat CENTRAL GROUP",
      description: "Největší rezidenční stavitel v ČR – nejširší nabídka bytů, garance vrácení peněz a kompletní servis pod jednou střechou.",
      blocks: [
        { src: "meta-common" },
        { src: "proc-central-group" },
      ],
    },
    {
      path: "/bonusy",
      name: "bonusy",
      title: "Bonusy",
      description: "Zvýhodnění pro naše zákazníky – sleva za zrychlenou platbu i věrnostní a množstevní slevy.",
      blocks: [
        { src: "meta-common" },
        { src: "bonusy" },
      ],
    },
    {
      path: "/aktualita-template",
      name: "aktualita-template",
      title: "Parková čtvrť: Jak roste nová dominanta Žižkova",
      description: "Typová šablona detailu aktuality – nadpis, perex, hlavní obrázek, text, galerie a témata.",
      blocks: [
        { src: "meta-common" },
        { src: "aktualita-template" },
      ],
    },
    {
      path: "/aktuality",
      name: "aktuality",
      title: "Aktuality",
      description: "Novinky z našich projektů, ze světa architektury i z financování nového bydlení.",
      blocks: [
        { src: "meta-common" },
        { src: "aktuality" },
      ],
    },
    {
      path: "/efektivni-dispozice",
      name: "efektivni-dispozice",
      title: "Efektivní dispozice",
      description: "Jak navrhujeme naše byty – promyšlené dispozice, snadná zařiditelnost a plnohodnotné bydlení i u menších bytů.",
      blocks: [
        { src: "meta-common" },
        { src: "efektivni-dispozice" },
      ],
    },
    {
      path: "/prehled-projektu",
      name: "prehled-projektu",
      title: "Přehled projektů",
      description: "Stovky nových bytů po celé Praze – vyberte si projekt podle lokality, nebo jen z dokončených bytů.",
      blocks: [
        { src: "meta-common" },
        { src: "prehled-projektu" },
      ],
    },
    {
      path: "/informace-pro-dodavatele",
      name: "informace-pro-dodavatele",
      title: "Informace pro dodavatele",
      description: "Aktuální plán poptávkových řízení – termíny výběrových řízení na stavby a technickou infrastrukturu.",
      blocks: [
        { src: "meta-common" },
        { src: "informace-pro-dodavatele" },
      ],
    },
    {
      path: "/loga-a-fotografie",
      name: "loga-a-fotografie",
      title: "Loga a fotografie ke stažení",
      description: "Loga CENTRAL GROUP a fotografie vedení společnosti ke stažení pro média.",
      blocks: [
        { src: "meta-common" },
        { src: "loga-a-fotografie" },
      ],
    },
    {
      path: "/ke-stazeni-projekty",
      name: "ke-stazeni-projekty",
      title: "Fotografie a vizualizace projektů ke stažení",
      description: "Rozcestník fotografií a vizualizací projektů CENTRAL GROUP ke stažení pro média.",
      blocks: [
        { src: "meta-common" },
        { src: "ke-stazeni-projekty" },
      ],
    },
    {
      path: "/ke-stazeni-projekt",
      name: "ke-stazeni-projekt",
      title: "Fotografie a vizualizace projektu ke stažení",
      description: "Typová šablona – fotografie a vizualizace konkrétního projektu ke stažení pro média.",
      blocks: [
        { src: "meta-common" },
        { src: "ke-stazeni-projekt" },
      ],
    },
    {
      path: "/reference",
      name: "reference",
      title: "Reference",
      description: "Realizované projekty CENTRAL GROUP – od rozsáhlých rezidenčních čtvrtí až po komorní bytové domy.",
      blocks: [
        { src: "meta-common" },
        { src: "reference" },
      ],
    },
    // AKTUALITY
    {
      path: "/aktualita-01",
      name: "aktualita-01",
      title: "aktualita-01",
      description: "CENTRAL GROUP nominován na ocenění ASB GALA 2026",
      blocks: [
        { src: "meta-common" },
        { src: "aktualita-01" },
      ],
    },
    {
      path: "/aktualita-02",
      name: "aktualita-02",
      title: "aktualita-02",
      description: "Společné zážitky posilují náš tým",
      blocks: [
        { src: "meta-common" },
        { src: "aktualita-02" },
      ],
    },
    {
      path: "/aktualita-03",
      name: "aktualita-03",
      title: "aktualita-03",
      description: "Festival Žižkovská spojka 2026 – slavnostní otevření nové dominanty Žižkova",
      blocks: [
        { src: "meta-common" },
        { src: "aktualita-03" },
      ],
    },
    {
      path: "/aktualita-04",
      name: "aktualita-04",
      title: "aktualita-04",
      description: "Vzorkovna CENTRAL GROUP – interiérové studio s kompletním servisem pro klienty",
      blocks: [
        { src: "meta-common" },
        { src: "aktualita-04" },
      ],
    },
    // DEV STRÁNKY
    {
      path: "/design-style",
      name: "design-style",
      title: "Design style",
      description: "Výčet dílčích částí stylu",
      blocks: [
        { src: "meta-common", type: "meta" },
        { src: "dev/design-style" },
      ],
    },
    {
      path: "/rozcestnik",
      name: "rozcestnik",
      title: "Rozcestník",
      description: "Rozcestník stránek",
      blocks: [
        { src: "meta-common", type: "meta" },
        { src: "dev/rozcestnik" },
      ],
    },
  ]
}

export const router = createRouter(routerOptions);
