import { FetchAPI } from "./fetchAPI";
import { CreateDOM } from "./createDOM";

const api = new FetchAPI("https://api.themoviedb.org/3/", process.env.API_KEY);
const dom = new CreateDOM();

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
    genre: ([] = []),
    page: 1,
    totalPages: 1,
  },
};

export function createFilterListItems(container: any, data: any, type: string) {
  if (container instanceof HTMLElement) {
    const genreFilterListItem = dom.createElement("li", {}, [type], container);
    dom.createElement(
      "input",
      {
        id: `${data.id}-${type}`,
        type: "checkbox",
        value: data.id,
        name: "genre",
      },
      // ["hidden"],
      ["hidden", "peer"],
      genreFilterListItem
    );
    dom.createElement(
      "label",
      { for: `${data.id}-${type}` },
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
    ).textContent = data.name;

    return genreFilterListItem;
  }
}

export function renderMultipleItems(url: string, containerClass: string) {
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

export async function renderSearchResults() {
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

export async function displayDetails(container: any, type: string) {
  const itemId = window.location.search.split("=")[1];

  const domContainer = document.querySelector(container);

  api.get(`${type}/${itemId}`).then((data) => {
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
