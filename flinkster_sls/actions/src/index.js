const rp = require('request-promise-native');
const authorization = 'Bearer b4be0828de244da82e6574cf902e38c5'; // by account hd4db
const ors_apikey = '5b3ce3597851110001cf6248e578d992470742c7a90a961cebca66c3';
/**
 *
 * @param { object } param0
 *
 * radius: in meter (max. 10.000)
 */
async function main({ lat = '52.523430', lon = '13.411440', radius = 1000, calcWalkDistance = false } = {}) {
    const proposals = await bookingproposals(lat, lon, radius);
    let items = proposals.items;
    if (calcWalkDistance) {
        await updateWalkDistanceForAll(items, lat, lon)
    } else {
        updateGeoDistanceForAll(items, lat, lon, calcWalkDistance);
    }
    return Promise.resolve(items);
}

/**
 *
 * @param {object} param0
 */
async function bookingproposals(lat, lon, radius) {
    const options = {
        uri: 'https://api.deutschebahn.com/flinkster-api-ng/v1/bookingproposals',
        qs: {
            lat,
            lon,
            radius,
            providernetwork: 1,
            expand: 'rentalObject,area'
        },
        headers: {
            'Authorization': authorization
        },
        json: true // Automatically parses the JSON string in the response
    };
    return await rp(options);
}

/**
 *
 * @param {array} items
 * @param {double} lat
 * @param {double} lon
 * @param {boolean} calcWalkDistance
 */
function updateGeoDistanceForAll(items, lat, lon) {
    const geodist = require('geodist');
    for (const item of items) {
        itemLon = item.position.coordinates[0];
        itemLat = item.position.coordinates[1];
        // calc the distance
        let distance = geodist({ lat, lon }, { lat: itemLat, lon: itemLon }, { exact: true, unit: 'meters' })
        item.distance = Math.round(distance);
        // add the mapUrl
        item.mapUrl = `https://maps.openrouteservice.org/directions?n1=${lat}&n2=${lon}&n3=14&a=${lat},${lon},${itemLat},${itemLon}&b=2&c=0&g1=-1&g2=0&k1=de-DE&k2=km`
    };
    return items;
}

async function updateWalkDistanceForAll(items, lat, lon) {
    const allPromises = [];
    for (const item of items) {
        // calc the directions to get the distances
        allPromises.push(directions(item, lat, lon));
        // add the mapUrl
        item.mapUrl = `https://maps.openrouteservice.org/directions?n1=${lat}&n2=${lon}&n3=14&a=${lat},${lon},${itemLat},${itemLon}&b=2&c=0&g1=-1&g2=0&k1=de-DE&k2=km`
    };
    return await Promise.all(allPromises);
}

/**
 * Calculates the direction based on the given positions using openrouteservice.org
 *
 * @param {object} item
 * @param {double} lat
 * @param {double} lon
 *
 * @see https://openrouteservice.org/dev/#/api-docs/directions/get
 */
async function directions(item, lat, lon) {
    //console.log(item)
    const itemLat = item.position.coordinates[1];
    const itemLon = item.position.coordinates[0];
    const options = {
        uri: 'https://api.openrouteservice.org/directions',
        qs: {
            api_key: ors_apikey,
            coordinates: `${lon},${lat}|${itemLon},${itemLat}`,
            profile: 'foot-walking'
        },
        json: true
    };
    try {
        //console.log('openrouteservice options: ' + JSON.stringify(options));
        const result = await rp(options);
        item.distance = Math.round(result.routes[0].summary.distance);
        item.duration = result.routes[0].summary.duration;
        item.mapUrl = `https://maps.openrouteservice.org/directions?n1=${lat}&n2=${lon}&n3=14&a=${lat},${lon},${itemLat},${itemLon}&b=2&c=0&g1=-1&g2=0&k1=de-DE&k2=km`
        return Promise.resolve(item);
    } catch (error) {
        return Promise.reject(error.message);
    }
}

//exports.demo = demoAction;
exports.main = main;
exports.directions = directions;
