//import react into the bundle
import React from "react";
import ReactDOM from "react-dom";

//include your index.scss file into the bundle
import "../styles/index.css";

//import your own components
import Layout from "./layout";

console.log("BACKEND_URL:", process.env.BACKEND_URL);
console.log("BASENAME:", process.env.BASENAME);

//render your react application
ReactDOM.render(<Layout />, document.querySelector("#app"));
