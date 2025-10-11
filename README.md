# 💱 fixer.io API Client

> **The most elegant way to access currency exchange rates in Node.js and browsers**

[![codecov](https://codecov.io/gh/svlapin/fixer-api/branch/master/graph/badge.svg)](https://codecov.io/gh/svlapin/fixer-api)
[![npm version](https://badge.fury.io/js/fixer-api.svg)](https://badge.fury.io/js/fixer-api)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![Known Vulnerabilities](https://snyk.io/test/github/svlapin/fixer-api/badge.svg)](https://snyk.io/test/github/svlapin/fixer-api)

## ✨ Why Choose This Client?

- 🚀 **Lightning Fast**: Zero runtime dependencies, pure TypeScript performance
- 🌐 **Universal**: Works seamlessly in Node.js and browsers
- 🛡️ **Battle-Tested**: 100% test coverage with comprehensive integration tests
- 🎯 **Type-Safe**: Full TypeScript support with intelligent autocomplete
- 🔧 **Developer-Friendly**: Simple API, extensive documentation, and great DX

## 🔑 Get Your API Key

Ready to start? Get your free API key from [fixer.io](https://fixer.io/) and you're all set!

## 📦 Installation

```sh
npm install fixer-api
```

## 🚀 Quick Start

Get up and running in seconds:

```js
const fixer = require("fixer-api");

// Set your API key
fixer.set({ accessKey: "YOUR_API_KEY" });

// Get latest exchange rates
const rates = await fixer.latest();
console.log(rates);
```

## 📚 API Reference

- [📈 Latest Rates](#fetch-the-latest-data-with-latest) - Get current exchange rates
- [📅 Historical Data](#fetching-historical-data-with-fordate) - Fetch rates for specific dates
- [💱 Currency Conversion](#doing-currency-conversion--with-convert) - Convert between currencies
- [📊 Time Series](#fetching-historical-rates-with-timeseries) - Get rates over date ranges
- [🏷️ Available Currencies](#fetching-available-symbols-with-symbols) - List all supported currencies

## 📈 Latest Exchange Rates

Get the most current exchange rates with a single call:

```js
// Using global API key (recommended)
const data = await fixer.latest();
console.log(data);

// Or specify API key per request
const data = await fixer.latest({ access_key: 'YOUR_API_KEY' });
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

### 🎯 Target Specific Currencies

Need only certain currencies? No problem:

```js
const data = await fixer.latest({ base: "USD", symbols: ["CHF", "GBP", "JPY"] });
console.log(data);

/*
{ base: 'USD', date: '2017-01-30', rates: { CHF: 1.0037, GBP: 0.7892, JPY: 112.45 } }
*/
```

## 📅 Historical Exchange Rates

Travel back in time to get rates from any date:

```js
// Using string date
const data = await fixer.forDate('2015-04-01', { base: 'USD', symbols: ['CHF'] });

// Using Date object
const data = await fixer.forDate(new Date(), { base: "USD", symbols: ["CHF"] });

// With per-request API key
const data = await fixer.forDate('2015-04-01', {
  access_key: 'YOUR_API_KEY',
  base: 'USD',
  symbols: ['CHF']
});
```

## 💱 Currency Conversion

Convert any amount between currencies:

> **Note**: Conversion requires a [paid fixer plan](https://fixer.io/product)

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
  date: "2018-02-22",
  result: 3724.305775
*/
```

## 🏷️ Available Currencies

Discover all supported currency symbols:

```js
const data = await fixer.symbols({
  access_key: 'YOUR_API_KEY',
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

## 📊 Time Series Data

Get exchange rates over a date range for trend analysis:

```js
const data = await fixer.timeseries(
  '2012-05-01',
  '2012-05-25',
  {
    base: 'EUR',
    symbols: ['USD', 'AUD', 'CAD'],
    access_key: 'YOUR_API_KEY'
  }
);
console.log(data);

/*
{
  success: true,
  timeseries: true,
  start_date: '2012-05-01',
  end_date: '2012-05-03',
  base: 'EUR',
  rates: {
    '2012-05-01': {
      USD: 1.322891,
      AUD: 1.278047,
      CAD: 1.302303,
    },
    '2012-05-02': {
      USD: 1.315066,
      AUD: 1.274202,
      CAD: 1.299083,
    },
    '2012-05-03': {
      USD: 1.314491,
      AUD: 1.280135,
      CAD: 1.296868,
    }
  }
}
*/
```

## 🧪 Testing

### Unit Tests

Run isolated tests (no API calls):

```sh
npm test
```

### Integration Tests

Test against real fixer.io API:

```sh
FIXER_API_KEY="YOUR_FIXER_KEY_HERE" npm run test:integration
```

## 🌐 Browser Usage

Perfect for web applications! The package includes ready-to-use browser bundles.

**Available bundles:**
- `fixer.iife.js` - Full version
- `fixer.iife.min.js` - Minified version

Both expose `fixerApi` as a global variable.

### Local Installation

```html
<body>
  <script src="node_modules/fixer-api/dist/fixer.iife.min.js"></script>
  <script>
    fixerApi
      .set({ accessKey: "YOUR_FIXER_KEY_HERE" })
      .latest()
      .then(result => {
        console.log(result);
      });
  </script>
</body>
```

### CDN (Recommended)

```html
<body>
  <script src="https://unpkg.com/fixer-api/dist/fixer.iife.min.js"></script>
  <script>
    fixerApi
      .set({ accessKey: "YOUR_FIXER_KEY_HERE" })
      .latest()
      .then(result => {
        console.log(result);
      });
  </script>
</body>
```
