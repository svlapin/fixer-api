# fixer.io API client in JavaScript

[![Build Status](https://travis-ci.org/svlapin/fixer-api.svg?branch=master)](https://travis-ci.org/svlapin/fixer-api)

[![codecov](https://codecov.io/gh/svlapin/fixer-api/branch/master/graph/badge.svg)](https://codecov.io/gh/svlapin/fixer-api)

## Install

fixer.io client to fetch currency conversion rates written in Node.js.

```sh
npm install fixer-api
```

## Usage

### To fetch latest data
```js
const fixer = require('fixer-api');

fixer.latest()
  .then((data) => {
    console.log(data);
  });

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

### To fetch latest rates on specific base

```js
fixer.latest({ base: 'USD', symbols: ['CHF'] })
  .then((data) => {
    console.log(data);
  });
/*
{ base: 'USD', date: '2017-01-30', rates: { CHF: 1.0037 } }
*/
```

### To fetch rates for specific date

```js
fixer.forDate('2015-04-01', { base: 'USD', symbols: ['CHF'] })
  .then((data) => {
  ...
```

or by providing `Date` instance:
```js
fixer.forDate(new Date(), { base: 'USD', symbols: ['CHF'] })
```
