import React from 'react';
import ReactDOM from 'react-dom';
import Map from 'ol/Map';

import Feature from 'ol/Feature';
import { GeoJSON } from 'ol/format';
// import * as ol from 'ol';
// import { bbox } from 'ol/loadingstrategy';
import View from 'ol/View';
// import { TileGrid } from 'ol/tilegrid';
// import { Image, Tile } from 'ol/layer';
import { LineString } from 'ol/geom';
import { Vector, Vector as VectorSource } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import { Select } from 'ol/interaction';
import { pointerMove } from 'ol/events/condition';
import { ZoomSlider, Zoom } from 'ol/control';
import Overlay from 'ol/Overlay';
import {
  Fill, Stroke, Style, Text, Circle as CircleStyle,
} from 'ol/style';

// import proj from 'ol/proj';
// import { transform, Projection, transformExtent } from 'ol/proj'; // toLonLat
import Star from './star';
import mapSourceType from './mapSourceType';

const EventEmitter = require('eventemitter3');

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

  getFeaturesHandle = (color, multi = false) => {
    const operate = new Select({
      multi,
      style: new Style({
        fill: new Fill({ color }),
      }),
    });
    this.map.addInteraction(operate);
    return operate;
  };

  getNoneStyleFeaturesHandle = () => {
    const operate = new Select();
    this.map.addInteraction(operate);
    return operate;
  };

  getPointerMoveFeaturesHandle = (color = 'green') => {
    const image = new CircleStyle({
      radius: 8,
      fill: new Fill({ color: 'transparent' }),
      stroke: new Stroke({ color, width: 1 }),
    });
    const style = new Style({
      image,
      fill: new Fill({ color: 'transparent' }),
      stroke: new Stroke({ color, width: 1 }),
    });
    const operate = new Select({
      condition: pointerMove,
      style,
    });
    this.map.addInteraction(operate);
    return operate;
  };
  // addInteraction(typeStr, userInfo) {
  //   if (typeStr !== 'None') {
  //     const draw = new Draw({
  //       source: this.userVectorSource,
  //       type: typeStr,
  //     });
  //     draw.userInfo = userInfo;
  //     map.addInteraction(draw);
  //   }
  // };

  getStyle = (feature, typeColors, field = {}) => {
    const styles = {};
    Object.keys(typeColors).forEach((key) => {
      if (key === 'Point') {
        const image = new CircleStyle({
          radius: 8,
          fill: new Fill({ color: feature.get(field.color) }),
          stroke: new Stroke({ color: feature.get(field.color), width: field.width }),
          // text: new Text({
          //   text: feature.get(field.name),
          // }),
        });
        styles[key] = new Style({
          image,
          // text: new Text({
          //   text: feature.get(field.name),
          // }),
        });
      } else {
        styles[key] = new Style({
          fill: new Fill({ ...typeColors[key].fill }),
          stroke: new Stroke({ ...typeColors[key].stroke }),
          text: new Text({
            text: feature.get(field.name),
          }),
        });
      }
    });
    return styles;
  }

  addZoom=() => {
    this.map.addControl(new Zoom());
  }

  addZoomslider=() => {
    this.map.addControl(new ZoomSlider());
  }

  addFeatures = (feature, typeColors) => {
    // eslint-disable-next-line max-len
    const styleFunction = featureTmp => (this.getStyle(featureTmp, typeColors)[featureTmp.getGeometry().getType()]);

    const vectorSource = new VectorSource({
      features: [feature],
    });
    const VectorTmp = new VectorLayer({
      source: vectorSource,
      style: styleFunction,
    });
    this.map.addOverlay(VectorTmp);
  }

  addJsonFeatures = (features, typeColors) => {
    const featuresJson = (new GeoJSON()).writeFeatures(features[0]);
    // eslint-disable-next-line max-len
    const styleFunction = feature => (this.getStyle(feature, typeColors)[feature.getGeometry().getType()]);

    const vectorSource = new VectorSource({
      features: (new GeoJSON()).readFeatures(featuresJson),
    });
    const VectorTmp = new VectorLayer({
      source: vectorSource,
      style: styleFunction,
    });
    this.map.addOverlay(VectorTmp);
  }

  setMourseMoveFeatures = (color) => {
    this.map.addInteraction(new Select({
      condition: pointerMove,
      style: new Style({
        stroke: new Stroke({ color }),
        fill: new Fill({ color }),
      }),
    }));
  }

  // info={title:,extra:,lonLat:[]}
  setMapLabel = (info, callBack) => {
    const label = (
      <div
        className="mapLabelContain"
        id={info.id}
        style={{
          position: 'relative',
          top: '-25px',
          left: '-6px',
          height: '25px',
        }}
        onClick={callBack}
      >
        <i className={info.faClass ? info.faClass : 'fa fa-map-marker mark'} />
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

  // 绘制轨迹要求参数 cameras:[{lonLat:XX,count:25|default}]
  drawStar = (cameras, colorNum) => {
    const { map } = this;
    // eslint-disable-next-line array-callback-return
    cameras.map((val) => {
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
      setTimeout(() => { star.flashStar(20, star.render); }, 4000 * Math.random(1));
    });
  };

  // 绘制轨迹要求参数 cameras:{lonLat}
  drawTrackNoneConverge = (cameras) => {
    const { map } = this;
    // map.getOverlays().clear();
    if (cameras === undefined || cameras.length < 1 || map === undefined) {
      return;
    }
    const point = [];
    const features = [];

    // eslint-disable-next-line array-callback-return
    cameras.map((list) => {
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
        }),
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
  drawTrack = (cameras) => {
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
    Object.keys(fiter).forEach((idx) => {
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
    Object.keys(fiter).forEach((idx) => {
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
        }),
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
  makeMap = (mapName) => {
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
  addGeoJson = (featureCollection = {}, typeColors = {}, field = { name: 'NAME', color: 'COLOR', width: 1 }) => {
    const styleFunction = feature => (
      this.getStyle(feature, typeColors, field)[feature.getGeometry().getType()]
    );

    const vectorSource = new VectorSource({
      features: (new GeoJSON()).readFeatures(featureCollection),
    });

    const VectorTmp = new VectorLayer({
      source: vectorSource,
      style: styleFunction,
    });
    this.map.addLayer(VectorTmp);
    return VectorTmp;
  }

  // eslint-disable-next-line no-shadow
  getGeoJson= Feature => ((new GeoJSON()).writeFeature(Feature))

  // 绘制地图
  makeGeoJsonMap = (mapName, featureCollection = {}, typeColors = {}) => {
    // eslint-disable-next-line max-len
    const styleFunction = feature => (this.getStyle(feature, typeColors, {})[feature.getGeometry().getType()]);
    const vectorSource = new VectorSource({
      features: (new GeoJSON()).readFeatures(featureCollection),
    });
    // const a=(new GeoJSON()).writeFeature(vectorSource.getFeatures()[1]); 生成json
    // eslint-disable-next-line max-len
    // 获取属性，vectorSource.getFeatures()[1].getProperties() vectorSource.getFeatures()[1].getProperties(
    // ---{geometry: Polygon, SSXZQH: "崂山区", SSJB: "王哥庄街道办", NAME: "王哥庄中心管区", BM: "370212003009"
    // eslint-disable-next-line max-len
    // 获取图形 vectorSource.getFeatures()[1].getGeometry()Polygon{disposed_: false
    // pendingRemovals_: {…}, dispatching_: {…}, listeners_: {…}, revision_: 1

    const VectorTmp = new VectorLayer({
      source: vectorSource,
      style: styleFunction,
    });

    const map = new Map({
      layers: [this.getMapSource()[0], VectorTmp],
      view: new View({
        minZoom: this.getMinZoom(),
        maxZoom: this.getMaxZoom(),
        zoom: this.getZoom(),
        // projection: 'EPSG:3857',
        // center: transform(this.getCenter(),'EPSG:4326', 'EPSG:3857'
        projection: this.getProjection(),
        center: this.getCenter(),
      }),
      controls: [],
      target: mapName,
    });
    this.map = map;
    this.userVectorSource = vectorSource;
    return map;
  };
}

export default mapSource;
