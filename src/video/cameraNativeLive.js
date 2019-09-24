import React from 'react';
import MediaSource from './mediaSource';


class cameraNativeLive extends React.Component {
  componentWillMount() { }

  componentDidMount() {
    this.setVideoUserMedia();
  }

  componentWillUnmount() { }

  getVideo = () => this.Video;

  setVideoUserMedia = () => {
    // eslint-disable-next-line react/prop-types
    const { cameraParam } = this.props;
    setTimeout(() => {
      this.mediaSource = new MediaSource(this.video);
      this.mediaSource.getMedia(cameraParam);
      // setTimeout(() => {
      //   // this.mediaSource.faceSingleRecognition(this.video, 50, this.dowerRecognition);
      //   this.canvasInput = this.mediaSource.createCanvas(this.video, -2);
      //   this.canvasDrawer = this.mediaSource.createCanvas(this.video, 10000000);
      // }, 1000);
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
        style={{ width: '100%', height: '100%' }}
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
