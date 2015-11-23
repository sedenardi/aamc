var request = require('superagent');
var cheerio = require('cheerio');

var AAMC_URL = 'https://members.aamc.org/eweb/DynamicPage.aspx?site=AAMC&webcode=AAMCOrgSearchResult&orgtype=Medical%20School';

var downloadPage = function(cb) {
  request.get(AAMC_URL)
    .end(function(err, res) {
      if (err) return cb(err);
      return cb(null, res.text);
    });
};

var parsePage = function(data) {
  var $ = cheerio.load(data);
  return $('.bodyTXT[cellpadding="3"]').map(function() {
    var html = $(this).find('td').first().html();
    var rows = html.split('<br>').map(function(r) { return r.trim(); });
    var firstPart = rows[0].replace('\r\n','').trim();
    var linked = cheerio.load(firstPart)('a').text().trim();
    var obj = { name: linked || firstPart };

    var countryRow;
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
      var address = rows[countryRow-1];
      
      var cityIndex = address.indexOf(', ');
      if (cityIndex !== -1) {
        obj.City = address.slice(0, cityIndex);
        address = address.slice(cityIndex + 2).trim();

        var stateIndex = address.indexOf(' ');
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

downloadPage(function(err, res) {
  if (err) return console.log(err);
  parsePage(res);
});

module.exports = function(cb) {
  downloadPage(function(err, res) {
    if (err) return cb(err);
    var parsed = parsePage(res);
    cb(null, parsed);
  });
};