# fixer.io API client for Node.js and browser in TypeScript

[![Build Status](https://travis-ci.org/svlapin/fixer-api.svg?branch=master)](https://travis-ci.org/svlapin/fixer-api)
[![codecov](https://codecov.io/gh/svlapin/fixer-api/branch/master/graph/badge.svg)](https://codecov.io/gh/svlapin/fixer-api)
[![npm version](https://badge.fury.io/js/fixer-api.svg)](https://badge.fury.io/js/fixer-api)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![Known Vulnerabilities](https://snyk.io/test/github/svlapin/fixer-api/badge.svg)](https://snyk.io/test/github/svlapin/fixer-api)

## Features

- works in both Node.js and [browser](#using-in-browser)
- promise or async / await based
- extensively tested with unit and integration tests.

## API key

To use fixer API, you must obtain an Access Key first [https://fixer.io/](https://fixer.io/).

## Install

```sh
npm install fixer-api
```

## Usage

- [Latest](#fetch-the-latest-data-with-latest)
- [Historical](#fetching-historical-data-with-fordate)
- [Conversion](#doing-currency-conversion--with-convert)
- [Available symbols (currencies)](#fetching-available-symbols-with-symbols)

### Import default fixer instance

```js
const fixer = require("fixer-api");
```

### Set `accessKey` obtained from fixer.io

```js
fixer.set({ accessKey: "<YOUR API KEY>" });
```

`.set` supports chaining, so you can run a query right after, e.g.:

```js
await fixer.set({ accessKey: "<YOUR API KEY>" }).latest();
```

### Fetch the latest data with `.latest`

```js
const data = await fixer.latest();
console.log(data);

/**
 *  or, if you want to specify access key per request (note it's in snake_case here)
 */
const data = await fixer.latest({ access_key: '<YOUR API KEY>' });
console.log(data);

/*
{
  base: 'EUR',
  date: '2017-01-30',
  rates: {
    AUD: 1.4109,
    BGN: 1.9558,
    BRL: 3.3318,
    CAD: 1.3983,
    CHF: 1.0669,
    CNY: 7.3103,
    CZK: 27.022,
    DKK: 7.4375,
    GBP: 0.84935,
    HKD: 8.2476,
    HRK: 7.4773,
    HUF: 310.8,
    IDR: 14173,
    ILS: 4.0228,
    INR: 72.232,
    JPY: 121.76,
    KRW: 1252.3,
    MXN: 22.085,
    MYR: 4.7094,
    NOK: 8.8758,
    NZD: 1.4668,
    PHP: 52.899,
    PLN: 4.331,
    RON: 4.5008,
    RUB: 63.779,
    SEK: 9.439,
    SGD: 1.5177,
    THB: 37.492,
    TRY: 4.0561,
    USD: 1.063,
    ZAR: 14.451
  }
}
/*
```

### Fetch latest data based on specific base currency

```js
const data = await fixer.latest({ base: "USD", symbols: ["CHF"] });
console.log(data);

/*
{ base: 'USD', date: '2017-01-30', rates: { CHF: 1.0037 } }
*/
```

### Fetching historical data with `.forDate`

```js
const data = await fixer.forDate('2015-04-01', { base: 'USD', symbols: ['CHF'] });

/**
 *  or, if you want to specify access key per request (note it's in snake_case here)
 */
const data = await fixer.forDate('2015-04-01', {
  access_key: '<YOUR API KEY>', ]
  base: 'USD',
  symbols: ['CHF']
});
console.log(data);

```

or by providing `Date` instance:

```js
const data = await fixer.forDate(new Date(), { base: "USD", symbols: ["CHF"] });
```

### Doing currency conversion with `.convert`

Keep in mind that `.convert` requires a [paid fixer plan](https://fixer.io/product).

```
fixer.convert(<from>, <to>, <amount>, <date? = current date>)
```

```js
const data = await fixer.convert("GBP", "JPY", 25, "2018-02-22");
console.log(data);

/*
  success: true,
  query: {
    from: "GBP",
    to: "JPY",
    amount: 25
  },
  info: {
    timestamp: 1519328414,
    rate: 148.972231
  },
  date: "2018-02-22"
  result: 3724.305775
*/
```

### Fetching available symbols with `.symbols`

```js
const data = await fixer.symbols({
  access_key: '<YOUR API KEY>',
});
console.log(data);

/*
{
  success: true,
  symbols: {
    AED: 'United Arab Emirates Dirham',
    AFN: 'Afghan Afghani',
    ALL: 'Albanian Lek',
    AMD: 'Armenian Dram',
    ANG: 'Netherlands Antillean Guilder',
    ...
  }
}
*/
```

## Running tests

### Unit tests

Unit tests run in isolation and don't send real requests to `fixer.io`.

```sh
npm test
```

### Integration tests

Integration tests send real requests to `fixer.io` and so require valid access key.

```sh
FIXER_API_KEY="<YOUR_FIXER_KEY_HERE>" npm run test:integration
```

## Using in browser

`dist` folder of packaged npm module includes browser bundles: `fixer.iife.js` and `fixer.iife.min.js` (minified version). Each bundle exposes an instance of `fixer` as `fixerApi` global variable.

Typical usage is as follows (supposing web server is serving `node-modules`):

```html
<body>
  <script src="node-modules/fixer-api/dist/fixer.iife.min.js"></script>
  <script>
    fixerApi
      .set({ accessKey: "<YOUR_FIXER_KEY_HERE>" })
      .latest()
      .then(result => {
        console.log(result);
      });
  </script>
</body>
```

or by using `unpkg` CDN:

```html
<body>
  <script src="https://unpkg.com/fixer-api/dist/fixer.iife.min.js"></script>
  <script>
    fixerApi
      .set({ accessKey: "<YOUR_FIXER_KEY_HERE>" })
      .latest()
      .then(result => {
        console.log(result);
      });
  </script>
</body>
```
