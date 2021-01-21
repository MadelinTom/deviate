/*
    Destination point given distance and bearing from start point:

    Formula: 	destLat = asin( sin currentLat ⋅ cos δ + cos currentLat ⋅ sin δ ⋅ cos θ )
	            destLong = λ1 + atan2( sin θ ⋅ sin δ ⋅ cos currentLat, cos δ − sin currentLat ⋅ sin destLat )
    Where: 	  φ is latitude, λ is longitude, θ is the bearing (clockwise from north), δ is the angular distance d/R; d being the distance travelled, R the earth’s radius
*/

/*
    (60°)(π180° rad)=π3 rad
*/

// https://www.movable-type.co.uk/scripts/latlong.html



// Setup
let currentLat = 51.486272882746455; // Current latitude
let currentLong = -0.121759730492082; // Current longitude
let R = 6371e3; // Earth's radius in km
let d = 50000; // Distance travelled
let bearing = 98 * Math.PI/180; // Clockwise from north in radians

// Convert both to radians
const currentLatRads = currentLat * Math.PI/180;
const currentLonRads = currentLong * Math.PI/180; 

// Calculate formula
const destLat = Math.asin(Math.sin(currentLatRads)*Math.cos(d/R) + Math.cos(currentLatRads)*Math.sin(d/R)*Math.cos(bearing));
const destLong = currentLonRads + Math.atan2(Math.sin(bearing)*Math.sin(d/R)*Math.cos(currentLatRads),Math.cos(d/R)-Math.sin(currentLatRads)*Math.sin(destLat));

console.log(destLat);
console.log(destLong);
console.log("_________")

// Convert both back to degrees 
const resultLat = destLat / Math.PI * 180;
const resultLon = destLong / Math.PI * 180;

console.log(resultLat);
console.log(resultLon);

export {}