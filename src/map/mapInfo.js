import { MapSource } from './sugonGis';
import communityJson from './mapData/json/community';
import enterprise from './mapData/Enterprise';


const configData = {
  map_type: 'arcgis',
  map_Url:
    'http://35.1.200.33:6080/arcgis/rest/services/LaoshanNew/LSSL/MapServer',
  map_center: [120.51392, 36.179649],
  map_projection: 'EPSG:4326',
  map_minZoom: 5,
  map_maxZoom: 20,
  map_zoom: 12,
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
const mapSource = new MapSource(configData);
mapSource.makeMap(document.getElementById('map'));
mapSource.addGeoJson(communityJson, typeColors, { name: 'NSRMC', color: 'COLOR' });
mapSource.addZoom();
mapSource.addZoomslider();

const handel = mapSource.getFeaturesHandle();
handel.on('select', (e) => {
  const features = e.target.getFeatures().getArray();

  const json = mapSource.getGeoJson(features[0]);
 
  // addGeoJson
  const layer1=mapSource.addGeoJson(json, {
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
