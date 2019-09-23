import mediaSource from './mediaSource';

function getArgc() {
  const args = {};
  let match = null;
  // eslint-disable-next-line no-restricted-globals
  const search = decodeURIComponent(location.search.substring(1));
  const reg = /(?:([^&]+)=([^&]+))/g;
  // eslint-disable-next-line no-cond-assign
  while ((match = reg.exec(search)) !== null) {
    // eslint-disable-next-line prefer-destructuring
    args[match[1]] = match[2];
  }
  return args;
}

if (typeof window === 'object') {
  window.sugonVideo = { mediaSource, getArgc };
}

export { mediaSource, getArgc };
