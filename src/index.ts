import "./style.css";
import { FetchAPI } from "./components/fetchAPI";
import { CreateDOM } from "./components/createDOM";

// https://api.themoviedb.org/3/discover/movie?api_key=<key>&language=fr-FR&include_adult=false&with_genres=28&page=<randomNumber>

// The results are paginated by 20 and you can access any page using "&page=" parameter, so you should generate a random number from 1-1000 then get the corresponding page (page = random_number DIV 20) and finally get the corresponding result from the downloaded page (item = random_number MOD 20).

// Wenn ich auf movies klicke bekommen die Elemente die klass hidden
// Wie greife ich auf die li-Elemente nach dem fetch zu?

// ich muss code dringend refactorn

function createFilterListItems(container: any, data: any, type: string) {
  if (container instanceof HTMLElement) {
    const genreFilterListItem = dom.createElement("li", {}, [type], container);
    const genreFilterCheckbox = dom.createElement(
      "input",
      { id: `${data.id}`, type: "checkbox", value: data.name },
      // ["hidden"],
      ["hidden", "peer"],
      genreFilterListItem
    );
    const genreFilterLabel = (dom.createElement(
      "label",
      { for: `${data.id}` },
      [
        "genre-filter-label",
        "inline-flex",
        "items-center",
        "rounded-sm",
        "border",
        "border-black",
        "border-2",
        "hover:bg-red-50",
        "peer-checked:bg-green-500",
        "px-2",
        "py-1",
      ],
      genreFilterListItem
    ).textContent = data.name);

    return genreFilterListItem;
  }
}

const filterRadioButton = document.querySelectorAll(".filter-form input");
console.log("BTN;", filterRadioButton);

filterRadioButton.forEach((button: HTMLInputElement) => {
  button.addEventListener("change", (event) => {
    if ((event.target as HTMLInputElement).value === "movie") {
      console.log((event.target as HTMLInputElement).value);
    }
    if ((event.target as HTMLInputElement).value === "tv") {
      console.log((event.target as HTMLInputElement).value);
    }
  });
});

function buildGenreFilter() {
  const genreFilterList = document.querySelector(".genre-filter-list");

  interface Genre {
    id: number;
    name: string;
  }

  api.get(`genre/movie/list`).then((data) => {
    console.log(data.genres);
    data.genres.forEach((genre: Genre) => {
      createFilterListItems(genreFilterList, genre, "movie");
    });
  });

  api.get(`genre/tv/list`).then((data) => {
    console.log(data.genres);
    data.genres.forEach((genre: Genre) => {
      createFilterListItems(genreFilterList, genre, "tv");
    });
  });
}

function getRandomMovie() {
  // base api
  // get https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}

  //  `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=fr-FR&include_adult=false&with_genres=28&page=<randomNumber>`

  buildGenreFilter();
}

const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
  },
};

const api = new FetchAPI("https://api.themoviedb.org/3/", process.env.API_KEY);
const dom = new CreateDOM();

console.log(global.currentPage);

function highlightActiveLink() {
  const navLinks = document.querySelectorAll(".nav-link");
  console.log(navLinks);
  navLinks.forEach((navLink) => {
    if (navLink.getAttribute("href") === global.currentPage) {
      navLink.classList.add("text-cyan-600");
    }
  });
}

// Display details

async function displayMovieDetails() {
  const movieId = window.location.search.split("=")[1];

  const domContainer = document.querySelector(".movie-details-container");

  api.get(`movie/${movieId}`).then((data) => {
    console.log("MOVIE/TV - DATA", data);
    if (domContainer instanceof HTMLElement) {
      const movieContainer = dom.createElement(
        "div",
        { "data-id": data.id },
        ["text-center", "m-2"],
        domContainer
      );

      dom.createElement("h2", {}, ["text-xl"], movieContainer).textContent =
        data.title;
      dom.createElement(
        "img",
        { src: `https://image.tmdb.org/t/p/w500${data.poster_path}` },
        ["object-contain", "h-48", "w-96"],
        movieContainer
      );

      dom.createElement(
        "h2",
        {},
        ["text-xl"],
        movieContainer
      ).textContent = `Release date: ${data.release_date}`;
      dom.createElement(
        "span",
        {},
        ["text-xl"],
        movieContainer
      ).textContent = `Rating: ${data.vote_average.toFixed(1)} / 10`;
      dom.createElement("p", {}, [], movieContainer).textContent =
        data.overview;
      const genreContainer = dom.createElement(
        "div",
        {},
        ["m-8"],
        movieContainer
      );

      dom.createElement("h4", {}, ["text-xl"], genreContainer).textContent =
        "Genres";
      const genreList = dom.createElement("ul", {}, [], genreContainer);
      data.genres.forEach((genre: any) => {
        dom.createElement(
          "li",
          {},
          [
            "inline-flex",
            "items-left",
            "rounded-md",
            "bg-gray-50",
            "px-2",
            "py-1",
            "m-2",
            "text-xs",
            "font-medium",
            "text-gray-600",
          ],
          genreList
        ).textContent = genre.name;
      });
      dom.createElement(
        "a",
        {
          href: `https://www.imdb.com/title/${data.imdb_id}/`,
          target: "_blank",
        },
        [
          "px-6",
          "py-3",
          "text-blue-100",
          "no-underline",
          "bg-blue-500",
          "rounded",
          "hover:bg-blue-600",
        ],
        movieContainer
      ).textContent = `See more details on imdb!`;
      dom.createElement(
        "a",
        {
          href: `${data.homepage}`,
          target: "_blank",
        },
        [
          "px-6",
          "py-3",
          "text-blue-100",
          "no-underline",
          "bg-orange-500",
          "rounded",
          "hover:bg-orange-600",
        ],
        movieContainer
      ).textContent = `Official homepage`;
      dom.createElement("h2", {}, ["mt-8"], movieContainer).textContent =
        "MOVIE INFO FOR DETAILS";
    }
  });
}

async function displayShowDetails() {
  const showId = window.location.search.split("=")[1];

  const domContainer = document.querySelector(".tv-show-details-container");

  api.get(`tv/${showId}`).then((data) => {
    console.log("TV - DATA", data);
    if (domContainer instanceof HTMLElement) {
      const movieContainer = dom.createElement(
        "div",
        { "data-id": data.id },
        ["text-center", "m-2"],
        domContainer
      );

      dom.createElement("h2", {}, ["text-xl"], movieContainer).textContent =
        data.title;
      dom.createElement(
        "img",
        { src: `https://image.tmdb.org/t/p/w500${data.poster_path}` },
        ["object-contain", "h-48", "w-96"],
        movieContainer
      );

      dom.createElement(
        "h2",
        {},
        ["text-xl"],
        movieContainer
      ).textContent = `Release date: ${data.first_air_date}`;
      // .textContent = `Release date: ${data.first_air_date.split('-')[0]}`;
      dom.createElement(
        "span",
        {},
        ["text-xl"],
        movieContainer
      ).textContent = `Rating: ${data.vote_average.toFixed(1)} / 10`;
      dom.createElement("h6", {}, [], movieContainer).textContent =
        data.tagline;
      dom.createElement("p", {}, [], movieContainer).textContent =
        data.overview;
      const genreContainer = dom.createElement(
        "div",
        {},
        ["m-8"],
        movieContainer
      );

      dom.createElement("h4", {}, ["text-xl"], genreContainer).textContent =
        "Genres";
      const genreList = dom.createElement("ul", {}, [], genreContainer);
      data.genres.forEach((genre: Record<string, string>) => {
        dom.createElement(
          "li",
          {},
          [
            "inline-flex",
            "items-left",
            "rounded-md",
            "bg-gray-50",
            "px-2",
            "py-1",
            "m-2",
            "text-xs",
            "font-medium",
            "text-gray-600",
          ],
          genreList
        ).textContent = genre.name;
      });

      dom.createElement(
        "a",
        {
          href: `${data.homepage}`,
          target: "_blank",
        },
        [
          "px-6",
          "py-3",
          "text-blue-100",
          "no-underline",
          "bg-orange-500",
          "rounded",
          "hover:bg-orange-600",
        ],
        movieContainer
      ).textContent = `Official homepage`;
      const networkList = dom.createElement("ul", {}, ["mt-8"], movieContainer);
      data.networks.forEach((network: Record<string, string>) => {
        dom.createElement(
          "li",
          {},
          ["mt-8"],
          networkList
        ).textContent = `network: ${network.name}`;
      });
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
      displayMovieDetails();
      break;
    case "/tv_shows_details.html":
      console.log("Show details");
      displayShowDetails();
      break;
    case "/search_results.html":
      console.log("search");
      break;
    case "/suggestion.html":
      console.log("suggestion");
      getRandomMovie();
      break;
  }

  highlightActiveLink();
}

function renderMultipleItems(url: string, containerClass: string) {
  const domContainer = document.querySelector(containerClass);
  // methods as parameters
  api.get(url).then((data) => {
    // In andere Funktion auslagern!!
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
        const detailsLink = dom.createElement(
          "a",
          {
            href: `${
              global.currentPage === "/" || global.currentPage === "index.html"
                ? `/movie_details.html?id=${result.id}`
                : `/tv_shows_details.html?id=${result.id}`
            }`,
          },

          [],
          movieContainer
        );
        dom.createElement(
          "img",
          { src: `https://image.tmdb.org/t/p/w500${result.poster_path}` },
          // { src: `https://image.tmdb.org/t/p/w500${result.poster_path}` },
          ["object-contain", "h-48", "w-96"],
          detailsLink
        );
        dom.createElement(
          "span",
          {},
          ["text-xl"],
          movieContainer
        ).textContent = `${result.vote_average.toFixed(1)} / 10`;
      }
    });
  });
}

async function renderSearchResults() {
  const queryString = window.location.search;
  const url = new URLSearchParams(queryString);

  console.log(url);
  console.log("TY", url.get("type"));

  global.search.type = url.get("type");
  global.search.term = url.get("search-query");

  console.log(global.search.type);
  console.log(global.search.term);

  const domContainer = document.querySelector(".search-results-container");

  if (global.search.type === "movie" || global.search.type === "tv") {
    api.search(global.search.type, global.search.term).then((data) => {
      console.log("MOVIE/TV - DATA", data);
      data.results.forEach((result: any) => {
        if (domContainer instanceof HTMLElement) {
          const movieContainer = dom.createElement(
            "div",
            { "data-id": result.id },
            ["text-center", "m-2"],
            domContainer
          );
          dom.createElement(
            "img",
            { src: `https://image.tmdb.org/t/p/w500${result.poster_path}` },
            ["object-contain", "h-48", "w-96"],
            movieContainer
          );
          dom.createElement(
            "h2",
            {},
            ["text-xl"],
            movieContainer
          ).textContent = `${
            global.search.type === "movie" ? result.title : result.name
          }`;
          dom.createElement(
            "h2",
            {},
            ["text-xl"],
            movieContainer
          ).textContent = `Release: ${
            global.search.type === "movie"
              ? result.release_date
              : result.first_air_date
          }`;
          dom.createElement(
            "span",
            {},
            ["text-xl"],
            movieContainer
          ).textContent = `Rating: ${result.vote_average.toFixed(1)} / 10`;
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
  search,
  routingSwitch
);
