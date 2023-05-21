import "./style.css";
import { FetchAPI } from "./components/fetchAPI";
import { CreateDOM } from "./components/createDOM";

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
          [],
          domContainer
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

const searchForm = document.querySelector(".search") as HTMLFormElement;
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

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
  renderPopularShows
);
