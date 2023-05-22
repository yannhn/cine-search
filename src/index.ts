import "./style.css";
import { FetchAPI } from "./components/fetchAPI";
import { CreateDOM } from "./components/createDOM";

const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
  },
};

console.log(global.currentPage);

// Highlight active link
function highlightActiveLink() {
  // nav links
  const navLinks = document.querySelectorAll(".nav-link");
  console.log(navLinks);
  navLinks.forEach((navLink) => {
    if (navLink.getAttribute("href") === global.currentPage) {
      navLink.classList.add("text-cyan-600");
    }
  });
}

function basicRouting() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      console.log("Home");
      break;
    case "/tv_shows.html":
      console.log("Shows");
      break;
    case "/movie-details.html":
      console.log("Movie details");
      break;
    case "/shows-details.html":
      console.log("Show details");
      break;
    case "/search-results.html":
      console.log("search");
      break;
  }

  highlightActiveLink();
}

basicRouting();

const api = new FetchAPI("https://api.themoviedb.org/3/", process.env.API_KEY);
const dom = new CreateDOM();

function renderMultipleItems(url: string, containerClass: string) {
  const domContainer = document.querySelector(containerClass);
  api.get(url).then((data) => {
    data.results.forEach((result: any) => {
      if (domContainer instanceof HTMLElement) {
        const movieContainer = dom.createElement(
          "div",
          { "data-id": result.id },
          ["text-center", "m-2"],
          domContainer
        );
        // dom.createElement("h2", {}, ["text-xl"], movieContainer).textContent =
        //   result.title;
        dom.createElement(
          "img",
          { src: `https://image.tmdb.org/t/p/w500${result.poster_path}` },
          ["object-contain", "h-48", "w-96"],
          movieContainer
        );
        dom.createElement(
          "span",
          {},
          ["text-xl"],
          movieContainer
        ).textContent = `${result.vote_average} / 10`;
      }
    });
  });
}

async function renderSearchResults() {
  const queryString = window.location.search;
  const url = new URLSearchParams(queryString);

  global.search.type = url.get("type");
  global.search.term = url.get("search-query");

  console.log(global.search.type);
  console.log(global.search.term);

  const domContainer = document.querySelector(".search-results-container");

  if (global.search.type === "movie" || global.search.type === "tv") {
    api.search(global.search.type, global.search.term).then((data) => {
      data.results.forEach((result: any) => {
        if (domContainer instanceof HTMLElement) {
          const movieContainer = dom.createElement(
            "div",
            { "data-id": result.id },
            ["text-center", "m-2"],
            domContainer
          );
          // dom.createElement("h2", {}, ["text-xl"], movieContainer).textContent =
          //   result.title;
          dom.createElement(
            "img",
            { src: `https://image.tmdb.org/t/p/w500${result.poster_path}` },
            ["object-contain", "h-48", "w-96"],
            movieContainer
          );
          dom.createElement(
            "span",
            {},
            ["text-xl"],
            movieContainer
          ).textContent = `${result.vote_average} / 10`;
        }
      });
    });
  } else if (global.search.type === "person") {
    api.search(global.search.type, global.search.term).then((data) => {
      data.results.forEach((result: any) => {
        if (domContainer instanceof HTMLElement) {
          const movieContainer = dom.createElement(
            "div",
            { "data-id": result.id },
            ["text-center", "m-2"],
            domContainer
          );
          dom.createElement("h2", {}, ["text-xl"], movieContainer).textContent =
            result.name;
          dom.createElement("h3", {}, ["text-xl"], movieContainer).textContent =
            "known for";
          result.known_for.forEach((item: any) => {
            dom.createElement(
              "img",
              { src: `https://image.tmdb.org/t/p/w500${item.poster_path}` },
              ["object-contain", "h-48", "w-96"],
              movieContainer
            );
            dom.createElement(
              "span",
              {},
              ["text-xl"],
              movieContainer
            ).textContent = `${item.vote_average} / 10`;
          });
        }
      });
    });
  } else if (global.search.type === "keyword") {
    api.search(global.search.type, global.search.term).then((data) => {
      data.results.forEach((result: any) => {
        if (domContainer instanceof HTMLElement) {
          const movieContainer = dom.createElement(
            "div",
            { "data-id": result.id },
            ["text-center", "m-2"],
            domContainer
          );
          dom.createElement("h2", {}, ["text-xl"], movieContainer).textContent =
            result.name;
        }
      });
    });
  }
}

const search = renderSearchResults();

const renderTrendingMovies = renderMultipleItems(
  "trending/movie/week",
  ".now-playing-movies"
);
const renderPopularMovies = renderMultipleItems(
  "movie/popular",
  ".popular-movies"
);
const renderTrendingShows = renderMultipleItems(
  "trending/tv/week",
  ".now-playing-shows"
);
const renderPopularShows = renderMultipleItems("tv/popular", ".popular-shows");

function init(...callbacks: any[]) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      callbacks.forEach((callback) => callback);
    });
  } else {
    callbacks.forEach((callback) => callback);
  }
}

init(
  renderTrendingMovies,
  renderPopularMovies,
  renderTrendingShows,
  renderPopularShows,
  search
);

// const searchForm = document.querySelector(".search") as HTMLFormElement;
// searchForm.addEventListener("submit", (event) => {
//   // event.preventDefault();

//   const searchFormInput = document.querySelector(
//     ".search-input"
//   ) as HTMLInputElement;

//   let searchInput: string = searchFormInput.value;

//   const searchRadioButtons = document.querySelectorAll('input[type="radio"]');
//   let selectedValue = "";
//   searchRadioButtons.forEach((radioButton) => {
//     if ((radioButton as HTMLInputElement).checked) {
//       selectedValue = (radioButton as HTMLInputElement).value;
//     }
//   });

//   api.search(selectedValue, searchInput).then((data) => {
//     console.log(data);
//   });
// });

// const domContainer = document.querySelector(".test-container");

// api.search(global.search.type, global.search.term).then((data) => {
//   console.log(data);
//   data.results.forEach((result: any) => {
//     if (domContainer instanceof HTMLElement) {
//       const movieContainer = dom.createElement(
//         "div",
//         { "data-id": result.id },
//         ["text-center", "m-2"],
//         domContainer
//       );
//       // dom.createElement("h2", {}, ["text-xl"], movieContainer).textContent =
//       //   result.title;
//       dom.createElement(
//         "img",
//         { src: `https://image.tmdb.org/t/p/w500${result.poster_path}` },
//         ["object-contain", "h-48", "w-96"],
//         movieContainer
//       );
//       dom.createElement(
//         "span",
//         {},
//         ["text-xl"],
//         movieContainer
//       ).textContent = `${result.vote_average} / 10`;
//     }
//   });
// });

// async function search() {
//   const queryString = window.location.search;
//   const url = new URLSearchParams(queryString);

//   global.search.type = url.get("type");
//   global.search.term = url.get("search-query");

//   if (global.search.term !== "" && global.search.term !== null) {
//     // @todo - make request and display results
//   } else {
//     alert("PLEASE ENTER A SEARCH TERM");
//   }
// }
