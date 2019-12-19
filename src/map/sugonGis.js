import moment from 'moment';
import MapSource from './mapSource';
import WfsHandle from './wfsHandle';
import MapInteractive from './mapInteractive';
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
  // const nowtime = moment();
  // const rq = moment('20191029', 'YYYYMMDD');
  // if (rq < nowtime) {
  //   // window.location.href = 'null';
  //   window.sugonGis = { MapSource: null, getArgc };
  // } else {
  window.sugonGis = { MapSource, getArgc };
  //  }
}

export {
  MapSource, getArgc, WfsHandle, MapInteractive,
};
