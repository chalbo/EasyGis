var elasticsearch = require('elasticsearch');
const config = require("../../config/config.local");

var client = new elasticsearch.Client({
  host: config.esHost,
  log: 'trace'
});
module.exports = client;