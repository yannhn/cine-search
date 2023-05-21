import "./style.css";
import { FetchAPI } from "./components/fetchAPI";
import { CreateDOM } from "./components/createDOM";

const api = new FetchAPI("https://api.themoviedb.org/3/", process.env.API_KEY);
const dom = new CreateDOM();

const playing = document.querySelector(".now-playing");
const popular = document.querySelector(".popular");

function renderTrendingMovies() {
  api.get("trending/movie/week").then((data) => {
    // console.log(data);
    data.results.forEach((result: any) => {
      // console.log(result);
      if (playing instanceof HTMLElement) {
        const movieContainer = dom.createElement(
          "div",
          { "data-id": result.id },
          [],
          playing
        );
        dom.createElement("h2", {}, ["text-xl"], movieContainer).textContent =
          result.title;

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

function renderPopularMovies() {
  api.get("movie/popular").then((data) => {
    data.results.forEach((result: any) => {
      if (popular instanceof HTMLElement) {
        const movieContainer = dom.createElement(
          "div",
          { "data-id": result.id },
          [],
          popular
        );
        dom.createElement("h2", {}, ["text-xl"], movieContainer).textContent =
          result.title;

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

const searchForm = document.querySelector(".search") as HTMLFormElement;

console.log(window.location.pathname);
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  console.log(urlParams);

  const searchFormInput = document.querySelector(
    ".search-input"
  ) as HTMLInputElement;
  console.log(searchFormInput.value);

  let searchInput: string = searchFormInput.value;
  console.log("STRING:", searchInput);

  const searchRadioButtons = document.querySelectorAll('input[type="radio"]');
  let selectedValue = "";
  searchRadioButtons.forEach((radioButton) => {
    if ((radioButton as HTMLInputElement).checked) {
      selectedValue = (radioButton as HTMLInputElement).value;
    }
  });

  api.search(selectedValue, searchInput).then((data) => {
    console.log(data);
  });
});

function init(...callbacks: any[]) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      callbacks.forEach((callback) => callback());
    });
  } else {
    callbacks.forEach((callback) => callback());
  }
}

init(renderTrendingMovies, renderPopularMovies);
