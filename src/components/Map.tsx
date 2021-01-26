import React, { useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";

import { getDirectionsServiceOptions } from "../util";
import mapStyle from "../mapStyle.json";

const containerStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  "flex-direction": "column-reverse",
};

const Map = () => {
  const [position, setPosition] = useState({ lat: 0, long: 0 });
  const [directionsResult, setDirectionsResult] = useState(null);

  const [map, setMap] = React.useState(null);
  let directionsService: any;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      process.env.API_KEY || "API_KEY",
  });

  const directionsServiceCallback = (result: any, status: any) => {
    if (status == "OK") {
      setDirectionsResult(result);
    } else {
      console.log("directionsServiceCallback", result, status);
    }
  };

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    map.setOptions({ styles: mapStyle });

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        setPosition({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      });
    }

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const calculateNewCoords = () => {
    //@ts-ignore
    const dist = document.getElementById("distance").value * 1000;

    const directionsServiceOptions = getDirectionsServiceOptions(
      position.lat,
      position.long,
      dist || 5000
    );

    directionsService = new google.maps.DirectionsService();

    directionsService.route(directionsServiceOptions, (result: any, status: any) =>
      directionsServiceCallback(result, status)
    );

    console.log("DIRECTION SERVICE", directionsService, directionsServiceOptions);
  };

  return isLoaded ? (
    <>
      <div
        style={{
          display: "flex",
          alignSelf: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          zIndex: 0,
        }}
      >
        {/* For some reason this styling works */}
        <div style={{ height: "100vh", width: "100%" }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={new google.maps.LatLng(position.lat, position.long)}
            onLoad={onLoad}
            onUnmount={onUnmount}
            zoom={14}
          >
            <div
              id={"contentDiv"}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                id={"form"}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  backgroundColor: "grey",
                  borderRadius: "10px",
                  alignItems: "center",
                  opacity: "0.7",
                  margin: "50px",
                }}
              >
                <form style={{ zIndex: 2, margin: "10px" }}>
                  <label>Distance in km:</label>
                  <br />
                  <input type="number" id="distance" name="distance" />
                </form>

                <button
                  style={{
                    margin: "10px",
                    width: "200px",
                    height: "50px",
                    zIndex: 2,
                  }}
                  onClick={() => calculateNewCoords()}
                >
                  Generate
                </button>
              </div>
            </div>

            {directionsResult !== null ? (
              <DirectionsRenderer
                // required
                options={{
                  directions: directionsResult || undefined,
                }}
                // optional
                onLoad={(directionsRenderer) => {
                  console.log(
                    "DirectionsRenderer onLoad directionsRenderer: ",
                    directionsRenderer
                  );
                }}
                // optional
                onUnmount={(directionsRenderer) => {
                  console.log(
                    "DirectionsRenderer onUnmount directionsRenderer: ",
                    directionsRenderer
                  );
                }}
              />
            ) : null}
          </GoogleMap>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default React.memo(Map);
