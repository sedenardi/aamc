const request = require('superagent');
const cheerio = require('cheerio');

const AAMC_URL = 'https://members.aamc.org/eweb/DynamicPage.aspx?site=AAMC&webcode=AAMCOrgSearchResult&orgtype=Medical%20School';

const downloadPage = function(cb) {
  request.get(AAMC_URL)
    .end((err, res) => {
      if (err) return cb(err);
      return cb(null, res.text);
    });
};

const parsePage = function(data) {
  const $ = cheerio.load(data);
  return $('.bodyTXT[cellpadding="3"]').map(function() {
    const html = $(this).find('td').first().html();
    const rows = html.split('<br>').map((r) => { return r.trim(); });
    const firstPart = rows[0].replace('\r\n','').trim();
    const linked = cheerio.load(firstPart)('a').text().trim();
    const obj = { name: linked || firstPart };

    let countryRow;
    if (rows[3].toLowerCase() === 'united states') {
      obj.Country = 'United States';
      countryRow = 3;
    } else if (rows[3].toLowerCase() === 'canada') {
      obj.Country = 'Canada';
      countryRow = 3;
    } else if (rows[4].toLowerCase() === 'united states') {
      obj.Country = 'United States';
      countryRow = 4;
    } else if (rows[4].toLowerCase() === 'canada') {
      obj.Country = 'Canada';
      countryRow = 4;
    } else if (rows[5].toLowerCase() === 'united states') {
      obj.Country = 'United States';
      countryRow = 5;
    } else if (rows[5].toLowerCase() === 'canada') {
      obj.Country = 'Canada';
      countryRow = 5;
    }

    if (countryRow) {
      let address = rows[countryRow-1];

      const cityIndex = address.indexOf(', ');
      if (cityIndex !== -1) {
        obj.City = address.slice(0, cityIndex);
        address = address.slice(cityIndex + 2).trim();

        const stateIndex = address.indexOf(' ');
        if (stateIndex !== -1) {
          obj.State = address.slice(0, stateIndex);
          obj.ZIP = address.slice(stateIndex + 1);
        }
      }
    } else {
      console.log('missing country: ' + html);
    }

    return obj;
  }).get();
};

module.exports = function(cb) {
  downloadPage((err, res) => {
    if (err) return cb(err);
    const parsed = parsePage(res);
    cb(null, parsed);
  });
};
