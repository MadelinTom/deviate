import React from "react";
import Map from "./components/Map";

const center = {
  lat: 51.486272882746455,
  lng: -0.121759730492082,
};


function App() {
  return (
    <div className="root">
      <Map center={center} />
    </div>
  );
}

export default App;
