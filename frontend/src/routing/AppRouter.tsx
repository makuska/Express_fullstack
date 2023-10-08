import {Route, Routes} from "react-router-dom";
import {HomePage} from "../pages/HomePage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import RegisterPage from "../pages/RegisterPage.tsx";
import AuthenticatedRoute from "./AuthenticatedRoute.tsx";
import DashboardPage from "../pages/DashboardPage.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import Footer from "../components/Footer.tsx";

function AppRouter(){
  return (
    <Routes>
      <Route
      path="/"
      element={<HomePage />}
      />
      <Route
        path="/login"
        element={<LoginPage />}
      />
      <Route
        path="/register"
        element={<RegisterPage />}
      />
      <Route
        path="/dashboard"
        element={
          <AuthenticatedRoute >
            <DashboardPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthenticatedRoute >
            <Footer />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  )
}

export default AppRouter