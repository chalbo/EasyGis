import React from 'react';
import ReactDOM from 'react-dom';
import Map from 'ol/Map';
import { Fill, Stroke, Style, Text, Circle as CircleStyle } from 'ol/style.js';
import Feature from 'ol/Feature';
import { GeoJSON } from 'ol/format';
import * as ol from 'ol';
import { bbox } from 'ol/loadingstrategy';
import View from 'ol/View';
import { TileGrid } from 'ol/tilegrid';
import { Image, Tile } from 'ol/layer';
import { LineString } from 'ol/geom';
import { TileImage, Vector, TileArcGISRest, ImageArcGISRest, XYZ, OSM, Vector as VectorSource } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import { Select } from 'ol/interaction';
import {singleClick ,pointerMove} from 'ol/events/condition';

import Overlay from 'ol/Overlay';
// import proj from 'ol/proj';
import { transform, Projection, transformExtent } from 'ol/proj'; // toLonLat
const EventEmitter = require('eventemitter3');
import Star from './star';
import mapSourceType from './mapSourceType'

class mapSource extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.map = null;
    this.userVectorSource = null; // 用户图层
    this.MapSource = mapSourceType(config);
  }



  getMapSource = () => this.MapSource[this.config.map_type].source();

  setMapPosition = gis => this.MapSource[this.config.map_type].setPosition(gis);

  setRevertPosition = gis => this.MapSource[this.config.map_type].setRevertPosition(gis);

  getMinZoom = () => this.config.map_minZoom;

  getMaxZoom = () => this.config.map_maxZoom;

  getZoom = () => this.config.map_zoom;

  getProjection = () => this.config.map_projection;

  getCenter = () => this.config.map_center;

  clearMap = () => this.map.getOverlays().clear();

  getFeaturesHandle = (color,multi=false) => { 
    const operate=new Select({
      multi,
      style: new  Style({ 
        fill: new Fill({color}),
      })
    })
    this.map.addInteraction(operate)
    return  operate;
  }
  addInteraction(typeStr,userInfo) { 
    if (typeStr !== 'None') {
      draw = new Draw({
        source: this.userVectorSource,
        type: typeStr, 
      });
      draw.userInfo=userInfo;
      map.addInteraction(draw);
    }
  }

  getStyle=(feature,typeColors)=>{ 
    const styles = {};
    Object.keys(typeColors).forEach(key => {
      styles[key] = new Style({
        fill: new Fill({ ...typeColors[key].fill }),
        stroke: new Stroke({ ...typeColors[key].stroke }),
        text: new Text({
          text:feature.get("NAME"),
          fill: new Fill({
              color: '#000'
          }), 
      }) 
      });
    });
    return styles;
  }

  addFeatures = (feature,typeColors) => {  
      const styleFunction =  (feature)=> { 
        return this.getStyle(feature,typeColors)[feature.getGeometry().getType()];
      };

      const vectorSource = new VectorSource({
        features: [feature]
      });
      const Vector = new VectorLayer({
        source: vectorSource,
        style: styleFunction, 
      });
    this.map.addOverlay(Vector); 
  }

  addJsonFeatures = (features ,typeColors) => {  
    debugger;
    const featuresJson=(new GeoJSON()).writeFeatures(features[0]);
    const styleFunction =  (feature)=> { 
      return this.getStyle(feature,typeColors)[feature.getGeometry().getType()];
    };

    const vectorSource = new VectorSource({
      features: (new GeoJSON()).readFeatures(featuresJson)
    });
    const Vector = new VectorLayer({
      source: vectorSource,
      style: styleFunction, 
    });
  this.map.addOverlay(Vector); 
}

  setMourseMoveFeatures = (color) => { 
    this.map.addInteraction(new Select({
      condition: pointerMove,     // 唯一的不同之处，设置鼠标移到feature上就选取
      style: new  Style({
        stroke: new Stroke({color}),
        fill: new Fill({color}), 
      })
    }));
  }

  //info={title:,extra:,lonLat:[]}
  setMapLabel = (info, callBack) => {
    const label = (
      <div className="mapLabelContain" id={info.id} style={{ position: 'relative', top: '-25px', left: '-6px', height: '25px' }} onClick={callBack}>
        <i className={info.faClass?info.faClass:"fa fa-map-marker mark"} />
        <div className="mapLabel">
          {info.comparisonAddress}
          <i dangerouslySetInnerHTML={{ __html: info.title }} />
          <i dangerouslySetInnerHTML={{ __html: info.extra }} />
        </div>
      </div>
    );
    const contain = document.createElement('div');
    contain.className = 'contain';
    contain.style.position = 'relative';
    contain.style.height = 0;
    ReactDOM.render(label, contain);
    const overlay = new Overlay({
      position: this.setMapPosition(info.lonLat),
      element: contain,
      stopEvent: true,
      positioning: 'bottom-left',
    });
    this.map.addOverlay(overlay);
  };

  drawStar = (cameras, colorNum) => {
    const { map } = this;
    // eslint-disable-next-line array-callback-return
    cameras.map(val => {
      const canvas = document.createElement('canvas');
      canvas.className = 'map-canvas-star';
      canvas.width = 200;
      canvas.height = 200;
      canvas.style.position = 'absolute';
      canvas.style.transform = 'translate(-50%,-50%)';
      let size = 25;
      if (val.count < 5) {
        size = 25;
      } else {
        size = val.count / 2 < 25 ? 25 : val.count / 2;
      }
      const star = new Star({
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: canvas.width,
        height: canvas.height,
        size,
        ctx: canvas.getContext('2d'),
        colorNum,
      });
      const overlay = new Overlay({
        element: canvas,
        stopEvent: false,
        positioning: 'bottom',
      });
      overlay.setPosition(this.setMapPosition(val.lonLat));
      map.addOverlay(overlay);
      setTimeout(()=>{star.flashStar(20, star.render);},4000*Math.random(1))
      
    });
  };

  // 绘制轨迹要求参数 cameras:{lonLat}
  drawTrackNoneConverge = cameras => {
    const { map } = this;
    // map.getOverlays().clear();
    if (cameras === undefined || cameras.length < 1 || map === undefined) {
      return;
    }
    const point = [];
    const features = [];

    // eslint-disable-next-line array-callback-return
    cameras.map(list => {
      const $urlDom = document.createElement('div');
      // this.showTrackImg(list, $urlDom, store);
      point.push(this.setMapPosition(list.lonLat));
      const overlay = new Overlay({
        element: $urlDom,
        stopEvent: false,
        positioning: 'bottom-center',
      });
      overlay.setPosition(this.setMapPosition(list.lonLat));
      map.addOverlay(overlay);
    });
    // 进行画线
    if (point.length > 0) {
      const coordinates = [];
      for (let i = 0; i < point.length - 1; i += 1) {
        coordinates.push(point[i], point[i + 1]);
        const feature = new Feature({
          geometry: new LineString(coordinates),
          name: i,
        });
        features[i] = feature;
      }
      const trackVector = new VectorLayer({
        style: new Style({
          stroke: new Stroke({
            lineDash: [1, 2, 3, 4, 5, 6],
            color: '#FF0000',
            width: 3,
          }),
        }),
        renderBuffer: 100,
      });
      trackVector.setSource(
        new Vector({
          features,
          projection: this.getProjection(),
        })
      );
      map.addLayer(trackVector);

      // map.setView(new ol.View({
      //     minZoom: mapSource.getMinZoom(),
      //     maxZoom: mapSource.getMaxZoom(),
      //     zoom: mapSource.getZoom(),
      //     projection: mapSource.getProjection(),
      //     center: mapSource.setMapPosition(center),
      // }));
    }
  };

  // 绘制轨迹要求参数 cameras:{lonLat}
  drawTrack = cameras => {
    const { map } = this;
    // map.getOverlays().clear();
    if (cameras === undefined || cameras.length < 1 || map === undefined) {
      return;
    }
    const point = [];
    const features = [];
    const fiter = {};
    const center = []; // 中心点
    // eslint-disable-next-line array-callback-return
    cameras.map((val, idx) => {
      // eslint-disable-next-line no-param-reassign
      val.idx = idx;
      if (val.lonLat[0] > 0 && val.lonLat[1] > 0) {
        const lon = val.lonLat[0];
        const lat = val.lonLat[1];
        const lonlat = `${lon}_${lat}`;
        if (!(lonlat in fiter)) {
          fiter[lonlat] = [val];
        } else {
          fiter[lonlat].push(val);
        }
      }
    });
    Object.keys(fiter).forEach(idx => {
      const $urlDom = document.createElement('div');
      const list = fiter[idx];
      // this.showTrackImg(list, $urlDom, store);
      point.push(this.setMapPosition(list[0].lonLat));
      const overlay = new Overlay({
        element: $urlDom,
        stopEvent: false,
        positioning: 'bottom-center',
      });
      overlay.setPosition(this.setMapPosition(list[0].lonLat));
      map.addOverlay(overlay);
    });
    Object.keys(fiter).forEach(idx => {
      if (center[0]) {
        center[0] = (center[0] + fiter[idx][0]) / 2;
        center[1] = (center[1] + fiter[idx][1]) / 2;
      } else {
        // eslint-disable-next-line prefer-destructuring
        center[0] = fiter[idx][0];
        // eslint-disable-next-line prefer-destructuring
        center[1] = fiter[idx][1];
      }
    });

    // 进行画线
    if (point.length > 0) {
      const coordinates = [];
      for (let i = 0; i < point.length - 1; i += 1) {
        coordinates.push(point[i], point[i + 1]);
        const feature = new Feature({
          geometry: new LineString(coordinates),
          name: i,
        });
        features[i] = feature;
      }
      const trackVector = new VectorLayer({
        style: new Style({
          stroke: new Stroke({
            lineDash: [1, 2, 3, 4, 5, 6],
            color: '#FF0000',
            width: 3,
          }),
        }),
        renderBuffer: 100,
      });
      trackVector.setSource(
        new Vector({
          features,
          projection: this.getProjection(),
        })
      );
      map.addLayer(trackVector);

      // map.setView(new ol.View({
      //     minZoom: mapSource.getMinZoom(),
      //     maxZoom: mapSource.getMaxZoom(),
      //     zoom: mapSource.getZoom(),
      //     projection: mapSource.getProjection(),
      //     center: mapSource.setMapPosition(center),
      // }));
    }
  };

  // 绘制地图
  makeMap = mapName => {
    const map = new Map({
      layers: [this.getMapSource()[0]],
      view: new View({
        minZoom: this.getMinZoom(),
        maxZoom: this.getMaxZoom(),
        zoom: this.getZoom(),
        projection: this.getProjection(),
        center: this.getCenter(),
      }),
      controls: [],
      target: mapName,
    });
    this.map = map;
    return map;
  };

  // 绘制地图
  makeGeoJsonMap = (mapName, featureCollection = {}, typeColors = {}) => {
    //   });
    // const chinajson =
    //   '{"type":"FeatureCollection","features":[{"type":"Feature","id":"CHN","properties":{"name":"China"},"geometry":{"type":"MultiPolygon","coordinates":[[[[110.339188,18.678395],[109.47521,18.197701],[108.655208,18.507682],[108.626217,19.367888],[109.119056,19.821039],[110.211599,20.101254],[110.786551,20.077534],[111.010051,19.69593],[110.570647,19.255879],[110.339188,18.678395]]],[[[127.657407,49.76027],[129.397818,49.4406],[130.582293,48.729687],[130.987282,47.790132],[132.506672,47.78897],[133.373596,48.183442],[135.026311,48.47823],[134.500814,47.57844],[134.112362,47.212467],[133.769644,46.116927],[133.097127,45.144066],[131.883454,45.321162],[131.025212,44.967953],[131.288555,44.11152],[131.144688,42.92999],[130.633866,42.903015],[130.640016,42.395009],[129.994267,42.985387],[129.596669,42.424982],[128.052215,41.994285],[128.208433,41.466772],[127.343783,41.503152],[126.869083,41.816569],[126.182045,41.107336],[125.079942,40.569824],[124.265625,39.928493],[122.86757,39.637788],[122.131388,39.170452],[121.054554,38.897471],[121.585995,39.360854],[121.376757,39.750261],[122.168595,40.422443],[121.640359,40.94639],[120.768629,40.593388],[119.639602,39.898056],[119.023464,39.252333],[118.042749,39.204274],[117.532702,38.737636],[118.059699,38.061476],[118.87815,37.897325],[118.911636,37.448464],[119.702802,37.156389],[120.823457,37.870428],[121.711259,37.481123],[122.357937,37.454484],[122.519995,36.930614],[121.104164,36.651329],[120.637009,36.11144],[119.664562,35.609791],[119.151208,34.909859],[120.227525,34.360332],[120.620369,33.376723],[121.229014,32.460319],[121.908146,31.692174],[121.891919,30.949352],[121.264257,30.676267],[121.503519,30.142915],[122.092114,29.83252],[121.938428,29.018022],[121.684439,28.225513],[121.125661,28.135673],[120.395473,27.053207],[119.585497,25.740781],[118.656871,24.547391],[117.281606,23.624501],[115.890735,22.782873],[114.763827,22.668074],[114.152547,22.22376],[113.80678,22.54834],[113.241078,22.051367],[111.843592,21.550494],[110.785466,21.397144],[110.444039,20.341033],[109.889861,20.282457],[109.627655,21.008227],[109.864488,21.395051],[108.522813,21.715212],[108.05018,21.55238],[107.04342,21.811899],[106.567273,22.218205],[106.725403,22.794268],[105.811247,22.976892],[105.329209,23.352063],[104.476858,22.81915],[103.504515,22.703757],[102.706992,22.708795],[102.170436,22.464753],[101.652018,22.318199],[101.80312,21.174367],[101.270026,21.201652],[101.180005,21.436573],[101.150033,21.849984],[100.416538,21.558839],[99.983489,21.742937],[99.240899,22.118314],[99.531992,22.949039],[98.898749,23.142722],[98.660262,24.063286],[97.60472,23.897405],[97.724609,25.083637],[98.671838,25.918703],[98.712094,26.743536],[98.68269,27.508812],[98.246231,27.747221],[97.911988,28.335945],[97.327114,28.261583],[96.248833,28.411031],[96.586591,28.83098],[96.117679,29.452802],[95.404802,29.031717],[94.56599,29.277438],[93.413348,28.640629],[92.503119,27.896876],[91.696657,27.771742],[91.258854,28.040614],[90.730514,28.064954],[90.015829,28.296439],[89.47581,28.042759],[88.814248,27.299316],[88.730326,28.086865],[88.120441,27.876542],[86.954517,27.974262],[85.82332,28.203576],[85.011638,28.642774],[84.23458,28.839894],[83.898993,29.320226],[83.337115,29.463732],[82.327513,30.115268],[81.525804,30.422717],[81.111256,30.183481],[79.721367,30.882715],[78.738894,31.515906],[78.458446,32.618164],[79.176129,32.48378],[79.208892,32.994395],[78.811086,33.506198],[78.912269,34.321936],[77.837451,35.49401],[76.192848,35.898403],[75.896897,36.666806],[75.158028,37.133031],[74.980002,37.41999],[74.829986,37.990007],[74.864816,38.378846],[74.257514,38.606507],[73.928852,38.505815],[73.675379,39.431237],[73.960013,39.660008],[73.822244,39.893973],[74.776862,40.366425],[75.467828,40.562072],[76.526368,40.427946],[76.904484,41.066486],[78.187197,41.185316],[78.543661,41.582243],[80.11943,42.123941],[80.25999,42.349999],[80.18015,42.920068],[80.866206,43.180362],[79.966106,44.917517],[81.947071,45.317027],[82.458926,45.53965],[83.180484,47.330031],[85.16429,47.000956],[85.720484,47.452969],[85.768233,48.455751],[86.598776,48.549182],[87.35997,49.214981],[87.751264,49.297198],[88.013832,48.599463],[88.854298,48.069082],[90.280826,47.693549],[90.970809,46.888146],[90.585768,45.719716],[90.94554,45.286073],[92.133891,45.115076],[93.480734,44.975472],[94.688929,44.352332],[95.306875,44.241331],[95.762455,43.319449],[96.349396,42.725635],[97.451757,42.74889],[99.515817,42.524691],[100.845866,42.663804],[101.83304,42.514873],[103.312278,41.907468],[104.522282,41.908347],[104.964994,41.59741],[106.129316,42.134328],[107.744773,42.481516],[109.243596,42.519446],[110.412103,42.871234],[111.129682,43.406834],[111.829588,43.743118],[111.667737,44.073176],[111.348377,44.457442],[111.873306,45.102079],[112.436062,45.011646],[113.463907,44.808893],[114.460332,45.339817],[115.985096,45.727235],[116.717868,46.388202],[117.421701,46.672733],[118.874326,46.805412],[119.66327,46.69268],[119.772824,47.048059],[118.866574,47.74706],[118.064143,48.06673],[117.295507,47.697709],[116.308953,47.85341],[115.742837,47.726545],[115.485282,48.135383],[116.191802,49.134598],[116.678801,49.888531],[117.879244,49.510983],[119.288461,50.142883],[119.279366,50.582908],[120.18205,51.643566],[120.738191,51.964115],[120.725789,52.516226],[120.177089,52.753886],[121.003085,53.251401],[122.245748,53.431726],[123.571507,53.458804],[125.068211,53.161045],[125.946349,52.792799],[126.564399,51.784255],[126.939157,51.353894],[127.287456,50.739797],[127.657407,49.76027]]]]}}]}';
    // function getStyle(feature,typeColors) { 
    //   const styles = {};
    //   Object.keys(typeColors).forEach(key => {
    //     styles[key] = new Style({
    //       fill: new Fill({ ...typeColors[key].fill }),
    //       stroke: new Stroke({ ...typeColors[key].stroke }),
    //       text: new Text({
    //         text:feature.get("NAME"),
    //         fill: new Fill({
    //             color: '#000'
    //         }), 
    //     }) 
    //     });
    //   });
    //   return styles;
    // }

    const styleFunction =  (feature)=>{ 
      return this.getStyle(feature,typeColors)[feature.getGeometry().getType()];
    };

    const vectorSource = new VectorSource({
      features: (new GeoJSON()).readFeatures(featureCollection)
    });
    // const a=(new GeoJSON()).writeFeature(vectorSource.getFeatures()[1]); 生成json
    // 获取属性，vectorSource.getFeatures()[1].getProperties() vectorSource.getFeatures()[1].getProperties() ---{geometry: Polygon, SSXZQH: "崂山区", SSJB: "王哥庄街道办", NAME: "王哥庄中心管区", BM: "370212003009", …}
    // 获取图形 vectorSource.getFeatures()[1].getGeometry() Polygon {disposed_: false, pendingRemovals_: {…}, dispatching_: {…}, listeners_: {…}, revision_: 1, …}

    const Vector = new VectorLayer({
      source: vectorSource,
      style: styleFunction, 
    });

    const map = new Map({
      layers: [this.getMapSource()[0], Vector],
      view: new View({
        minZoom: this.getMinZoom(),
        maxZoom: this.getMaxZoom(),
        zoom: this.getZoom(),
        // projection: 'EPSG:3857',
        // center: transform(this.getCenter(),'EPSG:4326', 'EPSG:3857'),  
        projection: this.getProjection(),
        center: this.getCenter(),
      }),
      controls: [],
      target: mapName,
    });
    this.map = map;
    this.userVectorSource=vectorSource;
    return map;
  };
}

export default mapSource;
