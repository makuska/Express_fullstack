import ReactDOM from 'react-dom/client';
import App from './App';

import {createBrowserRouter, RouterProvider} from "react-router-dom";
// import AboutPage from "./pages/AboutPage";
// import ContactPage from "./pages/ContactPage";
// import NotFoundPage from "./pages/NotFoundPage";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        // errorElement: <ErrorPage />
    },
    // {
    //     path: "/about",
    //     element: <AboutPage />,
    // },
    // {
    //     path: "/contact",
    //     element: <ContactPage />,
    // },
    // {
    //     path: "/*",
    //     element: <NotFoundPage />,
    // },
    // {
    //     path: "/login",
    //     element: <LoginPage />,
    // },
    // {
    //     path: "/register",
    //     element: <RegisterPage />,
    // }
    // {
    //     path: "/*",
    //     element: <Navigate to="/404"/>,
    // }
]);

// The '!' mark asserts that this value is NEVER null - no type errors anymore
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <RouterProvider router={router} />
);

