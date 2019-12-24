import 'ol/ol.css';
import Draw from 'ol/interaction/Draw';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import Base from './Base';
import './map.css';


class DrawRendering extends Base {
  constructor(mapBase) {
    super();
    this.mapBase = mapBase;
    this.userVectorSource = null;
    this.draw = null;
    this.source = new VectorSource({ wrapX: false });
  }

  renderingTypes = {
    Point: 'Point', LineString: 'LineString', Polygon: 'Polygon', Circle: 'Circle', None: 'None',
  }

  clearDraw = () => {
    this.mapBase.map.removeInteraction(this.draw);
  }

  addVectorLayer = () => {
    const vector = new VectorLayer({
      source: this.source,
    });
    this.mapBase.map.addVectorLayer(vector);
  }

  addInteraction = (renderingType) => {
    const val = this.renderingTypes[renderingType];
    if (val !== 'None') {
      this.draw = new Draw({
        source: this.source,
        type: val,
      });
      this.mapBase.map.addInteraction(this.draw);
    } else {
      console.error('error for renderingTypes');
    }
  }
}

export default DrawRendering;
