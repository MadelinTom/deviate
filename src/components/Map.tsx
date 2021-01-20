import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const Map = () => {
  const [position, setPosition] = useState({ lat: 0, long: 0 });

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
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      process.env.API_KEY || "API_KEY",
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <div style={{display: "flex", alignSelf: "center", justifyContent: "center", height: "100%"}}>
    <div style={{ height: "800px", width: "800px" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={new google.maps.LatLng(position.lat, position.long)}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <></>
      </GoogleMap>
    </div>

    </div>
  ) : (
    <></>
  );
};

export default React.memo(Map);
