import React from 'react';
import PropTypes from 'prop-types';
import * as RX from 'rxjs';
import MediaSource from './mediaSource';
import Video from './videoLive';
import 'video.js/dist/video-js.min.css';
import 'videojs-contrib-hls';


class cameraM3u8Live extends React.Component {
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

  onRef = (ref) => {
    this.child = ref;
  }

  close = () => {
    this.child.close();
  }

  getImage = () => this.child.getImage();

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
      <Video onRef={this.onRef} src={src} isPlay={isPlay} type={type} />
    );
  }
}
cameraM3u8Live.propTypes = {
  src: PropTypes.string,
  type: PropTypes.string,
  isPlay: PropTypes.bool,
};

export default cameraM3u8Live;
