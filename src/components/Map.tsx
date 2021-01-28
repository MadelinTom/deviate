import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

import { DistanceTab } from "./DistanceTab";
import { GenerateTab } from "./GenerateTab";
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
  const [runDistance, setRunDistance] = useState(null);
  const [map, setMap] = React.useState(null);

  const directionsService = useRef();
  const directionsRenderer = useRef();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      process.env.REACT_APP_API_KEY || "API_KEY",
  });

  useEffect(() => {
    if (isLoaded) {
      //@ts-ignore
      directionsService.current = new google.maps.DirectionsService();
      //@ts-ignore
      directionsRenderer.current = new google.maps.DirectionsRenderer({
        draggable: true,
      });

      //@ts-ignore
      directionsRenderer.current.addListener("directions_changed", () => {
        //@ts-ignore
        computeTotalDistanceFromDirectionsResult(directionsRenderer.current.getDirections()
        );
      });
    }
  }, [isLoaded]);

  /*
    Map setup and teardown callbacks
  */
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

    //@ts-ignore
    directionsRenderer.current.setMap(map);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  /*
    Generate button onClick handler
  */
  const calculateNewCoords = (dist: number) => {
    const directionsServiceOptions = getDirectionsServiceOptions(
      position.lat,
      position.long,
      dist || 5000
    );

    //@ts-ignore
    directionsService.current.route(
      directionsServiceOptions,
      (result: any, status: any) => directionsServiceCallback(result, status)
    );
  };

  /*
    DirectionsService callback 
      - Update run distance state
      - Set directions on DirectionsRenderer
  */
  const directionsServiceCallback = (result: any, status: any) => {
    if (status == "OK") {
      console.log("dist: ", result.routes[0].legs[0].distance);
      setRunDistance(result.routes[0].legs[0].distance);

      //@ts-ignore
      directionsRenderer.current.setDirections(result);
    } else {
      console.log("directionsServiceCallback", result, status);
    }
  };

  /*
    DirectionsRenderer callback
      - Update run distance state
  */
  const computeTotalDistanceFromDirectionsResult = (
    result: google.maps.DirectionsResult
  ) => {
    let distanceObject = result.routes[0].legs[0].distance;

    //@ts-ignore
    setRunDistance({ text: distanceObject.text, value: distanceObject.value });
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
          </GoogleMap>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default React.memo(Map);
