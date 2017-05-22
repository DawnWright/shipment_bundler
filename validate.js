const fs = require('fs');
const _ = require('lodash');

function readWords(filename) {
  return fs.readFileSync(filename, 'utf8')
    .split('\n')
    .map(line => line.trim())
    .filter(_.identity)
    .map(line => line.split(' '));
}

const NEXT_DAY = {
  M: 'T',
  T: 'W',
  W: 'R',
  R: 'F',
};

const inputShipments = readWords(process.argv[2])
  .map(line => {
    const [id, start, finish, day] = line;
    return { id, start, finish, day };
  });

const outputBundles = readWords(process.argv[3]);

const expectedAnswers = parseInt(process.argv[4]);

const outputIds = _.flatten(outputBundles);
const inputIds = _.map(inputShipments, 'id');

function noDuplicates() {
  const dupes = _(outputIds).countBy(_.identity).toPairs().filter(([id, count]) => count > 1).map(0).value();
  dupes.forEach(duplicate => {
    console.error(`  duplicate id: ${duplicate}`);
  })
  return !dupes.length;
}

function everyShipmentUsed() {
  const lookups = _.keyBy(outputIds);
  const missingShipments = _.filter(inputIds, id => !lookups[id]);
  missingShipments.forEach(missingShipment => {
    console.error(`  missing shipment: ${missingShipment}`);
  });
  return missingShipments.length === 0;
}

function allBundlesValid() {
  const byId = _.keyBy(inputShipments, 'id');
  return _.every(outputBundles, bundle => {
    let bundleIsGood = true;
    for (let i = 0; i < bundle.length - 1; i++) {
      const shipment = bundle[i];
      const next = bundle[i + 1];
      const linedUp = (
        shipment.finish === next.start &&
        NEXT_DAY[shipment.day] === next.day
      );
      if (!linedUp) {
        console.error(`  bundle ${bundle} not valid`);
        console.error(`    ${shipment.id} -> ${next.id} is not lined up`);
      }
      bundleIsGood = bundleIsGood && linedUp;
    }
    return bundleIsGood;
  });
}

function correctNumberOfBundles() {
  const correct = outputBundles.length === expectedAnswers;
  if (!correct) {
    console.error(`  expected ${expectedAnswers} bundles - got ${outputBundles.length}`);
  }
  return correct;
}

const asserts = {
  noDuplicates,
  everyShipmentUsed,
  allBundlesValid,
  correctNumberOfBundles,
};

const results = _.map(asserts, (assertFn, name) => {
  const result = assertFn();
  if (!result) {
    console.error(`FAILED: ${name}`);
  }
  return [name, result];
});

const failedResults = _.filter(results, result => !result[1]);

if (failedResults.length) {
  process.exit(1);
}
