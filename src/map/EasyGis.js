import MapSource from './mapSource';
import WfsHandle from './WfsHandle';
import MapBase from './MapBase';
import Base from './Base';
import MapInteractive from './MapInteractive';
import request from '../request';
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
  //   window.EasyGis = { MapSource: null, getArgc };
  // } else {
  window.EasyGis = { Base, MapBase, MapSource, getArgc, WfsHandle, MapInteractive, request };
  //  }
}

export {
  Base, MapBase, MapSource, getArgc, WfsHandle, MapInteractive, request,
};
