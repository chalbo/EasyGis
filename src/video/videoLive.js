import React from 'react';
import PropTypes from 'prop-types';
import videojs from 'video.js';
import MediaSource from './mediaSource';
import 'video.js/dist/video-js.min.css';
import 'videojs-contrib-hls';

class VideoLive extends React.Component {
  constructor(props) {
    super(props);
    this.cameraLive = new Map();
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);
  }

  getPlayer = () => this.player;

  getVideo = () => this.video;

  getImage = () => {
    const source = new MediaSource(this.video);
    return source.getBase64Image();
  }

  play = () => {
    this.player.play();
  }

  change = (src) => {
    if (!src) { return; }
    this.player.src(src);
  }

  closeVideo = () => {
    if (this.play) {
      this.play.pause();
      this.play.dispose();
      this.play = undefined;
    }
  }

  render() {
    const { src, isPlay } = this.props;
    let { type } = this.props;

    if (!type) {
      type = 'video/mp4';
    }

    const videoJsOptions = {
      // autoPlay: true,/video/53166f2ecdc048be8d6a68ad153a5cff/video.m3u8
      controls: true,
      preload: 'auto',
      sources: [
        {
          src,
          type,
        },
      ],
    };
    return (
      <video
        style={{ width: '100%', height: '100%', 'object-fit': 'fill' }}
        className="video-js"
        ref={(ref) => {
          if (ref) {
            const player = videojs(ref, videoJsOptions);
            this.video = ref;
            this.player = player;
            if (isPlay) {
              player.play();
            }
          }
        }}
      >
        <track kind="captions" />
      </video>
    );
  }
}
VideoLive.propTypes = {
  src: PropTypes.string,
  type: PropTypes.string,
  isPlay: PropTypes.bool,
  onRef: PropTypes.func,
};

export default VideoLive;
