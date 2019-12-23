import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Draw from 'ol/interaction/Draw';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import Base from './Base';
import './map.css';

const raster = new TileLayer({
  source: new OSM(),
});

const source = new VectorSource({ wrapX: false });

const vector = new VectorLayer({
  source,
});

const map = new Map({
  layers: [raster, vector],
  target: 'map',
  view: new View({
    center: [-11000000, 4600000],
    zoom: 4,
  }),
});

const typeSelect = document.getElementById('type');

let draw; // global so we can remove it later
function addInteraction() {
  const { value } = typeSelect;
  if (value !== 'None') {
    draw = new Draw({
      source,
      type: typeSelect.value,
    });
    map.addInteraction(draw);
  }
}


/**
 * Handle change event.
 */
typeSelect.onchange = function () {
  map.removeInteraction(draw);
  addInteraction();
};

addInteraction();


class DrawRendering extends Base {
  constructor(mapBase) {
    super();
    this.mapBase = mapBase;
    this.userVectorSource = null;
  }

  renderingTypes = {
    Point: 'Point', LineString: 'LineString', Polygon: 'Polygon', Circle: 'Circle', None: 'None',
  }

  addInteraction = () => {
    const { value } = typeSelect;
    if (value !== 'None') {
      draw = new Draw({
        source,
        type: typeSelect.value,
      });
      map.addInteraction(draw);
    }
  }
}

export default DrawRendering;
