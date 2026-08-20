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
      description: "Jsme největší český největší developer s největším výběrem bytů a největší vzorkovnou... jsme největší, jo?",
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
