import { MapSource } from './sugonGis';
import communityJson from './mapData/json/community';
import enterprise from './mapData/Enterprise';


const configData = {
  map_type: 'XYZ',
  map_Url:
    'http://localhost:3000/terrain/{z}/{x}/{y}.jpg',
  map_center: [11224194.75460964, 2789606.398616877],
  map_projection: 'EPSG:3857',
  map_minZoom: 1,
  map_maxZoom: 20,
  map_zoom: 5,
};
const typeColors = {
  Point: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
  LineString: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
  MultiLineString: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
  MultiPoint: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
  MultiPolygon: { fill: { color: 'rgb(123,123,123,0.1)' }, stroke: { color: 'green' } },
  Polygon: { fill: { color: 'rgb(123,123,123,0.1)' }, stroke: { color: 'green' } },
  GeometryCollection: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
  Circle: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
};
const hotmapdata = {
  type: 'FeatureCollection',
  features: [
    { type: 'Point', coordinates: [101.243746, 25.109256], count: 30 },
    { type: 'Point', coordinates: [101.243746, 25.109256], count: 60 },
    { type: 'Point', coordinates: [99.873148, 24.420492], count: 90 },
    { type: 'Point', coordinates: [101.749672, 23.575372], count: 80 },
    { type: 'Point', coordinates: [102.540756, 24.899677], count: 60 },
    { type: 'Point', coordinates: [102.540756, 24.899677], count: 90 },
    { type: 'Point', coordinates: [103.166264, 25.318472], count: 60 },
    { type: 'Point', coordinates: [101.676083, 25.60242], count: 40 },
    { type: 'Point', coordinates: [101.676083, 25.60242], count: 10 },
    { type: 'Point', coordinates: [99.413215, 26.168271], count: 80 },
    { type: 'Point', coordinates: [101.01378, 22.818552], count: 100 },
  ],
};
const mapSource = new MapSource(configData);
mapSource.makeMap(document.getElementById('map'));
mapSource.setMapLabel({ title: '1111', lonLat: [120.419354, 36.122387] });
mapSource.addGeoJson(communityJson, typeColors, { name: 'NSRMC', color: 'COLOR' });
mapSource.addHeatmapGeoJson(hotmapdata, typeColors, { name: 'NSRMC', color: 'COLOR' });
mapSource.addZoom();
mapSource.addZoomslider();

const handel = mapSource.getFeaturesHandle();
handel.on('select', (e) => {
  const features = e.target.getFeatures().getArray();

  const json = mapSource.getGeoJson(features[0]);

  // addGeoJson
  const layer1 = mapSource.addGeoJson(json, {
    MultiPolygon: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
    Polygon: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
  }, { name: 'NAME' });
  setTimeout(() => {
    mapSource.map.removeLayer(layer1);
  }, 1000);


  // mapSource.addJsonFeatures(features,{
  //   MultiPolygon: { fill: { color: 'rgb(123,123,123,0.4)' }, stroke: { color: 'red' } },
  //   Polygon: { fill: { color: 'rgb(123,123,123,0.4)' }, stroke: { color: 'red' } },}
  // )
});
