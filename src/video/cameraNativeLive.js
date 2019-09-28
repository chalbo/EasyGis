import React from 'react';
import PropTypes from 'prop-types';
import MediaSource from './mediaSource';


class cameraNativeLive extends React.Component {
  componentWillMount() { }

  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);
    this.setVideoUserMedia();
  }

  componentWillUnmount() { }

  getVideo = () => this.video;

  setVideoUserMedia = () => {
    // eslint-disable-next-line react/prop-types
    const { cameraParam } = this.props;
    setTimeout(() => {
      this.mediaSource = new MediaSource(this.video);
      this.mediaSource.getMedia(cameraParam);
      setTimeout(() => {
        // this.mediaSource.faceSingleRecognition(this.video, 50, this.dowerRecognition);
        this.canvasInput = this.mediaSource.createCanvas(this.video, -2);
        this.canvasDrawer = this.mediaSource.createCanvas(this.video, 10000000);
      }, 1000);
    }, 1000);
  }

  getVideo = () => this.video;

  getImage = () => {
    const source = new MediaSource(this.video);
    return source.getBase64Image();
  }

  close = () => {
    this.child.close();
  }

  render() {
    return (
      <video
        style={{ width: '100%', height: '100%' }}
        autoPlay
        playsInline
        loop
        muted
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

cameraNativeLive.propTypes = {
  onRef: PropTypes.func,
};

export default cameraNativeLive;
