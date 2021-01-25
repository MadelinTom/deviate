import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { getRandomLatLonWithDistance } from "../util";
import mapStyle from "../mapStyle.json";

const containerStyle = {
  width: "100%",
  height: "100%",
}; //  display: "flex",

const Map = () => {
  const [position, setPosition] = useState({ lat: 0, long: 0 });

  const [map, setMap] = React.useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position.coords.latitude)
        console.log(position.coords.longitude)
        setPosition({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      });
    } else {
      console.log("This app requires your location");
    }
  }, [map]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      process.env.API_KEY || "API_KEY",
  });

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    map.setOptions({styles: mapStyle, zoom: 14})
    map.setCenter(new google.maps.LatLng(position.lat, position.long));
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const calculateNewCoords = () => {
    //@ts-ignore
    const dist = document.getElementById("distance").value;
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
          >
            <div
              id={"contentDiv"}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
                backgroundColor: "red",
              }}
            >
              <form style={{ zIndex: 2 }}>
                <label>Distance in m:</label>
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
                Random
              </button>
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
