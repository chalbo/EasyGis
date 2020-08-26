import Map from 'ol/Map';
import { GeoJSON } from 'ol/format';
import View from 'ol/View';
import { Select } from 'ol/interaction';
import { pointerMove } from 'ol/events/condition';
import { ZoomSlider, Zoom } from 'ol/control';
import {
  Fill, Stroke, Style,
} from 'ol/style';
import mapSourceType from './mapSourceType';
import Base from './Base';

class MapBase extends Base {
  constructor(config) {
    super();
    if (!config) {
      console.error('no map config plase add map conifguration');
      return;
    }
    this.MapSource = mapSourceType(config);
    this.config = config;
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

  addZoom = () => {
    this.map.addControl(new Zoom());
  }

  addZoomslider = () => {
    this.map.addControl(new ZoomSlider());
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

  // eslint-disable-next-line no-shadow
  getGeoJson = Feature => ((new GeoJSON({
    featureProjection: this.getProjection(),
  })).writeFeature(Feature))

  // 获取mapDOM
  getMapDom = () => (this.map.getTargetElement())

  getView = () => (this.map.getView())

  // //添加图层
  // addLayer = (mapBase) => { this.map.addLayer(mapBase.getMapSource()[0]) }

  // //删除图层
  // removeLayer = (mapBase) => { this.map.removeLayer(mapBase.getMapSource()[0]) }

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
    this.mapName = mapName;
    return map;
  };
}

export default MapBase;
