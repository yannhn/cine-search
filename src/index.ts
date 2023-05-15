import "./style.css";
import { FetchAPI } from "./components/fetchAPI";

const api = new FetchAPI("https://api.themoviedb.org/3/", process.env.API_KEY);

console.log(api.get("trending/movie/week").then((data) => console.log(data)));

function init(callback: any) {
  if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}
