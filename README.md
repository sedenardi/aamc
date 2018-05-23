# aamc
Download and parse AAMC schools and hospitals name and address.

## Source

This module downloads and parses AAMC's Organization Directory for [hospitals](https://members.aamc.org/eweb/DynamicPage.aspx?webcode=AAMCOrgSearchResult&orgtype=Hospital%2FHealth%20System) and [schools](https://members.aamc.org/eweb/DynamicPage.aspx?webcode=AAMCOrgSearchResult&orgtype=Medical%20School).

## Installation

```js
npm install aamc
```

## Usage

```js
const aamc = require('aamc');

aamc.hospitals((err, hospitals) => {
  // array of hospital objects
});

// OR

aamc.schools({ commaSeparate: true }).then((schools) => {
  // array of school objects with address lines comma separated instead of newline
});
```

## Sample Object

```json
{
  "name": "Yale School of Medicine",
  "Country": "United States",
  "City": "New Haven",
  "State": "CT",
  "ZIP": "06520-8055",
  "Address": "333 Cedar Street\nPost Office Box 208055"
}
```

## License

  MIT
