import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

import {
  getDirectionsServiceOptions,
  getRandomLatLonWithDistance,
} from "../util";
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
  let directionsService: any;
  let directionsRenderer: any;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      process.env.API_KEY || "API_KEY",
  });

  // useEffect(() => {
  //   if (isLoaded) {
  //     // directionsRenderer = new google.maps.DirectionsRenderer();
  //     directionsService = new google.maps.DirectionsService();
  //   }
  // }, [isLoaded]);

  const directionsServiceCallback = (result: any, status: any) => {
    console.log("directionsServiceCallback", result, status);

    // if (status == "OK") {
    //   directionsRenderer.setDirections(result);
    // }
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
    // directionsRenderer.setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const calculateNewCoords = () => {
    //@ts-ignore
    const dist = document.getElementById("distance").value * 1000;

    const temp = getDirectionsServiceOptions(
      position.lat,
      position.long,
      dist || 5000
    );

    directionsService = new google.maps.DirectionsService();

    directionsService.route(temp, (result: any, status: any) =>
      directionsServiceCallback(result, status)
    );
    

    console.log("DIRECTION SERVICE", directionsService, temp);
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
          </GoogleMap>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default React.memo(Map);

/*
{
              (
                this.state.destination !== '' &&
                this.state.origin !== ''
              ) && (
                <DirectionsService
                  // required
                  options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                    destination: this.state.destination,
                    origin: this.state.origin,
                    travelMode: this.state.travelMode
                  }}
                  // required
                  callback={this.directionsCallback}
                  // optional
                  onLoad={directionsService => {
                    console.log('DirectionsService onLoad directionsService: ', directionsService)
                  }}
                  // optional
                  onUnmount={directionsService => {
                    console.log('DirectionsService onUnmount directionsService: ', directionsService)
                  }}
                />
              )
            }

            {
              this.state.response !== null && (
                <DirectionsRenderer
                  // required
                  options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                    directions: this.state.response
                  }}
                  // optional
                  onLoad={directionsRenderer => {
                    console.log('DirectionsRenderer onLoad directionsRenderer: ', directionsRenderer)
                  }}
                  // optional
                  onUnmount={directionsRenderer => {
                    console.log('DirectionsRenderer onUnmount directionsRenderer: ', directionsRenderer)
                  }}
                />
              )
            }
            */