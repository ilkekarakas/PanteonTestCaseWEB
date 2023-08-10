import "./App.css";
import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LoginPage from "./components/Pages/LoginPage";
import BuildingConfigurationPage from "./components/Pages/BuildingConfigurationPage";
import RegisterPage from "./components/Pages/RegisterPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Header from "./components/Pages/header/Header";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user_info'));
    if (userInfo && userInfo.id) {
      setIsLoggedIn(true);
    }

    const handleStorageChange = (e) => {
      if (e.key === 'user_info' && !e.newValue) {
        toast.error("Your session will expire after a short while.")
        setIsLoggedIn(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  

  const theme = createTheme({
    palette: {
      primary: {
        main: "#0d47a1",
      },
      secondary: {
        main: "#01579b",
      },
    },
  });
  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
        <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/building-configuration" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route
            path="/building-configuration"
            element={isLoggedIn ? <BuildingConfigurationPage /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={isLoggedIn ? <Navigate to="/building-configuration" /> : <RegisterPage />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    <ToastContainer />
    </div>
  );
}

export default App;
