import MapSource from './mapSource';
import 'ol/ol.css';

function getArgc() {
  const args = {};
  let match = null;
  // eslint-disable-next-line no-restricted-globals
  const search = decodeURIComponent(location.search.substring(1));
  const reg = /(?:([^&]+)=([^&]+))/g;
  while ((match = reg.exec(search)) !== null) {
    args[match[1]] = match[2];
  }
  return args;
}

if (typeof window === 'object') {
  window.sugonGis = { MapSource, getArgc };
}

export { MapSource, getArgc };