import "./style.css";
import { FetchAPI } from "./components/fetchAPI";

const api = new FetchAPI("https://dog.ceo/api/breeds/image/");

console.log(api.get("random").then((data) => console.log(data)));

const main = () => {
  console.log("console test");
};

main();
