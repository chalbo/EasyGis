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
// import VectorLayer from 'ol/layer/Vector';
import { Heatmap, Vector as VectorLayer } from 'ol/layer';
import { Select } from 'ol/interaction';
import { pointerMove } from 'ol/events/condition';
import Overlay from 'ol/Overlay';
import {
  Fill, Stroke, Style, Text, Circle as CircleStyle, RegularShape,
} from 'ol/style';

// import proj from 'ol/proj';
// import { transform, Projection, transformExtent } from 'ol/proj'; // toLonLat
import Star from './star';
import Base from './base';

class wfsHandle extends Base {
  constructor(mapBase) {
    super();
    this.mapBase = mapBase;
    this.userVectorSource = null;
  }

  getFeaturesHandle = (color, multi = false) => {
    const operate = new Select({
      multi,
      style: new Style({
        fill: new Fill({ color }),
      }),
    });
    this.mapBase.map.addInteraction(operate);
    return operate;
  };

  getNoneStyleFeaturesHandle = () => {
    const operate = new Select();
    this.mapBase.map.addInteraction(operate);
    return operate;
  };

  getPointerMoveFeaturesHandle = () => {
    const operate = new Select({
      condition: pointerMove,
    });
    this.mapBase.map.addInteraction(operate);
    return operate;
  };

  getStyle = (feature, typeColors, field = {}) => {
    const styles = {};
    Object.keys(typeColors).forEach((key) => {
      if (key === 'Point') {
        if (field.pointRegularShape) {
          const image = new RegularShape({
            ...field.pointRegularShape,
            fill: field.hollow ? null : new Fill({ color: feature.get(field.color) }),
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
          const image = new CircleStyle({
            radius: field.radius,
            fill: field.hollow ? null : new Fill({ color: feature.get(field.color) }),
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
        }
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
    this.mapBase.map.addOverlay(VectorTmp);
  }

  addJsonFeatures = (features, typeColors) => {
    const featureProjection = this.getProjection();
    const featuresJson = (new GeoJSON({ featureProjection })).writeFeatures(features[0]);
    // eslint-disable-next-line max-len
    const styleFunction = feature => (this.getStyle(feature, typeColors)[feature.getGeometry().getType()]);

    const vectorSource = new VectorSource({
      features: (new GeoJSON({ featureProjection })).readFeatures(featuresJson),
    });
    const VectorTmp = new VectorLayer({
      source: vectorSource,
      style: styleFunction,
    });
    this.mapBase.map.addOverlay(VectorTmp);
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


  // 绘制轨迹要求参数 cameras:[{lonLat:XX,count:25|default}]
  drawStar = (cameras, colorNum) => {
    const { map } = this.mapBase;
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
      overlay.setPosition(this.mapBase.setMapPosition(val.lonLat));
      map.addOverlay(overlay);
      setTimeout(() => { star.flashStar(20, star.render); }, 4000 * Math.random(1));
    });
  };

  // 绘制轨迹要求参数 cameras:{lonLat}
  drawTrackNoneConverge = (cameras) => {
    const { map } = this.mapBase;
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
      point.push(this.mapBase.setMapPosition(list.lonLat));
      const overlay = new Overlay({
        element: $urlDom,
        stopEvent: false,
        positioning: 'bottom-center',
      });
      overlay.setPosition(this.mapBase.setMapPosition(list.lonLat));
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
          projection: this.mapBase.getProjection(),
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
    const { map } = this.mapBase;
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
      point.push(this.mapBase.setMapPosition(list[0].lonLat));
      const overlay = new Overlay({
        element: $urlDom,
        stopEvent: false,
        positioning: 'bottom-center',
      });
      overlay.setPosition(this.mapBase.setMapPosition(list[0].lonLat));
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
          projection: this.mapBase.getProjection(),
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
  addGeoJson = (featureCollection = {}, typeColors = {}, field = { name: 'NAME', color: 'COLOR', width: 1 }) => {
    const featureProjection = this.mapBase.getProjection();
    const styleFunction = feature => (
      this.getStyle(feature, typeColors, field)[feature.getGeometry().getType()]
    );
    const vectorSource = new VectorSource({
      features: (new GeoJSON({ featureProjection })).readFeatures(featureCollection),
    });

    const VectorTmp = new VectorLayer({
      source: vectorSource,
      style: styleFunction,
    });
    this.mapBase.map.addLayer(VectorTmp);
    return VectorTmp;
  }

  // 添加热力图
  addHeatmapGeoJson = (featureCollection = {}, typeColors = {}, field = { name: 'NAME', color: 'COLOR', width: 1 }) => {
    const featureProjection = this.mapBase.getProjection();
    const styleFunction = feature => (
      this.getStyle(feature, typeColors, field)[feature.getGeometry().getType()]
    );
    const vectorSource = new VectorSource({
      features: (new GeoJSON({ featureProjection })).readFeatures(featureCollection),
      style: styleFunction,
    });
    const vector = new Heatmap({
      source: vectorSource,
      opacity: [0, 0.8], // 透明度
      blur: 15, // 模糊大小（以像素为单位）,默认15
      radius: 5, // 半径大小（以像素为单位,默认8
      shadow: 300, // 阴影像素大小，默认250
      // 矢量图层的渲染模式：
      // 'image'：矢量图层呈现为图像。性能出色，但点符号和文本始终随视图一起旋转，像素在缩放动画期间缩放。
      // 'vector'：矢量图层呈现为矢量。即使在动画期间也能获得最准确的渲染，但性能会降低。
      renderMode: 'vector',
    });
    this.mapBase.map.addLayer(vector);
  }

  // eslint-disable-next-line no-shadow
  getGeoJson = Feature => ((new GeoJSON({
    featureProjection: this.mapBase.getProjection(),
  })).writeFeature(Feature))

  // 绘制地图
  makeGeoJsonMap = (mapName, featureCollection = {}, typeColors = {}) => {
    // eslint-disable-next-line max-len
    const styleFunction = feature => (this.getStyle(feature, typeColors, {})[feature.getGeometry().getType()]);
    const vectorSource = new VectorSource({
      features: (new GeoJSON({
        featureProjection: this.mapBase.getProjection(),
      })).readFeatures(featureCollection),
    });
    // const a=(new GeoJSON({
    //  featureProjection: this.getProjection()
    // })).writeFeature(vectorSource.getFeatures()[1]); 生成json
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
      layers: [this.mapBase.getMapSource()[0], VectorTmp],
      view: new View({
        minZoom: this.mapBase.getMinZoom(),
        maxZoom: this.mapBase.getMaxZoom(),
        zoom: this.mapBase.getZoom(),
        // projection: 'EPSG:3857',
        // center: transform(this.getCenter(),'EPSG:4326', 'EPSG:3857'
        projection: this.mapBase.getProjection(),
        center: this.mapBase.getCenter(),
      }),
      controls: [],
      target: mapName,
    });
    this.mapBase.map = map;
    this.userVectorSource = vectorSource;
    return map;
  };
}

export default wfsHandle;
