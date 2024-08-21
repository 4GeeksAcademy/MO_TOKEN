import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
//import { BackendURL } from "./component/backendURL";

import Signup from "./component/Signup";
import Login from "./component/Login";
import Private from "./component/Private";
import injectContext from "./store/appContext";

import { Footer } from "./component/footer";
import Landing from "./component/Landing";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "/";
    console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);
    console.log("Besename:", basename);

    //if(!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Routes>
                        <Route element={<Landing />} path="/" />
                        <Route element={<Signup />} path="/signup" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Private />} path="/private" />
                        <Route element={<h1>Not found!</h1>} path="*" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
