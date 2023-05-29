import "./style.css";
import { FetchAPI } from "./components/fetchAPI";
import { CreateDOM } from "./components/createDOM";
import { init } from "./components/dom.tools";
import {
  renderMultipleItems,
  renderSearchResults,
  displayDetails,
  createFilterListItems,
} from "./components/renderResults";

// https://api.themoviedb.org/3/discover/movie?api_key=<key>&language=fr-FR&include_adult=false&with_genres=28&page=<randomNumber>

// The results are paginated by 20 and you can access any page using "&page=" parameter, so you should generate a random number from 1-1000 then get the corresponding page (page = random_number DIV 20) and finally get the corresponding result from the downloaded page (item = random_number MOD 20).

// Wenn ich auf movies klicke bekommen die Elemente die klass hidden
// Wie greife ich auf die li-Elemente nach dem fetch zu?

// ich muss code dringend refactorn

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

function randomIntFromInterval(min: number, max: number): number {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function showSuggestions() {
  const queryString = window.location.search;
  const url = new URLSearchParams(queryString);

  console.log(url);
  console.log("TYPE", url.get("type"));
  let tempArray;
  tempArray = url.getAll("genre");
  console.log("TEMP", tempArray.join(","));
  console.log("GENRE", url.getAll("genre"));

  console.log("LOG:", url.getAll("genre"));
  global.suggestion.genre = url.getAll("genre").join(",");

  console.log("GLOBALGENRE:", global.suggestion.genre);
  // console.log(global.search.term);

  const domContainer = document.querySelector(".suggestion-result-container");

  const rndIntForPage: number = randomIntFromInterval(1, 1000);
  const rndIntForResult: number = randomIntFromInterval(0, 19);
  console.log("TSS", rndIntForResult);
  console.log("RANDOMNUMBER:", rndIntForPage);

  const randomPage: number = rndIntForPage / 20;
  const randomResult: number = rndIntForResult % 20;

  console.log("RANDOM-result:", randomResult);

  // https://api.themoviedb.org/3/discover/movie?api_key=<key>&language=fr-FR&include_adult=false&with_genres=28&page=<randomNumber>

  // The results are paginated by 20 and you can access any page using "&page=" parameter, so you should generate a random number from 1-1000 then get the corresponding page (page = random_number DIV 20) and finally get the corresponding result from the downloaded page (item = random_number MOD 20).

  fetch(
    ` https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=en-US&include_adult=false&with_genres=14&page=${randomPage}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("SUGG:", data);
      console.log("singleResult:", data.results[randomResult]);
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
    console.log("movieGenres:", data.genres);
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

function getRandomMovie() {
  buildGenreFilter();
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

      displayDetails(".movie-details-container", "movie");
      break;
    case "/tv_shows_details.html":
      console.log("Show details");

      displayDetails(".tv-show-details-container", "tv");
      break;
    case "/search_results.html":
      console.log("search");
      break;
    case "/suggestion.html":
      console.log("suggestion");
      getRandomMovie();
      // searchSuggestion();

      break;
    case "/suggestion_results.html":
      console.log("suggestion_results");
      showSuggestions();
      break;
  }

  highlightActiveLink();
}

const routingSwitch = basicRouting();

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

init(
  renderTrendingMovies,
  renderPopularMovies,
  renderTrendingShows,
  renderPopularShows,
  search,
  routingSwitch
);
