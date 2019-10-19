
const _configData = {
  map_type: 'arcgis',
  map_Url:
    'http://35.1.200.33:6080/arcgis/rest/services/LaoshanNew/LSSL/MapServer',
  map_center: [120.51392, 36.179649],
  map_projection: 'EPSG:4326',
  map_minZoom: 2,
  map_maxZoom: 20,
  map_zoom: 12,
};

if (typeof module === 'object') {
  module.exports = _configData;
}
