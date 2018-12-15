# fixer.io API client for Node.js written in TypeScript

[![Build Status](https://travis-ci.org/svlapin/fixer-api.svg?branch=master)](https://travis-ci.org/svlapin/fixer-api)
[![codecov](https://codecov.io/gh/svlapin/fixer-api/branch/master/graph/badge.svg)](https://codecov.io/gh/svlapin/fixer-api)
[![npm version](https://badge.fury.io/js/fixer-api.svg)](https://badge.fury.io/js/fixer-api)

[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

## Features

* promise or async / await based
* extensively tested with unit and integration tests.

## API key

To use fixer API, you must obtain an Access Key first [https://fixer.io/](https://fixer.io/).

## Install

```sh
npm install fixer-api
```

## Usage

### Fetching latest data
```js
const fixer = require('fixer-api');

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
const data = await fixer.latest({ base: 'USD', symbols: ['CHF'], access_key: '<YOUR API KEY>' });
console.log(data);

/*
{ base: 'USD', date: '2017-01-30', rates: { CHF: 1.0037 } }
*/
```

### Fetching historical data

```js
const data = await fixer.forDate('2015-04-01', { base: 'USD', symbols: ['CHF'], access_key: '<YOUR API KEY>' });
```

or by providing `Date` instance:
```js
const data = await fixer.forDate(new Date(), { base: 'USD', symbols: ['CHF'], access_key: '<YOUR API KEY>' });
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
