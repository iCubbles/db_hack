const assert = require('assert');
const index = require('../src/index');

describe('asserts', () => {

  it('check booking proposals', async () => {
    const response = await index.main()
    console.log(response);
    const distances = [];
    response.items.forEach(item => {
      distances.push(item.distance);
      assert.ok(item.distance >= 0, `Expected distance to be >= 0 | was "${item.distance}"`);
    });
    console.log(distances);
  });


});
