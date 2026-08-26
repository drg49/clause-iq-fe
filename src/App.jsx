import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

const spinner = (
  <div className="spinner-wrapper">
    <FontAwesomeIcon icon={faSpinner} size="10x" color="gray" spin />
  </div>
);

const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Auth = lazy(() => import("./pages/Auth/Auth"));
const Profile = lazy(() => import("./pages/Profile/Profile"));

const AppContent = () => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      {isLoggedIn && (
        <div className="app-shell">
          <Suspense fallback={spinner}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/contracts"
                element={<Dashboard view="contracts" />}
              />
              <Route path="/settings" element={<Dashboard view="settings" />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Suspense>
        </div>
      )}
      {isLoggedIn === false && <Auth />}
      {isLoggedIn === null && <div id="main-spinner">{spinner}</div>}
      <ToastContainer limit={3} />
    </>
  );
};

const App = () => {
  const theme = createTheme({
    palette: {
      mode: "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
