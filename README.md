# aamc
Download and parse AAMC hospitals' name, city, state, ZIP, and country.

## Source

This module downloads and parses AAMC's [Organization Directory](https://members.aamc.org/eweb/DynamicPage.aspx?site=AAMC&webcode=AAMCOrgSearchResult&orgtype=Medical%20School).

## Installation

```js
npm install aamc
```

## Usage

```js
var aamc = require('aamc');

aamc(function(err, hospitals) {
  // array of hospital objects
});
```

## Sample Object

```json
{
  name: 'Yale School of Medicine',
  Country: 'United States',
  City: 'New Haven',
  State: 'CT',
  ZIP: '06520-8055'
}
```

## License

  MIT
