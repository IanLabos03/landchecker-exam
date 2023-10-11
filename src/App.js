import React, { useState } from "react";
import {
  Box,
  Skeleton,
  Typography,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import { useJsApiLoader, GoogleMap, MarkerF } from "@react-google-maps/api";
import { properties } from "./properties";

const center = { lat: -37.9373447811622, lng: 145.449895817713 };
const drawerWidth = 240;

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [open, setOpen] = useState(false);
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);
  const [selectedCouncil, setSelectedCouncil] = useState(""); // Step 1

  const handleCouncilChange = (event) => {
    setSelectedCouncil(event.target.value); // Step 2
  };

  if (!isLoaded) {
    return <Skeleton variant="rectangular" width={"100%"} height={"100%"} />;
  }

  const handleClickOpen = (property_id, council, full_address, postcode) => {
    setSelectedMarkerData({ property_id, council, full_address, postcode });
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };

  // Step 3: Filter properties based on selectedCouncil
  const filteredProperties = properties.filter(
    ({ council }) => !selectedCouncil || council === selectedCouncil
  );

  return (
    <>
      <Box
        sx={{ display: "flex", justifyContent: "flex-start", margin: "20px" }}
      >
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">Council</InputLabel>
          <Select
            value={selectedCouncil}
            onChange={handleCouncilChange}
            variant="outlined"
            style={{ width: "200px" }}
            label="council"
            size="small"
          >
            <MenuItem value="">All Councils</MenuItem>
            {/* Create a list of unique councils from properties */}
            {[...new Set(properties.map((property) => property.council))].map(
              (council, index) => (
                <MenuItem key={index} value={council}>
                  {council}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ height: "90vh", width: "100%", display: "flex" }}>
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {filteredProperties.map(
            ({ lat, lng, council, full_address, postcode, property_id }) => (
              <MarkerF
                key={property_id}
                position={{ lat, lng }}
                onClick={() => {
                  handleClickOpen(property_id, council, full_address, postcode);
                }}
              />
            )
          )}
        </GoogleMap>
      </Box>
      <Box>
        <Drawer
          open={open}
          onClose={handleClickClose}
          variant="persistent"
          anchor="right"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            height: "90%",
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              marginTop: 10,
            },
          }}
        >
          <Box>
            <IconButton onClick={handleClickClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedMarkerData && (
            <Typography>
              Property ID: {selectedMarkerData.property_id}
              <br />
              Council: {selectedMarkerData.council}
              <br />
              Address: {selectedMarkerData.full_address}
              <br />
              Postcode: {selectedMarkerData.postcode}
            </Typography>
          )}
        </Drawer>
      </Box>
    </>
  );
}

export default App;
