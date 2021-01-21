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

/*
    This uses the ‘haversine’ formula to calculate the great-circle distance between two points – that is, the shortest distance over the earth’s surface – giving an ‘as-the-crow-flies’ distance between the points (ignoring any hills they fly over, of course!).
*/
// let lat1=0;
// let lat2=0;
// let lon1=0;
// let lon2=0;

// const φ1 = currentLat * Math.PI/180; // φ, λ in radians
// const φ2 = lat2 * Math.PI/180;
// const Δφ = (lat2-currentLat) * Math.PI/180;
// const Δλ = (lon2-currentLong) * Math.PI/180;

// const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
// const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

// const d = R * c; // in metres

const currentLatRads = currentLat * Math.PI/180;
const currentLonRads = currentLong * Math.PI/180; // This may be wrong...

const destLat = Math.asin(Math.sin(currentLat)*Math.cos(d/R) + Math.cos(currentLat)*Math.sin(d/R)*Math.cos(bearing));
const destLong = currentLong + Math.atan2(Math.sin(bearing)*Math.sin(d/R)*Math.cos(currentLat),Math.cos(d/R)-Math.sin(currentLat)*Math.sin(destLat));

console.log(currentLatRads);
console.log(currentLonRads);

// export {}