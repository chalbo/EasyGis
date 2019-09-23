import React from 'react';
import PropTypes from 'prop-types';
import videojs from 'video.js';
import styles from './style.less';
import 'video.js/dist/video-js.min.css';
import 'videojs-contrib-hls';

class VideoLive extends React.Component {
  constructor(props) {
    super(props);
    this.cameraLive = new Map();
  }

  getPlayer = () => this.player;

  getVideo = () => this.Video;

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
      type = 'application/x-mpegURL';
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
        className={`video-js ${styles['video-js']}`}
        ref={(ref) => {
          if (ref) {
            const player = videojs(ref, videoJsOptions);
            this.Video = ref;
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
};

export default VideoLive;
