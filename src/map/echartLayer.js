
import { layer } from 'ol';

class EchartLayer extends layer {
  isBaseLayer = false

  echart = null

  mapLayer = null

  _geoCoord = []

  constructor(name, map, echart, options) {
    super([name, options]);
    const scope = this; const echartdiv = document.createElement('div'); let
      handler;

    // OpenLayers.Layer.prototype.initialize.apply(this, [name, options]);

    echartdiv.style.cssText = `position:absolute;width:${map.size.w}px;height:${
      map.size.h}px;`;
    scope.div.appendChild(echartdiv);
    scope.map = map;
    scope.echartdiv = echartdiv;
    scope.opacity = options.opacity;
    scope.echart = echart;
    scope.option = options.option;
    // eslint-disable-next-line no-redeclare
    const handler = function (e) {
      scope.updateLayer(e);
    };
    map.events.register('zoomend', this, handler);
    map.events.register('moveend', this, handler);
  }

  geoCoord2Pixel = (geoCoord) => {
    const scope = this;
    const lonLat = new OpenLayers.LonLat(geoCoord[0], geoCoord[1]);
    const scrPt = scope.map.getPixelFromLonLat(lonLat);
    const { x } = scrPt;
    const { y } = scrPt;
    return [x, y];
  }

  updateLayer = (e) => {
    const scope = this;
    const myChart = scope.echart.init(scope.echartdiv);
    let orgXy;
    if (e) {
      orgXy = e.object.layerContainerOriginPx;
    } else {
      orgXy = { x: 0, y: 0 };
    }
    // eslint-disable-next-line prefer-destructuring
    const w = scope.map.size.w;
    // eslint-disable-next-line prefer-destructuring
    const h = scope.map.size.h;
    scope.echartdiv.style.cssText = `position:absolute;top:${-orgXy.y}px;left:${-orgXy.x
    }px;width:${w}px;height:${h}px;`;
    const ecOption = scope.getEcOption();
    myChart.setOption(ecOption);
  }

  /**
   *将echart的option转换
   * @returns {*}
   */
  getEcOption = () => {
    const scope = this;
    scope._option = scope.option;
    const series = scope._option.series || {};
    // 记录所有的geoCoord
    for (var i = 0, item; item = series[i++];) {
      const { geoCoord } = item;
      if (geoCoord) {
        for (var k in geoCoord) {
          scope._geoCoord[k] = geoCoord[k];
        }
      }
    }

    // 添加x、y
    for (var i = 0, item; item = series[i++];) {
      const markPoint = item.markPoint || {};
      const markLine = item.markLine || {};

      let { data } = markPoint;
      if (data && data.length) {
        for (var k = 0, len = data.length; k < len; k++) {
          if (!(data[k].name && this._geoCoord.hasOwnProperty(data[k].name))) {
            data[k].name = `${k}markp`;
            scope._geoCoord[data[k].name] = data[k].geoCoord;
          }
          scope._AddPos(data[k]);
        }
      }

      data = markLine.data;
      if (data && data.length) {
        for (var k = 0, len = data.length; k < len; k++) {
          if (!(data[k][0].name && this._geoCoord.hasOwnProperty(data[k][0].name))) {
            data[k][0].name = `${k}startp`;
            scope._geoCoord[data[k][0].name] = data[k][0].geoCoord;
          }
          if (!(data[k][1].name && this._geoCoord.hasOwnProperty(data[k][1].name))) {
            data[k][1].name = `${k}endp`;
            scope._geoCoord[data[k][1].name] = data[k][1].geoCoord;
          }
          scope._AddPos(data[k][0]);
          scope._AddPos(data[k][1]);
        }
      }
    }
    return scope._option;
  }

  _AddPos = (obj) => {
    const scope = this;
    const coord = scope._geoCoord[obj.name];
    const pos = scope.geoCoord2Pixel(coord);
    obj.x = pos[0]; // - self._mapOffset[0];
    obj.y = pos[1]; // - self._mapOffset[1];
  }
}
export default EchartLayer;
