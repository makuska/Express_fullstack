import ReactDOM from 'react-dom/client';
import App from './App';

import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
// import AboutPage from "./pages/AboutPage";
// import ContactPage from "./pages/ContactPage";

// TODO move all the routing logic to a separate file (Router); this should only render the <App/> component. https://github.com/finiam/phoenix_starter/blob/master/frontend/src/components/App.tsx
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        // errorElement: <ErrorPage />
    },
    {
        path: "/dashboard",
        element: <DashboardPage />
    },
    // {
    //     path: "/about",
    //     element: <AboutPage />,
    // },
    // {
    //     path: "/contact",
    //     element: <ContactPage />,
    // },
    {
        path: "/*",
        element: <NotFoundPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    }
    // {
    //     path: "/*",
    //     element: <Navigate to="/404"/>,
    // }
]);

// The '!' mark asserts that this value is NEVER null - no type errors anymore
const root: ReactDOM.Root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <RouterProvider router={router} />
);

