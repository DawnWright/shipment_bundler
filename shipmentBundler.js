#! /usr/bin/env node

const {ArgumentError, ArgumentErrorType} = require('./src/ArgumentError')
const {bundleShipments} = require('./src/bundleShipments')
const {loadShipments} = require('./src/loadShipments')
const {printHelp, readArgs} = require('./src/cliUtils')

const runBundler = () => {
  try {
    const {filename} = readArgs()
    const shipments = loadShipments(filename)
    const result = bundleShipments(shipments)
    console.log(result)
  } catch (error) {
    console.error(error.message)
    if (error.type === ArgumentErrorType) {
      printHelp()
    }
    process.exit(1)
  }
}

runBundler()
