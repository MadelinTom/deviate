import React, { useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsService,
} from "@react-google-maps/api";

import { getRandomLatLonWithDistance } from "../util";
import mapStyle from "../mapStyle.json";

const containerStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  "flex-direction": "column-reverse",
};

const Map = () => {
  const [position, setPosition] = useState({ lat: 0, long: 0 });

  const [map, setMap] = React.useState(null);

  // const directionsServiceCallback = () => {};

  // const test = new DirectionsService({callback: directionsServiceCallback, options: {
  //   origin: new google.maps.LatLng(position.lat, position.long),
  //   destination: new google.maps.LatLng(position.lat, position.long),
  //   waypoints: [
  //     {
  //       location: 'Joplin, MO',
  //       stopover: false
  //     },{
  //       location: 'Oklahoma City, OK',
  //       stopover: true
  //     }],
  //   provideRouteAlternatives: false,
  //   drivingOptions: {
  //     departureTime: new Date(/* now, or future date */),
  //   },
  //   unitSystem: google.maps.UnitSystem.IMPERIAL
  // }});

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      process.env.API_KEY || "API_KEY",
  });

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
    const result = getRandomLatLonWithDistance(
      position.lat,
      position.long,
      dist || 5000
    );

    console.log(result);
    setPosition(result);
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
              <div id={"form"} style={{display: "flex", flexDirection: "row", backgroundColor: "grey", borderRadius: "10px", alignItems: "center", opacity: "0.7", margin: "50px"}}>
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
          </GoogleMap>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default React.memo(Map);
