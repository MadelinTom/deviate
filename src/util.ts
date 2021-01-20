/*
    Formula: 	destLat = asin( sin currentLat ⋅ cos δ + cos currentLat ⋅ sin δ ⋅ cos θ )
	            destLong = λ1 + atan2( sin θ ⋅ sin δ ⋅ cos currentLat, cos δ − sin currentLat ⋅ sin destLat )
    Where: 	  φ is latitude, λ is longitude, θ is the bearing (clockwise from north), δ is the angular distance d/R; d being the distance travelled, R the earth’s radius
*/

/*
    (60°)(π180° rad)=π3 rad
*/

// https://www.movable-type.co.uk/scripts/latlong.html

// TODO make sure to calculate angles in radians 

let currentLat = 51.486272882746455; // Current latitude
let currentLong = -0.121759730492082; // Current longitude
let R = 6371e3; // Earth's radius in km
let d = 5000; // Distance travelled
let bearing = 98 * Math.PI/180; // Clockwise from north in radians

const destLat = Math.asin(Math.sin(currentLat)*Math.cos(d/R) + Math.cos(currentLat)*Math.sin(d/R)*Math.cos(bearing));
const destLong = currentLong + Math.atan2(Math.sin(bearing)*Math.sin(d/R)*Math.cos(currentLat),Math.cos(d/R)-Math.sin(currentLat)*Math.sin(destLat));

console.log(destLat);
console.log(destLong);