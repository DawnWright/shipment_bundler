// Removes the given shipment from the set of shipments, returning a new array.
const removeShipment = (shipmentIndex, shipments) => {
  const remainingShipments = shipments.slice()
  remainingShipments.splice(shipmentIndex, 1)
  return remainingShipments
}

// Find the day of the week that occurs most frequently, and return its count.
// We know that we can't find a solution that is smaller than this number, so
// use it as a lower bound.
const findMaxDayCount = (shipments) => {
  const counts = {'M': 0, 'T': 0, 'W': 0, 'R': 0, 'F': 0}
  shipments.forEach(shipment => counts[shipment.dayOfWeek] += 1)
  return Object.keys(counts).reduce((maxCount, day) => Math.max(maxCount, counts[day]), 0)
}

const memoMinCombo = {}

// This method searches through all possible bundle combinations, and returns
// the smallest one found. Note that we short circuit when we hit the lower 
// bound, since there isn't any better possibility.
const findMinBundleCombo = (shipments) => {
  // We've cached the return value from this method. So if we've seen this same
  // shipment set before, there's no need to recompute it.
  const memoKey = shipments.map(shipments => shipments.id).join(' ')
  const memoValue = memoMinCombo[memoKey]
  if (memoValue) {
    return memoValue
  }

  const lowerBound = findMaxDayCount(shipments)

  let minCombo = null
  for (let i = 0; i < shipments.length; i++) {
    // Start a bundle with shipment 'i'. For each of those bundles, look for
    // sets of other bundles that will use the remaining shipments.
    const shipment = shipments[i]
    const remainingShipments = removeShipment(i, shipments)
    const bundlesStartingWithShipment = findAllBundlesStartingWithShipment(shipment, remainingShipments, true)
    for (let j = 0; j < bundlesStartingWithShipment.length; j++) {
      const {bundle, remainingShipments: remaining} = bundlesStartingWithShipment[j]
      if (remaining.length === 0) {
        // One bundle! We can't get better than this, so return immediately.
        return [bundle]
      } else {
        const minComboForRemaining = findMinBundleCombo(remaining)
        if (minComboForRemaining) {
          const newCombo = [bundle, ...minComboForRemaining]
          if (lowerBound === newCombo.length) {
            // Already found the smallest bundle set, so quit early.
            return newCombo
          } else if (!minCombo || minCombo.length > newCombo) {
            minCombo = newCombo
          }
        }
      }
    }
  }

  memoMinCombo[memoKey] = minCombo
  return minCombo
}

const NEXT_DAY = {
  M: 'T',
  T: 'W',
  W: 'R',
  R: 'F',
}

// Find all valid shipments from the ones remaining. A valid shipment occurs
// the next day and starts at the current city.
const nextPossibleShipments = (currentShipment, remainingShipments) => {
  const currentDay = currentShipment.dayOfWeek
  const nextDay = NEXT_DAY[currentDay]
  const currentCity = currentShipment.endCity
  return remainingShipments
    .filter(shipment => shipment.dayOfWeek === nextDay && shipment.startCity === currentCity)
}

const memoBundles = {}

// Starting with a given shipment, traverse the graph forward, creating bundles.
// Return all possible bundles that start with that shipment.
const findAllBundlesStartingWithShipment = (shipment, remainingShipments) => {
  // Memoize return values from this method to short-circuit with cached value.
  const memoKey = [shipment.id, ...remainingShipments.map(shipments => shipments.id)].join(' ')
  const memoValue = memoBundles[memoKey]
  if (memoValue) {
    return memoValue
  }

  const bundles = []

  // Walk forward from the start city, collecting bundle possibilities.
  // There's no need for loop detection in the graph, since we are moving
  // forward through days of the week, so it's not possible to repeat.
  const nextShipments = nextPossibleShipments(shipment, remainingShipments)
  nextShipments.forEach(nextShipment => {
    const nextRemaining = remainingShipments
      .filter(remainingShipment => remainingShipment.id !== nextShipment.id) // DAWNTODO: simplify
    const bundlesStartingWithNext = findAllBundlesStartingWithShipment(nextShipment, nextRemaining, false)
    bundlesStartingWithNext.forEach(bundleResult => {
      const {bundle, remainingShipments: remaining} = bundleResult
      const nextBundleResult = {
        bundle: [shipment.id].concat(bundle),
        remainingShipments: remaining,
      }
      bundles.push(nextBundleResult)
    })
  })

  // We push the single-item shipment at the end, so that we can search deeply
  // for larger bundles first (above), since this may allow us to shortcut early.
  bundles.push({
    bundle: [shipment.id],
    remainingShipments,
  })

  memoBundles[memoKey] = bundles
  return bundles
}

const bundleShipments = (shipments) => {
  const smallestCombo = findMinBundleCombo(shipments)

  // Output with the required stdout format
  return smallestCombo.map(combo => combo.join(' ')).join('\n')
}

module.exports = {
  bundleShipments,
}
