import React from "react";
import ReactDOM from "react-dom/client";
import "./index.sass";
import reportWebVitals from "./reportWebVitals";
import Pokedexer from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Pokedexer />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
