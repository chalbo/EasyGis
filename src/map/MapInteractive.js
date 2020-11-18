import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import Feature from 'ol/Feature';
import { LineString } from 'ol/geom';
import { Vector } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Select } from 'ol/interaction';
import { pointerMove } from 'ol/events/condition';
import Overlay from 'ol/Overlay';
import {
  Fill, Stroke, Style,
} from 'ol/style';

import Star from './Star';
import Base from './Base';
import './map.css';

class MapInteractive extends Base {
  constructor(mapBase) {
    super();
    this.mapBase = mapBase;
    this.userVectorSource = null;
  }

  getPointerMoveFeaturesHandle = () => {
    const operate = new Select({
      condition: pointerMove,
    });
    this.mapBase.map.addInteraction(operate);
    return operate;
  };

  setMourseMoveFeatures = (color) => {
    this.mapBase.map.addInteraction(new Select({
      condition: pointerMove,
      style: new Style({
        stroke: new Stroke({ color }),
        fill: new Fill({ color }),
      }),
    }));
  }

  // 添加地图弹层框气泡
  addMapJSXPopup = (jsxContent, lonLat, showStatusHandel, closeHandler) => {
    const Label = () => {
      const [isShow, changeState] = useState(true);
      showStatusHandel(changeState);
      return (
        <div className="ol-popup" style={{ display: isShow ? 'block' : 'none' }}>
          <i
            className="ol-popup-closer"
            style={{ fontStyle: 'normal', cursor: 'pointer' }}
            onClick={(e) => {
              changeState(false);
              const aLink = e.target;
              aLink.blur();
              if (closeHandler) { closeHandler(e); }
              return false;
            }}
          />
          <div className="ol-popup-content">
            {jsxContent}
          </div>
        </div>
      );
    };
    const contain = document.createElement('div');
    contain.className = 'ol-contain';
    contain.style.position = 'relative';
    contain.style.height = 0;
    ReactDOM.render(<Label />, contain);
    // document.body.appendChild(contain);
    const overlay = new Overlay({
      position: this.mapBase.setMapPosition(lonLat),
      element: contain,
      stopEvent: false,
      positioning: 'bottom-left',
    });
    this.mapBase.map.addOverlay(overlay);
    return overlay;
  };

  // 添加地图弹层框气泡
  addMapPopup = (content, lonLat, showStatusHandel) => {
    const Label = () => {
      const [isShow, changeState] = useState(true);
      showStatusHandel(changeState);
      return (
        <div className="ol-popup" style={{ display: isShow ? 'block' : 'none' }}>
          <a href="#"
            className="ol-popup-closer"
            onClick={(e) => {
              changeState(false);
              const aLink = e.target;
              aLink.blur();
              return false;
            }}
          />
          <div className="ol-popup-content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    };
    const contain = document.createElement('div');
    contain.className = 'ol-contain';
    contain.style.position = 'relative';
    contain.style.height = 0;
    ReactDOM.render(<Label />, contain);
    // document.body.appendChild(contain);
    const overlay = new Overlay({
      position: this.mapBase.setMapPosition(lonLat),
      element: contain,
      stopEvent: false,
      positioning: 'bottom-left',
    });
    this.mapBase.map.addOverlay(overlay);
  };

  // domInfo={dom:,extra:,lonLat:[]}
  // 添加地图弹层
  addMapDom = (dom, lonLat) => {
    const overlay = new Overlay({
      position: this.mapBase.setMapPosition(lonLat),
      element: dom,
      stopEvent: true,
      positioning: 'bottom-left',
    });
    this.mapBase.map.addOverlay(overlay);
  };

  // info={title:,extra:,lonLat:[]}
  setMapLabel = (info, callBack) => {
    const label = (
      <div
        className="ol-mapLabelContain"
        id={info.id}
        // style={{
        //   position: 'relative',
        //   top: '-25px',
        //   left: '-6px',
        //   height: '25px',
        // }}
        onClick={callBack}
      >
        <i className={info.faClass ? info.faClass : 'fa fa-map-marker mark'}
          style={{
            position: 'absolute', bottom: 0, zindex: 99999,
          }}
        />
        <div className="ol-mapLabel"
          style={{
            bottom: 0, left: 15, zindex: 99999,
          }}
        >
          {info.comparisonAddress}
          <i dangerouslySetInnerHTML={{ __html: info.title }} />
          <i dangerouslySetInnerHTML={{ __html: info.extra }} />
        </div>
      </div>
    );
    const contain = document.createElement('div');
    contain.className = 'ol-contain';
    contain.style.position = 'relative';
    contain.style.height = 0;
    ReactDOM.render(label, contain);
    const overlay = new Overlay({
      position: this.mapBase.setMapPosition(info.lonLat),
      element: contain,
      stopEvent: false,
      positioning: 'bottom-left',
    });
    this.mapBase.map.addOverlay(overlay);
    return overlay;
  };

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
        positioning: 'bottom-left',
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

  // 添加多地图切换 未完成
  addMapLayerChange = (mapName, config) => {
    const Label = () => {
      const [isShow, changeState] = useState(true);

      return (
        <div className="ol-select-menu-container">
          <a href="#"
            className="ol-popup-closer"
            onClick={(e) => {
              changeState(false);
              const aLink = e.target;
              aLink.blur();
              return false;
            }}
          />
          <div className="ol-popup-content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    };
    const contain = document.createElement('div');
    contain.className = 'ol-select-menu';
    contain.style.height = 0;
    ReactDOM.render(<Label />, contain);
    if (typeof mapName === 'string') {
      document.getElementById('mapName').parentElement.appendChild(contain);
    } else {
      mapName.parentElement.appendChild(contain);
    }


  };
}

export default MapInteractive;
