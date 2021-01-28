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

interface RunDistance {
  text: string;
  value: number;
}

interface Position {
  lat: number;
  long: number;
}

const Map = () => {
  const [position, setPosition] = useState<Position>({ lat: 0, long: 0 });
  const [runDistance, setRunDistance] = useState<RunDistance | null>(null);
  const [map, setMap] = React.useState<google.maps.Map<Element> | null>(null);

  const directionsService = useRef<google.maps.DirectionsService>();
  const directionsRenderer = useRef<google.maps.DirectionsRenderer>();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_API_KEY || "API_KEY",
  });

  useEffect(() => {
    if (isLoaded) {
      directionsService.current = new google.maps.DirectionsService();
      directionsRenderer.current = new google.maps.DirectionsRenderer({
        draggable: true,
      });

      directionsRenderer.current.addListener("directions_changed", () => {
        computeTotalDistanceFromDirectionsResult(
          directionsRenderer.current!.getDirections()
        );
      });
    }
  }, [isLoaded]);

  /*
    Map setup and teardown callbacks
  */
  const onLoad = React.useCallback(function callback(
    map: google.maps.Map<Element>
  ) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setPosition({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });

        map.setOptions({
          center: new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          ),
          styles: mapStyle,
          disableDefaultUI: true,
        } as google.maps.MapOptions);
      });
    }

    directionsRenderer.current!.setMap(map);

    setMap(map);
  },
  []);

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

    directionsService.current!.route(
      directionsServiceOptions,
      (result: any, status: any) => directionsServiceCallback(result, status)
    );
  };

  /*
    DirectionsService callback 
      - Update run distance state
      - Set directions on DirectionsRenderer
  */
  const directionsServiceCallback = (
    result: google.maps.DirectionsResult,
    status: google.maps.DirectionsStatus
  ) => {
    if (status == "OK") {
      console.log("dist: ", result.routes[0].legs[0].distance);
      setRunDistance(result.routes[0].legs[0].distance);

      directionsRenderer.current!.setDirections(result);
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
