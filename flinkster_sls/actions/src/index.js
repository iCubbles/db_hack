const rp = require('request-promise-native');
const authorization = 'Bearer b4be0828de244da82e6574cf902e38c5'; // by account hd4db
const ors_apikey = '5b3ce3597851110001cf6248e578d992470742c7a90a961cebca66c3';
/**
 *
 * @param { lat, lon, radius}
 *
 * radius: in meter (max. 10.000)
 */
async function main({ lat = '52.523430', lon = '13.411440', radius = 1000, calcWalkDistance = false } = {}) {
    const proposals = await bookingproposals({ lat, lon, radius });
    let items = proposals.items;
    await updateDistanceForAll(items, lat, lon, calcWalkDistance);
    return { items };
}

async function bookingproposals({ lat, lon, radius } = {}) {
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
    return rp(options);
}

/**
 * @param {} position
 * @param [] items
 */
async function updateDistanceForAll(items, lat, lon, calcWalkDistance) {
    const geodist = require('geodist');
    for (const item of items) {
        itemLat = item.position.coordinates[1];
        itemLon = item.position.coordinates[0];
        // calc the distance
        if (calcWalkDistance) {
            // note: this request the api of openrouteservice.org
            try {
                const routeSummary = await directions({
                    lat,
                    lon,
                    itemLat,
                    itemLon
                });
                item.distance = routeSummary.distance;
            } catch (error) {
                console.log(error);
            }
        } else {
            let distance = geodist({ lat, lon }, { lat: itemLat, lon: itemLon }, { exact: true, unit: 'meters' })
            item.distance = Math.round(distance);
        }
        // add the mapUrl
        item.mapUrl = `https://maps.openrouteservice.org/directions?n1=${lat}&n2=${lon}&n3=14&a=${lat},${lon},${itemLat},${itemLon}&b=2&c=0&g1=-1&g2=0&k1=de-DE&k2=km`
    };
    return Promise.resolve(items);
}

/**
 * Calculates the direction based on the given positions using openrouteservice.org
 * @see https://openrouteservice.org/dev/#/api-docs/directions/get
 * @param {*} param
 */
async function directions({ lat, lon, itemLat, itemLon } = {}) {
    const options = {
        uri: 'https://api.openrouteservice.org/directions',
        qs: {
            api_key: ors_apikey,
            coordinates: `${lon},${lat}|${itemLon},${itemLat}`,
            profile: 'foot-walking'
        },
        json: true // Automatically parses the JSON string in the response
    };
    try {
        console.log('openrouteservice options: ' + JSON.stringify(options));
        const result = await rp(options);
        // console.log('openrouteservice result: ' + result);
        return Promise.resolve({
            distance: Math.round(result.routes[0].summary.distance),
            duration: result.routes[0].summary.duration
        })
    } catch (error) {
        return Promise.reject(error.message);
    }
}

//exports.demo = demoAction;
exports.main = main;
exports.directions = directions;
