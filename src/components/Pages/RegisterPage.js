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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import panteonLogo from "../../assets/images/panteon.png";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { ResultType } from "../../enums/result-type";

function RegisterPage() {
  const [registerInfo, setRegisterInfo] = useState(null);
  let navigate = useNavigate();
  const theme = createTheme();
  const [setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const [username, setUsername] = useState("");
  const [isValidUsername, setIsValidUsername] = useState(true);

  const baseURL = "https://16.171.27.88/api"; // Base URL'nin sonunda / olmamasına dikkat edin

  const httpClient = axios.create({
    baseURL,
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    //send the request
    const registerRequest = {
      Username: data.get("Username"),
      Email: data.get("Email"),
      password: data.get("password"),
    };
    httpClient
      .post("/PanteonTestCase/Register", registerRequest)
      .then((response) => {
        setRegisterInfo(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async function registerSuccess() {
    toast.success(registerInfo.message);
    navigate("/login");
  }

  React.useEffect(() => {
    if (registerInfo != null) {
      registerInfo?.resultType === ResultType.Success
        ? registerSuccess()
        : toast.error(registerInfo.message);
    }
  }, [registerInfo]);

  const validateEmail = (input) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(input);
  };

  const handleChange = (event) => {
    const inputEmail = event.target.value;
    setEmail(inputEmail);
    setIsValidEmail(validateEmail(inputEmail));
  };

  const validateUsername = (input) => {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    return usernameRegex.test(input) && input === input.replace(/\s+/g, "");
  };

  const handleChangeName = (event) => {
    const inputUsername = event.target.value;
    setUsername(inputUsername);
    setIsValidUsername(validateUsername(inputUsername));
  };

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

  return (
    <div className="Register">
      <header className="Register-header">
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
                Sign Up
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="Username"
                  label="Username"
                  name="Username"
                  autoComplete="Username"
                  autoFocus
                  value={username}
                  onChange={handleChangeName}
                  error={!isValidUsername}
                  helperText={
                    !isValidUsername
                      ? "Enter a valid username (without spaces)."
                      : ""
                  }
                />
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
                  Sign Up
                </Button>
                <Grid container>
                  <Grid item xs></Grid>
                  <Grid item>
                    <Link href="/" variant="body2">
                      {"Do you have a account? Sign In"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </header>
    </div>
  );
}

export default RegisterPage;
