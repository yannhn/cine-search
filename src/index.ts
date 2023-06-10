import "./style.css";
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";

import { FetchAPI } from "./components/fetchAPI";
import { CreateDOM } from "./components/createDOM";
import {
  init,
  handleMobileMenu,
  randomIntFromInterval,
} from "./components/dom.tools";
import {
  renderMultipleItems,
  renderPreview,
  renderSearchResults,
  displayDetails,
  createFilterListItems,
} from "./components/renderResults";

const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
  },
  suggestion: {
    type: "",
    genre: "",
    page: 1,
    totalPages: 1,
  },
};

const api = new FetchAPI("https://api.themoviedb.org/3/", process.env.API_KEY);
const dom = new CreateDOM();

function refresh() {
  window.location.reload();
}

async function triggerNewSuggestion() {
  const newSuggestionButton = document.querySelector(".new-suggestion");

  newSuggestionButton.addEventListener("click", refresh);
}

async function showSuggestions() {
  const queryString = window.location.search;
  const url = new URLSearchParams(queryString);

  global.suggestion.type = url.get("type");
  global.suggestion.genre = url.getAll("genre").join(",");

  const domContainer = document.querySelector(".suggestion-result-container");

  const rndIntForPage: number = randomIntFromInterval(1, 1000);
  const rndIntForResult: number = randomIntFromInterval(0, 19);

  const randomPage: number = rndIntForPage / 20;
  const randomResult: number = rndIntForResult % 20;

  // undefined id abfangen

  api
    .discover(global.suggestion.type, global.suggestion.genre, randomPage)
    .then((data) => {
      const singleResult = data.results[randomResult];

      if (
        global.suggestion.type === "movie" ||
        global.suggestion.type === "tv"
      ) {
        if (domContainer instanceof HTMLElement) {
          const movieContainer = dom.createElement(
            "div",
            { "data-id": singleResult.id },
            ["text-center", "m-2"],
            domContainer
          );
          dom.createElement(
            "img",
            {
              src: `https://image.tmdb.org/t/p/w500${singleResult.poster_path}`,
            },
            ["object-contain", "h-48", "w-96"],
            movieContainer
          );
          dom.createElement(
            "h2",
            {},
            ["text-xl"],
            movieContainer
          ).textContent = `${
            global.suggestion.type === "movie"
              ? singleResult.title
              : singleResult.name
          }`;
          dom.createElement(
            "h2",
            {},
            ["text-xl"],
            movieContainer
          ).textContent = `Release: ${
            global.suggestion.type === "movie"
              ? singleResult.release_date
              : singleResult.first_air_date
          }`;
          dom.createElement(
            "span",
            {},
            ["text-xl"],
            movieContainer
          ).textContent = `Rating: ${singleResult.vote_average.toFixed(
            1
          )} / 10`;
        }
      } else {
        console.log("NOTHING");
      }
    });
}

function buildGenreFilter() {
  const genreFilterList = document.querySelector(".genre-filter-list");

  const filterRadioButton = document.querySelectorAll(
    ".filter-form input[type='radio']"
  );

  interface Genre {
    id: number;
    name: string;
  }

  api.get(`genre/movie/list`).then((data) => {
    data.genres.forEach((genre: Genre) => {
      createFilterListItems(genreFilterList, genre, "movie");
    });
    const movieGenreListItem = document.querySelectorAll(".movie");

    filterRadioButton.forEach((button: HTMLInputElement) => {
      button.addEventListener("change", (event) => {
        movieGenreListItem.forEach((item) => {
          if ((event.target as HTMLInputElement).value === "movie") {
            item.classList.remove("hidden");
          }
          if ((event.target as HTMLInputElement).value === "tv") {
            item.classList.add("hidden");
          }
        });
      });
    });
  });

  api.get(`genre/tv/list`).then((data) => {
    data.genres.forEach((genre: Genre) => {
      createFilterListItems(genreFilterList, genre, "tv");
    });
    const tvGenreListItem = document.querySelectorAll(".tv");

    filterRadioButton.forEach((button: HTMLInputElement) => {
      button.addEventListener("change", (event) => {
        tvGenreListItem.forEach((item) => {
          if ((event.target as HTMLInputElement).value === "movie") {
            item.classList.add("hidden");
          }
          if ((event.target as HTMLInputElement).value === "tv") {
            item.classList.remove("hidden");
          }
        });
      });
    });
  });
  genreFilterList.innerHTML = "";
}

function highlightActiveLink() {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((navLink) => {
    if (navLink.getAttribute("href") === global.currentPage) {
      navLink.classList.add("text-cyan-600");
    }
  });
}

// method in routing class!
function basicRouting() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      console.log("Home");
      break;
    case "/tv_shows.html":
      console.log("Shows");
      break;
    case "/movie_details.html":
      console.log("Movie details");
      displayDetails(
        ".movie-details-container",
        "movie",
        ".preview-image-details-movie"
      );
      break;
    case "/tv_shows_details.html":
      console.log("Show details");
      displayDetails(
        ".tv-show-details-container",
        "tv",
        ".preview-image-details-show"
      );
      break;
    case "/search_results.html":
      console.log("search");
      break;
    case "/suggestion.html":
      console.log("suggestion");
      // getRandomMovie();
      buildGenreFilter();
      // searchSuggestion();
      break;
    case "/suggestion_results.html":
      console.log("suggestion_results");
      showSuggestions();
      triggerNewSuggestion();
      break;
  }

  highlightActiveLink();
}

const routingSwitch = basicRouting();

const search = renderSearchResults();

const renderMoviePreview = renderPreview(
  "trending/movie/week",
  ".preview-image-movie"
);

const renderPopularMovies = renderMultipleItems(
  "movie/popular",
  ".popular-movies"
);

const renderShowPreview = renderPreview(
  "trending/tv/week",
  ".preview-image-shows"
);
const renderPopularShows = renderMultipleItems("tv/popular", ".popular-shows");

const mobileMenu = handleMobileMenu();

init(
  renderMoviePreview,
  renderPopularMovies,
  renderShowPreview,
  renderPopularShows,
  search,
  routingSwitch,
  mobileMenu
);
