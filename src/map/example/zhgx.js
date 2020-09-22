import React from 'react';
import {
  MapBase, Base, MapSource, getArgc, WfsHandle, MapInteractive,
} from '../sugonGis';
import communityJson from '../mapData/json/community';
// import enterprise from '../mapData/Enterprise';
import '../map.css';
import 'font-awesome/css/font-awesome.min.css';

const configData = {
  // map_type: 'XYZ',
  // map_Url:
  //   'http://localhost:3000/terrain/{z}/{x}/{y}.jpg',
  // map_center: [11224194.75460964, 2789606.398616877],
  // map_projection: 'EPSG:3857',
  map_type: 'amap',
  map_name: '卫星图',
  map_img: '../../assets/images/satellite.jpg',
  map_Url:
    'http://wprd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',

  map_center: [101.243746, 25.109256],
  map_projection: 'EPSG:4326',
  map_minZoom: 1,
  map_maxZoom: 20,
  map_zoom: 5,
};
const configData2 = {
  map_type: 'XYZ',
  map_name: '高德地图',
  map_img: '../../assets/images/street.jpg',
  map_Url:
    'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  map_center: [101.243746, 25.109256],
  map_projection: 'EPSG:4326',
  // map_type: 'amap',
  // map_Url:
  //   'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',

  // map_center: [101.243746, 25.109256],
  // map_projection: 'EPSG:4326',
  map_minZoom: 1,
  map_maxZoom: 20,
  map_zoom: 5,
};

const mapBase = new MapBase(configData);
const mapBase2 = new MapBase(configData2);
const wfsHandle = new WfsHandle(mapBase);
const mapInteractive = new MapInteractive(mapBase);
const layer = mapBase2.getMapSource();
mapBase.makeMap(document.getElementById('map'));

mapBase.map.addLayer(layer[0]);
mapBase.map.getLayers().clear();
//mapBase.map.removeLayer(layer[0]);  

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

Base.event.on('check', () => { alert(3); });

mapInteractive.setMapLabel({ title: '111122222', lonLat: [120.419354, 36.122387] }, () => {
  console.log(111111);
  alert(1);
});
mapInteractive.drawStar([{ count: 25, lonLat: [120.419354, 36.122387] }, { count: 25, lonLat: [101.243746, 25.109256] }], '123,123,123');
wfsHandle.addGeoJson(communityJson, typeColors, { name: 'NSRMC', color: 'COLOR' });
wfsHandle.addHeatmapGeoJson(hotmapdata, typeColors, { name: 'NSRMC', color: 'COLOR' });
// 气泡支持
const a = {};
mapInteractive.on('changeName', () => { alert(2); });
// eslint-disable-next-line max-len
mapInteractive.addMapJSXPopup(<div onClick={() => { alert(1111); mapInteractive.emit('changeName'); MapInteractive.event.emit('check'); }}>aaaccccaaa</div>, [101.243746, 25.109256], (changeStatus) => { a.changeStatus = changeStatus; });
// a.changeStatus(true);

// 工具栏
mapBase.addZoom();
mapBase.addZoomslider();

const handel = wfsHandle.getFeaturesHandle('rgb(123,123,123,0.5)', true);
handel.on('select', (e) => {
  const features = e.target.getFeatures().getArray();

  const json = wfsHandle.getGeoJson(features[0]);

  // addGeoJson
  const layer1 = wfsHandle.addGeoJson(json, {
    MultiPolygon: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
    Polygon: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
  }, { name: 'NAME' });
  // setTimeout(() => {
  //   wfsHandle.map.removeLayer(layer1);
  // }, 1000);


  // mapSource.addJsonFeatures(features,{
  //   MultiPolygon: { fill: { color: 'rgb(123,123,123,0.4)' }, stroke: { color: 'red' } },
  //   Polygon: { fill: { color: 'rgb(123,123,123,0.4)' }, stroke: { color: 'red' } },}
  // )
});
