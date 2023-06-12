import { FetchAPI } from "./fetchAPI";
import { CreateDOM } from "./createDOM";
import { randomIntFromInterval } from "./dom.tools";

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
    const genreFilterListItem = dom.createElement(
      "li",
      {},
      [type, "hidden"],
      container
    );
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

export function renderPreview(url: string, containerClass: string) {
  const domContainer = document.querySelector(
    containerClass
  ) as HTMLImageElement;

  const rndIntForResult: number = randomIntFromInterval(0, 19);

  const randomResult: number = rndIntForResult % 20;

  api.get(url).then((data) => {
    const singleResult = data.results[randomResult];
    if (domContainer) {
      domContainer.src = `https://image.tmdb.org/t/p/w1280${singleResult.backdrop_path}`;
    }
    console.log("SINGLE-result:", singleResult);
  });
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
          ["m-2", "bg-gray-900", "p-2", "flex", "flex-col", "justify-between"],
          domContainer
        );
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
          ["object-contain", "w-full"],
          detailsLink
        );
        const cardInfoContainer = dom.createElement(
          "div",
          {},
          ["justify-self-center", "mt-4"],
          movieContainer
        );
        dom.createElement(
          "h2",
          {},
          ["text-xl", "text-bold", "font-semibold"],
          cardInfoContainer
        ).textContent = `${
          global.currentPage === "/" || global.currentPage === "index.html"
            ? result.title
            : result.name
        }`;
        const ratingDiv = dom.createElement(
          "div",
          {},
          ["flex", "gap-2"],
          cardInfoContainer
        );
        dom.createElement(
          "span",
          {},
          ["fa-solid", "fa-star", "self-center"],
          ratingDiv
        );

        dom.createElement(
          "span",
          {},
          ["text-xl"],
          ratingDiv
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

export async function displayDetails(
  container: any,
  type: string,
  imageContainer: any
) {
  const itemId = window.location.search.split("=")[1];

  const imageBackdrop = document.querySelector(
    imageContainer
  ) as HTMLImageElement;

  const domContainer = document.querySelector(container);

  api.get(`${type}/${itemId}`).then((data) => {
    console.log("MOVIE/TV - DATA:: DISPLAY DETAILS", data);
    if (domContainer instanceof HTMLElement) {
      imageBackdrop.src = `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`;

      const movieContainer = dom.createElement(
        "div",
        { "data-id": data.id },
        ["flex", "flex-col", "m-2"],
        domContainer
      );

      const upperContainer = dom.createElement(
        "div",
        { "data-id": data.id },
        ["flex", "justify-between", "items-center", "mb-4"],
        movieContainer
      );

      const detailsLeft = dom.createElement(
        "div",
        { "data-id": data.id },
        ["text-left", "flex", "flex-col"],
        upperContainer
      );
      const detailsRight = dom.createElement(
        "div",
        { "data-id": data.id },
        ["text-center"],
        upperContainer
      );
      dom.createElement(
        "h2",
        {},
        ["text-l", "font-semibold"],
        detailsLeft
      ).textContent = data.title;
      dom.createElement(
        "img",
        { src: `https://image.tmdb.org/t/p/w1280${data.poster_path}` },
        ["object-contain", "h-48", "w-full"],
        detailsRight
      );

      dom.createElement("h2", {}, ["text-sm"], detailsLeft).textContent =
        data.release_date
          ? `Release date: ${data.release_date}`
          : `First air date: ${data.first_air_date}`;
      dom.createElement(
        "span",
        {},
        ["text-sm"],
        detailsLeft
      ).textContent = `Rating: ${data.vote_average.toFixed(1)} / 10`;
      dom.createElement("h5", {}, ["italic"], movieContainer).textContent =
        data.tagline;
      dom.createElement("p", {}, [], movieContainer).textContent =
        data.overview;
      const genreContainer = dom.createElement(
        "div",
        {},
        ["mt-8", "mb-8", "border-t-2"],
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
            "rounded-sm",
            "bg-slate-500",
            "px-2",
            "py-1",
            "m-2",
            "text-xs",
            "font-medium",
            "text-white",
          ],
          genreList
        ).textContent = genre.name;
      });
      const buttonsContainer = dom.createElement(
        "div",
        {},
        ["text-left", "flex", "gap-2"],
        detailsLeft
      );
      dom.createElement(
        "a",
        {
          href: `https://www.imdb.com/title/${data.imdb_id}/`,
          target: "_blank",
        },
        [
          "p-2",
          "text-blue-100",
          "no-underline",
          "border",
          "rounded-sm",
          "hover:bg-blue-600",
        ],
        buttonsContainer
      ).textContent = `imdb`;
      dom.createElement(
        "a",
        {
          href: `${data.homepage}`,
          target: "_blank",
        },
        [
          "p-2",
          "text-blue-100",
          "no-underline",
          "border",
          "rounded-sm",
          "hover:bg-orange-600",
        ],
        buttonsContainer
      ).textContent = `homepage`;
      const infoContainer = dom.createElement(
        "div",
        {},
        ["border-t-2"],
        movieContainer
      );
      dom.createElement("h2", {}, ["bt-2", "mt-8"], infoContainer).textContent =
        "Details";
      dom.createElement("h4", {}, ["text-xl"], infoContainer).textContent =
        "Production countries";
      const productionCountries = dom.createElement(
        "ul",
        {},
        [],
        infoContainer
      );
      data.production_countries.forEach((country: any) => {
        dom.createElement(
          "li",
          {},
          [
            "inline-flex",
            "items-left",
            "rounded-sm",
            "bg-slate-500",
            "px-2",
            "py-1",
            "text-xs",
            "font-medium",
            "text-white",
          ],
          productionCountries
        ).textContent = country.name;
      });
      dom.createElement("h4", {}, ["text-xl"], infoContainer).textContent =
        "Production companies";
      const productionCompanies = dom.createElement(
        "ul",
        {},
        [],
        infoContainer
      );
      data.production_companies.forEach((company: any) => {
        dom.createElement(
          "li",
          {},
          [
            "inline-flex",
            "items-left",
            "rounded-sm",
            "bg-slate-500",
            "px-2",
            "py-1",
            "text-xs",
            "font-medium",
            "text-white",
          ],
          productionCompanies
        ).textContent = company.name;
      });
      dom.createElement(
        "h4",
        {},
        ["text-xl"],
        infoContainer
      ).textContent = `Budget ${data.budget}`;
      dom.createElement(
        "h4",
        {},
        ["text-xl"],
        infoContainer
      ).textContent = `Runtime ${data.runtime}`;

      dom.createElement(
        "h4",
        {},
        ["text-xl"],
        infoContainer
      ).textContent = `Runtime ${data.revenue}`;
    }
  });
}
