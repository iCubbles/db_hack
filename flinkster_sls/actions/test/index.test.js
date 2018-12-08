const assert = require('assert');
const index = require('../src/index');

describe('asserts', () => {

  it('check booking proposals', async () => {
    const response = await index.main({radius: 10000})
    //console.log(response);
    const distances = [];
    response.items.forEach(item => {
      distances.push(item.distance);
      assert.ok(item.distance >= 0, `Expected distance to be >= 0 | was "${item.distance}"`);
    });
    console.log(distances);
  });

  it('check direction calc', async () => {
    const directionParams = {
      lat: 52.524945,
      lon: 13.369661,
      itemLat: 52.524398,
      itemLon: 13.366157
    }
    const response = await index.directions(directionParams)
    console.log(response);
    assert.ok(response.distance >= 0, `Expected distance to be >= 0 | was "${response.distance}"`);
    assert.ok(response.duration >= 0, `Expected duration to be >= 0 | was "${response.duration}"`);
  });

  it('get booking proposals with walkDistance', async () => {
    const response = await index.main({calcWalkDistance: true})
    //console.log(response);
    const distances = [];
    response.items.forEach(item => {
      distances.push(item.distance);
      assert.ok(item.distance >= 0, `Expected distance to be >= 0 | was "${item.distance}"`);
    });
    console.log(distances);
  });
});
