# aamc
Download and parse AAMC hospital names

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
  // array of hospital names
});
```

## License

  MIT
