import { SugonVideo, mediaSource, getArgc } from './sugonVideo';
// const mp4 = new SugonVideo({
//   videoType: 'video/mp4', id: 'video', src: '', isPlay: true,
// });

// const m3u8 = new SugonVideo({
//   videoType: 'application/x-mpegURL:', id: 'video2', src: '', isPlay: true,
// });

const nativeVideo = new SugonVideo({
  videoType: 'nativeCamera',
  id: 'video3',
  cameraParam: {
    width: { min: 320, ideal: 640, max: 1024 },
    height: { min: 240, ideal: 480, max: 768 },
  },
});
nativeVideo.getVideoObj();
console.log(nativeVideo.getImage());
