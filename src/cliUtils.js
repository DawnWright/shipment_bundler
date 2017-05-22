const {ArgumentError} = require('./ArgumentError')

const printHelp = () => {
  console.log()
  console.log("usage: bundler <filepath>")
  console.log()
  console.log("\t<filepath> to a input file containing shipment data")
}

const readArgs = () => {
  // In Node.js, first argument is node and second is this executable.
  // Therefore strip those args out to find the user args.
  const userArgs = process.argv.slice(2)

  if (userArgs.length !== 1) {
    throw new ArgumentError("Unknown arguments")
  }

  // args are validated later, as they are consumed.
  //
  // TODO: Consider integrating minimist if more complex arg parsing is
  // needed in future.
  const [filename] = userArgs
  return {
    filename,
  }
}

module.exports = {
  printHelp,
  readArgs,
}
