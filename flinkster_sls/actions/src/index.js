const rp = require('request-promise-native');
const authorization = 'Bearer b4be0828de244da82e6574cf902e38c5' // by account hd4db

/**
 *
 * @param { lat, lon, radius}
 *
 * radius: in meter (max. 10.000)
 */
async function main({ lat = '52.524945', lon = '13.369661', radius = 10000 } = {}) {
    const proposals = await bookingproposals({ lat, lon, radius });
    let items = updateDistance({lat, lon}, proposals.items);
    // TODO: calculate item.distance
    // TODO: sort by distance
    return {items};
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
function updateDistance({ lat, lon}, items) {
    const geodist = require('geodist');
    items.forEach(item => {
        item.distance = geodist({lat, lon}, {lat: item.position.coordinates[0], lon: item.position.coordinates[1]})
    });
    items.sort((item1,item2) => item1.distance - item2.distance)
    return items;
}

//exports.demo = demoAction;
exports.main = main;
