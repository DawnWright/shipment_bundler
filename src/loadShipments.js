const fs = require('fs')
const {ArgumentError} = require('./ArgumentError')

const loadFile = (filename) => {
  try {
    return fs.readFileSync(filename, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File not found. Translate to an ArgumentError so we can print
      // more explicit help to the user.
      throw new ArgumentError(error.message)
    }
    throw error
  }
}

const parseFileContents = (fileContents) => {
  // Split apart the lines.
  const shipmentData = fileContents.trim().split('\n')

  // In each line, split apart and parse the fields.
  return shipmentData.map(shipment => {
    shipment = shipment.trim()
    const fieldValues = shipment.split(' ')
    if (fieldValues.length !== 4) {
      throw new Error(`Invalid shipment data: ${shipment}`)
    }
    const [id, startCity, endCity, dayOfWeek] = fieldValues
    return {id, startCity, endCity, dayOfWeek}
  })
}

const loadShipments = (filename) => {
  const fileContents = loadFile(filename)
  if (!fileContents) {
    return []
  }
  return parseFileContents(fileContents)
}

module.exports = {
  loadShipments,
  parseFileContents,
}
