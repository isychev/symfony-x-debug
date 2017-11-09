Symfony-x-debug
===========

Simple JavaScript utility for displaying links to x-debug-profiler in Symfony requests.

If you are creating a SPA then a standard line profiler of symfony is not available

This problem is solved Symfony-x-debug

Install with [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/):

npm:
```sh
npm install symfony-x-debug --save
```
Yarn:
```sh
yarn add symfony-x-debug
```

## Usage

With ES5
```js
var xDebug = require('symfony-x-debug');
```

With ES6
```js
import 'symfony-x-debug';
```

With Webpack
```js
// webpack.config.js
// append symfony-x-debug to entries list
const entriesClient = {
  app: [
    'symfony-x-debug',
    path.join(jsSrcPath, '/app.jsx'),
  ],
};
```

Symfony-x-debug to add popup window with the number of asynchronous requests to the server

![](https://imgur.com/download/leVNIpP)

Hover will be shown a table with links to profiler
![](https://imgur.com/download/ciJuebk)
