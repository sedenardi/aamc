const request = require('superagent');
const cheerio = require('cheerio');

const parsePage = function(data, opts) {
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
      const cityRow = countryRow - 1;
      let address = rows[cityRow];

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

      if (cityRow > 1) {
        const addressRows = rows.slice(1, cityRow);
        const delimiter = opts.commaSeparate ? ', ' : '\n';
        obj.Address = addressRows.join(delimiter);
      }
    } else {
      console.log('missing country: ' + html);
    }

    return obj;
  }).get();
};

const AAMC_SCHOOL_URL = 'https://members.aamc.org/eweb/DynamicPage.aspx?webcode=AAMCOrgSearchResult&orgtype=Medical%20School';
const AAMC_HOSPITAL_URL = 'https://members.aamc.org/eweb/DynamicPage.aspx?webcode=AAMCOrgSearchResult&orgtype=Hospital%2FHealth%20System';

const downloadAndParse = function(opts, cb) {
  request.get(opts.url)
    .end((err, res) => {
      if (err) return cb(err);
      try {
        const parsed = parsePage(res.text, opts);
        cb(null, parsed);
      } catch(err) {
        cb(err);
      }
    });
};

const runner = function(opts, cb) {
  if (cb) {
    downloadAndParse(opts, cb);
  } else {
    return new Promise((resolve, reject) => {
      downloadAndParse(opts, (err, res) => {
        if (err) { return reject(err); }
        return resolve(res);
      });
    });
  }
};

module.exports.schools = function(opts, cb) {
  opts = opts || {};
  opts.url = AAMC_SCHOOL_URL;
  return runner(opts, cb);
};
module.exports.hospitals = function(opts, cb) {
  opts = opts || {};
  opts.url = AAMC_HOSPITAL_URL;
  return runner(opts, cb);
};
