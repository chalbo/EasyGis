import React from 'react';
import PropTypes from 'prop-types';
import * as RX from 'rxjs';
import { takeWhile, switchMap } from 'rxjs/operators';
import Video from './videoLive';
import request from '../request';

export async function heartbeatUrl({ url, type = 'POST' }) {
  return request(url, {
    method: type,
    body: {
      method: type,
    },
  });
}

class cameraM3u8Live extends React.Component {
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  getVideo = () => this.Video;

  onRef = (ref) => {
    this.child = ref;
  }

  close = () => {
    this.child.close();
  }

  getImage = () => this.child.getImage();

  heartbeat = ({ quest: { url, type = 'POST' }, rate }) => {
    RX.interval(rate)
      .pipe(
        switchMap(() => heartbeatUrl({ url, type })),
        takeWhile((response) => {
          console.log(response);
        }),
      );
  }

  render() {
    const { isPlay, src } = this.props;
    let { type } = this.props;

    if (!type) {
      type = 'application/x-mpegURL';
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
