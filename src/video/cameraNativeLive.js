import React from 'react';
import * as RX from 'rxjs';
import MediaSource from './mediaSource';
import 'video.js/dist/video-js.min.css';
import 'videojs-contrib-hls';


class cameraNativeLive extends React.Component {
  componentWillMount() { }

  componentDidMount() {
    this.setVideoUserMedia();
  }

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
    return (
      <video
        ref={(ref) => {
          if (ref) {
            this.video = ref;
          }
        }}
      >
        <track kind="captions" />
      </video>
    );
  }
}

export default cameraNativeLive;
