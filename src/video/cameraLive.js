import React from 'react';
import PropTypes from 'prop-types';
import MediaSource from './mediaSource';
import 'video.js/dist/video-js.min.css';
import 'videojs-contrib-hls';


class CameraLive extends React.Component {
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  getVideo = () => this.Video;

  setVideoUserMedia = () => {
    setTimeout(() => {
      this.mediaSource = new MediaSource(this.video);
      this.mediaSource.getMedia({
        width: { min: 640, ideal: 1024, max: 1024 },
        height: { min: 480, ideal: 725, max: 768 },
      });
      setTimeout(() => {
        // this.mediaSource.faceSingleRecognition(this.video, 50, this.dowerRecognition);
        this.canvasInput = this.mediaSource.createCanvas(this.video, -2);
        this.canvasDrawer = this.mediaSource.createCanvas(this.video, 10000000);
        this.startImageLoad(this.canvasInput, this.canvasDrawer);
      }, 1000);
    }, 1000);
  }

  render() {
    const { isPlay, src } = this.props;
    let { type } = this.props;

    if (!type) {
      type = 'application/x-mpegURL';
    }
    if (!src) {
      this.setVideoUserMedia();
    } else {
      setTimeout(() => {
        this.video.src = src;
      });
    }

    return (
      <video
        ref={(ref) => {
          if (ref) {
            this.video = ref;
          }
        }}
        id="videoCamera"
        autoPlay={isPlay}
        playsInline
        loop
        muted
      >
        <track src="" kind="captions" />
      </video>
    );
  }
}
CameraLive.propTypes = {
  src: PropTypes.string,
  type: PropTypes.string,
  isPlay: PropTypes.bool,
};

export default CameraLive;
