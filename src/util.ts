import { Position } from "./types/Map";

/*
    Destination point given distance and bearing from start point: 
    https://www.movable-type.co.uk/scripts/latlong.html

    Formula: 	destLat = asin( sin currentLat ⋅ cos δ + cos currentLat ⋅ sin δ ⋅ cos θ )
	            destLong = λ1 + atan2( sin θ ⋅ sin δ ⋅ cos currentLat, cos δ − sin currentLat ⋅ sin destLat )
    Where: 	  φ is latitude, λ is longitude, θ is the bearing (clockwise from north), δ is the angular distance d/R; d being the distance travelled, R the earth’s radius
*/

export const getRandomLatLonWithDistance = (
  currentLattitude: number,
  currentLongitude: number,
  distance: number
): Position => {
  let R = 6371e3; // Earth's radius in km
  let B = (generateRandomBearingInRadians() * Math.PI) / 180; // Clockwise from north in radians

  // Convert to radians
  const currentLatRads = (currentLattitude * Math.PI) / 180;
  const currentLonRads = (currentLongitude * Math.PI) / 180;

  // Calculate formula
  const destLat = Math.asin(
    Math.sin(currentLatRads) * Math.cos(distance / R) +
      Math.cos(currentLatRads) * Math.sin(distance / R) * Math.cos(B)
  );
  const destLong =
    currentLonRads +
    Math.atan2(
      Math.sin(B) * Math.sin(distance / R) * Math.cos(currentLatRads),
      Math.cos(distance / R) - Math.sin(currentLatRads) * Math.sin(destLat)
    );

  // Convert back to degrees
  const resultLat = (destLat / Math.PI) * 180;
  const resultLon = (destLong / Math.PI) * 180;

  return { lat: resultLat, long: resultLon };
};

/*
    Generate a random bearing (0 - 360 degrees)
*/
export const generateRandomBearingInRadians = (): number => {
  return randomIntFromInterval(0, 360);
};

const randomIntFromInterval = (min: number, max: number): number => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/*
    Build a directions query:
      - From current position
      - Generate 2 random waypoints 1/3 of distance away 
      - Back to current position
    Returns a loop roughly equal to distance
*/
export const getDirectionsServiceOptions = (
  currentLat: number,
  currentLong: number,
  distance: number
): google.maps.DirectionsRequest => {
  const dist = distance / 3;

  const firstRandomWaypoint = getRandomLatLonWithDistance(
    currentLat,
    currentLong,
    dist
  );
  const secondRandomWaypoint = getRandomLatLonWithDistance(
    currentLat,
    currentLong,
    dist
  );

  let result = {
    origin: new google.maps.LatLng(currentLat, currentLong),
    destination: new google.maps.LatLng(currentLat, currentLong),
    waypoints: [
      {
        location: new google.maps.LatLng(
          firstRandomWaypoint.lat,
          firstRandomWaypoint.long
        ),
        stopover: false,
      },
      {
        location: new google.maps.LatLng(
          secondRandomWaypoint.lat,
          secondRandomWaypoint.long
        ),
        stopover: false,
      },
    ],
    travelMode: google.maps.TravelMode.WALKING,
    unitSystem: google.maps.UnitSystem.IMPERIAL,
  };

  return result;
};
