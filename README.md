# shipment_bundler

Given a file with a single week’s worth of shipments (Monday through Friday), find the fewest number of bundles.

## To Run

`node shipmentBundler.js tests/example`

The following test files are included, and can be validated as follows:

```
./run_test.sh "node shipmentBundler.js" tests/example-no-city-connections 6
./run_test.sh "node shipmentBundler.js" tests/example-no-day-connections 6
./run_test.sh "node shipmentBundler.js" tests/example-return-early-optimal 8
./run_test.sh "node shipmentBundler.js" tests/example-single 1
./run_test.sh "node shipmentBundler.js" tests/example-slow-exponential 18
./run_test.sh "node shipmentBundler.js" tests/example-week-ends 2
```
