import ReactDOM from 'react-dom';
import mediaSource from './mediaSource';
import Video from './videoLive';
import CameraM3u8Live from './cameraM3u8Live';
import cameraNativeLive from './cameraNativeLive';

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
class SugonVideo {
  // 构造。
  constructor({
    videoType, id = '', src = '', isPlay = false,
  }) {
    this.videoType = videoType; // nativeCamera video/mp4 ,application/x-mpegURL';
    switch (videoType) {
      case 'nativeCamera':
        this.bindNativeVideo({ id });
        break;
      case 'video/mp4':
        this.bindVideo({ id, src, isPlay });
        break;
      case 'application/x-mpegURL:':
        this.bindM3u8Video({ id, src, isPlay });
        break;
      default:
        throw new Error('no video type');
    }
  }

  onRef = (ref) => {
    this.child = ref;
  }

  onclose = () => {
    this.child.close();
  }

  getVideoObj = () => this.child

  getImage = () => this.child.getImage();

  bindNativeVideo = ({
    id = '',
  }) => {
    ReactDOM.render(
      <cameraNativeLive
        onRef={this.onRef}
      />,
      document.getElementById(id),
    );
  }

  bindVideo = ({
    id = '', src = '', isPlay = false,
  }) => {
    ReactDOM.render(
      <Video
        onRef={this.onRef}
        src={src}
        isPlay={isPlay}
        type={this.videoType}
      />,
      document.getElementById(id),
    );
  }

  bindM3u8Video = ({
    id = '', src = '', isPlay = false,
  }) => {
    ReactDOM.render(
      <CameraM3u8Live
        onRef={this.onRef}
        src={src}
        isPlay={isPlay}
        type={this.videoType}
      />, document.getElementById(id),
    );
  }
}


if (typeof window === 'object') {
  window.sugonVideo = { SugonVideo, mediaSource, getArgc };
}

export { SugonVideo, mediaSource, getArgc };
