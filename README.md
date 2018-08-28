# Node.js Cache API

## Project Structure

```
nodejs-cache-api/
  README.md
  node_modules/
  package.json
  app.js //project file
  bin/
    www //server file
  test/
    Cache.js //test files for each module
  src/
    business/
      Cache.js //controller for each module
    configurations/
      default.js //configuration file for project
    libs/
      common.js //common functions used throughout
    models/
      Cache.js //model schema defined here
    routes/
      index.js //routes grouped here
      Cache.js //module specific routes here
```

## Requirements

### node.js >= 8.0.0

## Scripts

### `npm install`

Installs all packages required.<br>

### `npm test`

Runs test for the API.<br>

### `npm start`

Runs the server in the development mode