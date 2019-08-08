import MapSource from './mapSource';  

function getArgc() {
  var args = {};
  var match = null;
  var search = decodeURIComponent(location.search.substring(1));
  var reg = /(?:([^&]+)=([^&]+))/g;
  while ((match = reg.exec(search)) !== null) {
      args[match[1]] = match[2];
  }
  return args;
};  

if(typeof window ==='object'){ 
  window.sugonGis={MapSource,getArgc};
}
 
export default {MapSource,getArgc}
