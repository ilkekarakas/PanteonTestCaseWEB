import axios from "axios";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import panteonLogo from "../../assets/images/panteon.png";
import { ResultType } from "../../enums/result-type";

function LoginPage({ setIsLoggedIn }) {
  const [loggedInfo, setloggedInfo] = useState(null);
  let navigate = useNavigate();
  const theme = createTheme();

  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (input) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(input);
  };

  const handleChange = (event) => {
    const inputEmail = event.target.value;
    setEmail(inputEmail);
    setIsValidEmail(validateEmail(inputEmail));
  };

  const baseURL = "https://16.171.27.88/api"; // Base URL'nin sonunda / olmamasına dikkat edin

  const httpClient = axios.create({
    baseURL
  });

  async function login() {
    localStorage.setItem("user_info", JSON.stringify(loggedInfo.data));
    setIsLoggedIn(true);
    toast.success(loggedInfo.message);
    navigate("/building-configuration");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    //send the request
    const loginRequest = {
      Email: data.get("Email"),
      password: data.get("password"),
    };
    httpClient
      .post("/PanteonTestCase/Login", loginRequest)
      .then((response) => {
        setloggedInfo(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const validatePassword = (input) => {
    const uppercaseRegex = /^(?=.*[A-Z])/;
    const lowercaseRegex = /^(?=.*[a-z])/;
    const numberRegex = /^(?=.*\d)/;
    const lengthRegex = /^.{8,}$/;

    return (
      uppercaseRegex.test(input) &&
      lowercaseRegex.test(input) &&
      numberRegex.test(input) &&
      lengthRegex.test(input)
    );
  };

  const handleChangePassword = (event) => {
    const inputPassword = event.target.value;
    setPassword(inputPassword);
    setIsPasswordValid(validatePassword(inputPassword));
  };

  React.useEffect(() => {
    if (loggedInfo != null) {
      loggedInfo?.resultType === ResultType.Success
        ? login()
        : toast.error(loggedInfo.message);
    }
  }, [loggedInfo]);

  return (
    <div className="Login">
      <header className="Login-header">
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={panteonLogo}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  width: "auto",
                }}
              />
              <Typography component="h1" variant="h5">
                Sign In
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="Email"
                  label="Email"
                  name="Email"
                  autoComplete="Email"
                  autoFocus
                  onChange={handleChange}
                  error={!isValidEmail}
                  helperText={!isValidEmail ? "Enter a valid email." : ""}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handleChangePassword}
                  error={!isPasswordValid}
                  helperText={
                    !isPasswordValid
                      ? "Your password must contain at least 8 characters, uppercase letters, lowercase letters and numbers."
                      : ""
                  }
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs></Grid>
                  <Grid item>
                    <Link href="register" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
        <ToastContainer />
      </header>
    </div>
  );
}

export default LoginPage;
