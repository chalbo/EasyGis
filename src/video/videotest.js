import { SugonVideo, mediaSource, getArgc } from './sugonVideo';

const mp4 = new SugonVideo({
  videoType: 'video/mp4', id: 'video', src: 'movie.mp4', isPlay: true,
});

const m3u8 = new SugonVideo({
  videoType: 'application/x-mpegURL:', id: 'video2', src: '/video/60073db6a95444c0994bdd54e943060e/video.m3u8', isPlay: true,
});
m3u8.getVideoObj().heartbeat({ quest: { url: '/ks/application/dynamicStructure/breath', src: '/video/60073db6a95444c0994bdd54e943060e/video.m3u8', type: 'POST' }, rate: 1000 });

const nativeVideo = new SugonVideo({
  videoType: 'nativeCamera',
  id: 'video3',
  cameraParam: {
    width: { min: 320, ideal: 640, max: 1024 },
    height: { min: 240, ideal: 480, max: 768 },
  },
});
setTimeout(() => {
  console.log(mp4);
  console.log(m3u8);
  console.log(nativeVideo);
}, 5000);
