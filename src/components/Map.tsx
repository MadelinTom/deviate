import React, { useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";

import { DistanceTab } from "./DistanceTab";
import {GenerateTab} from "./GenerateTab";
import { getDirectionsServiceOptions } from "../util";
import mapStyle from "../mapStyle.json";

const containerStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  "justify-content": "space-between",
  "flex-direction": "column-reverse",
};

const Map = () => {
  const [position, setPosition] = useState({ lat: 0, long: 0 });
  const [directionsResult, setDirectionsResult] = useState(null);
  const [runDistance, setRunDistance] = useState(null);

  const [map, setMap] = React.useState(null);
  let directionsService: any;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      process.env.API_KEY || "API_KEY",
  });

  const directionsServiceCallback = (result: any, status: any) => {
    if (status == "OK") {
      console.log("dist: ", result.routes[0].legs[0].distance);
      setRunDistance(result.routes[0].legs[0].distance);
      setDirectionsResult(result);
    } else {
      console.log("directionsServiceCallback", result, status);
    }
  };

  const onLoad = React.useCallback(function callback(map) {
    map.setOptions({ styles: mapStyle, disableDefaultUI: true });

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

  const calculateNewCoords = (dist: number ) => {
    const directionsServiceOptions = getDirectionsServiceOptions(
      position.lat,
      position.long,
      dist || 5000
    );

    directionsService = new google.maps.DirectionsService();

    directionsService.route(
      directionsServiceOptions,
      (result: any, status: any) => directionsServiceCallback(result, status)
    );
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
            {/* DISTANCE AND GENERATE BUTTON */}
            <GenerateTab onClick={calculateNewCoords} />

            {/* ROUTE DISTANCE */}
            {runDistance !== null ? (
              <DistanceTab distance={runDistance} />
            ) : null}

            {/* DIRECTIONS */}
            {directionsResult !== null ? (
              <DirectionsRenderer
                // required
                options={{
                  directions: directionsResult || undefined,
                  draggable: true,
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
