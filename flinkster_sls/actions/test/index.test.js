const assert = require('assert');
const index = require('../src/index');

describe('asserts', () => {

  it('check booking proposals', async () => {
    const result = await index.main({ radius: 10000 });
    const items = result.items;
    //console.log(response);
    const distances = [];
    items.forEach(item => {
      distances.push(item.distance);
      assert.ok(item.distance >= 0, `Expected distance to be >= 0 | was "${item.distance}"`);
    });
    console.log(JSON.stringify(distances));
  }).timeout(4000);

  it('check direction calc', async () => {
    let item = {
      position: {
        coordinates: [13.411440, 52.523430]
      }
    };
    const distances = [];
    item = await index.directions(item, 52.524945, 13.369661)
    distances.push(item.distance);
    assert.ok(item.distance >= 0, `Expected distance to be >= 0 | was "${item.distance}"`);
    assert.ok(item.duration >= 0, `Expected duration to be >= 0 | was "${item.duration}"`);
    console.log(JSON.stringify(distances));
  }).timeout(4000);

  it('get booking proposals with walkDistance', async () => {
    const result = await index.main({ calcWalkDistance: true })
    const items = result.items;
    //console.log(response);
    const distances = [];
    items.forEach(item => {
      distances.push(item.distance);
      assert.ok(item.distance >= 0, `Expected distance to be >= 0 | was "${item.distance}"`);
    });
    console.log(JSON.stringify(distances));
  }).timeout(4000);
});
