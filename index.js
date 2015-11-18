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
    var firstPart = html.split('<br>')[0].replace('\r\n','').trim();
    var linked = cheerio.load(firstPart)('a').text().trim();
    return linked || firstPart;
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