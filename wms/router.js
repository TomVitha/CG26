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
        { src: "hp" },
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
      path: "/reference",
      name: "reference",
      title: "Reference",
      description: "Realizované projekty CENTRAL GROUP – od rozsáhlých rezidenčních čtvrtí až po komorní bytové domy.",
      blocks: [
        { src: "meta-common" },
        { src: "reference" },
      ],
    },
    {
      path: "/design-style",
      name: "design-style",
      title: "Design style",
      description: "Výčet dílčích částí stylu",
      blocks: [
        { src: "meta-common", type: "meta" },
        { src: "design-style" },
      ],
    },
  ]
}

export const router = createRouter(routerOptions);
