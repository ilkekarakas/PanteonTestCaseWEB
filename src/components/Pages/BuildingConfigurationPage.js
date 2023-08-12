import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "react-toastify/dist/ReactToastify.css";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FormControl, InputLabel, Modal } from "@mui/material";
import { toast } from "react-toastify";
import { ResultType } from "../../enums/result-type";
import CloseIcon from "@mui/icons-material/Close";
import UpdateIcon from "@mui/icons-material/Create";
import Tooltip from "@mui/material/Tooltip";

function BuildingConfigurationPage() {
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const bearerToken = userInfo.token.accessToken;
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const BuildingTypes = {
    Farm: 1,
    Academy: 2,
    Headquarters: 3,
    LumberMill: 4,
    Barracks: 5,
  };

  const BuildingTypeStrings = {
    [BuildingTypes.Farm]: "Farm",
    [BuildingTypes.Academy]: "Academy",
    [BuildingTypes.Headquarters]: "Headquarters",
    [BuildingTypes.LumberMill]: "Lumber Mill",
    [BuildingTypes.Barracks]: "Barracks",
  };

  const positiveNumberPattern = /^[1-9]\d*$/;
  const [data, setData] = useState([]);
  const [buildingTypesData, setBuildingTypesData] = useState([]);
  const [selectedRowdata, setSelectedRowData] = useState([]);
  const theme = createTheme();

  const [selectedOption, setSelectedOption] = useState("");
  const [header, setHeader] = useState("Add New Building Configuration");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleInput = (event) => {
    const { value } = event.target;
    const parsedValue = parseInt(value, 10);

    if (!isNaN(parsedValue) && parsedValue > 0) {
      event.target.value = parsedValue;
    } else {
      event.target.value = "";
    }
  };

  const baseURL = "http://16.171.27.88/api"; // Base URL'nin sonunda / olmamasına dikkat edin

  const httpClient = axios.create({
    baseURL
  });

  async function handleUpdateSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    //send the request
    const buildingConfigurationRequest = {
      Id: null,
      BuildingType: data.get("BuildingType"),
      BuildingCost: data.get("BuildingCost"),
      ConstructionTime: data.get("ConstructionTime"),
    };
    if (selectedRowdata != null && selectedRowdata.id != null) {
      buildingConfigurationRequest.Id = selectedRowdata.id;
      buildingConfigurationRequest.BuildingType = selectedRowdata.buildingType;
    }
    httpClient
      .post(
        "/PanteonTestCase/AddOrUpdateBuildingConfiguration",
        buildingConfigurationRequest,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      )
      .then((response) => {
        if (response.data.resultType === ResultType.Success) {
          toast.success(response.data.message);
          fetchData();
          handleClose();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    httpClient
      .get("/PanteonTestCase/GetBuildingConfigurationList", {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    httpClient
      .get("/PanteonTestCase/GetBuildingTypes", {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      })
      .then((response) => {
        setBuildingTypesData(response.data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div style={{ padding: "5%" }}>
      <h1>Building Configuration</h1>
      <Container maxWidth="lg">
        <Tooltip
          title={
            buildingTypesData.length === 0
              ? "There are no building types available"
              : ""
          }
        >
          <span>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                setHeader("Add New Building Configuration");
                setSelectedRowData(null);
                handleOpen();
              }}
              disabled={buildingTypesData.length === 0 ? true : false}
            >
              + Add New Building Configuration
            </Button>
          </span>
        </Tooltip>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Building Type</TableCell>
                <TableCell align="center">Building Cost</TableCell>
                <TableCell align="center">Construction Time</TableCell>
                <TableCell align="center">Transaction</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">
                    {BuildingTypeStrings[row.buildingType]}
                  </TableCell>
                  <TableCell align="center">${row.buildingCost}</TableCell>
                  <TableCell align="center">
                    {row.constructionTime} hour
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      type="button"
                      onClick={() => {
                        setHeader("Update Building Configuration");
                        setSelectedRowData(row);
                        handleOpen();
                      }}
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      <UpdateIcon /> Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Button
            variant="contained"
            onClick={handleClose}
            style={{ float: "right" }}
          >
            <CloseIcon />
          </Button>
          <div align="center">
            <ThemeProvider theme={theme}>
              <Container component="main" maxWidth="xs">
                <CssBaseline />
                <h2>{header}</h2>
                <Box
                  sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="form"
                    onSubmit={handleUpdateSubmit}
                    sx={{ mt: 1 }}
                  >
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Building Type
                      </InputLabel>

                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={
                          selectedRowdata != null
                            ? selectedRowdata.buildingType
                            : selectedOption
                        }
                        label="Building Type"
                        onChange={handleOptionChange}
                        required
                        fullWidth
                        name="BuildingType"
                        autoComplete="BuildingType"
                        autoFocus
                        disabled={selectedRowdata != null ? true : false}
                        defaultValue={
                          selectedRowdata != null ??
                          selectedRowdata.buildingType
                        }
                      >
                        {selectedRowdata != null ? (
                          <MenuItem value={selectedRowdata.buildingType}>
                            {BuildingTypeStrings[selectedRowdata.buildingType]}
                          </MenuItem>
                        ) : (
                          buildingTypesData.map((option) => (
                            <MenuItem value={option.id}>{option.name}</MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>

                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="BuildingCost"
                      label="Building Cost"
                      id="BuildingCost"
                      autoComplete="BuildingCost"
                      defaultValue={
                        selectedRowdata != null
                          ? selectedRowdata.buildingCost
                          : ""
                      }
                      InputProps={{
                        inputProps: {
                          pattern: positiveNumberPattern.source,
                          title: "Please enter a positive number",
                        },
                        onChange: handleInput,
                      }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="ConstructionTime"
                      label="ConstructionTime"
                      id="ConstructionTime"
                      autoComplete="ConstructionTime"
                      InputProps={{
                        inputProps: {
                          pattern: positiveNumberPattern.source,
                          title: "Please enter a positive number",
                        },
                        onChange: handleInput,
                      }}
                      defaultValue={
                        selectedRowdata != null
                          ? selectedRowdata.constructionTime
                          : ""
                      }
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Submit
                    </Button>
                  </Box>
                </Box>
              </Container>
            </ThemeProvider>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default BuildingConfigurationPage;
