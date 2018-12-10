const assert = require('assert');
const index = require('../src/index');

describe('asserts', () => {

  it('check booking proposals', async () => {
    const result = await index.main({ lat: 52.529362, lon: 13.370630, radius: 3000, calcWalkDistance: false });
    const items = result.items;
    //console.log(response);
    const distances = [];
    items.forEach(item => {
      distances.push(item.distance);
      assert.ok(item.distance >= 0, `Expected distance to be >= 0 | was "${item.distance}"`);
    });
    console.log(JSON.stringify(distances));
  }).timeout(4000);

  it('check booking proposals error due to "ConstraintValidation"', async () => {
    try {
      const result = await index.main({ lat: 511112.529362,  lon: 13.370630, radius: 3000, calcWalkDistance: false });
      assert.fail('Expected an error due to wrong latitude value.')
    } catch (error) {
      // {"errors":[{"code":2,"level":"ERROR","name":"ConstraintValidation","message":"must be between -90 and 90","attributes":{"constraintElementValue":511112.529362,"constraintElementName":"lat"}}]}

      console.log(error);
      assert.ok(error.indexOf('ConstraintValidation') > 0, 'Expected "ConstraintValidation" error.')
    }
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
