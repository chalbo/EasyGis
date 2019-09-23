import * as faceapi from 'face-api.js';
import * as RX from 'rxjs';
import signFaceUrl from '../assets/images/insight/signFace.png';
import structureUrl from '../assets/images/insight/structure.png';

class MediaSource {
  constructor(video) {
    this.video = video;
  }

  createCanvas = (video, zIndex) => {
    const canvas = document.createElement('canvas');
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    canvas.style.position = 'absolute';
    canvas.style.zIndex = zIndex;
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';

    video.parentNode.appendChild(canvas);
    return canvas;
  };

  // eslint-disable-next-line max-len
  // videoParam={width: { min: 640, ideal: 1280, max: 1920 },height: { min: 480, ideal: 720, max: 1080 }}
  getMedia = async (videoParam) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: videoParam,
      });
      this.successFunc(stream);
    } catch (e) {
      this.errorFunc(e);
    }
  };

  faceRecognitionCanvas = async (video) => {
    const canvas = document.createElement('canvas');
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    canvas.style.position = 'absolute';
    canvas.style.zIndex = 1000000;
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
    // canvas.style.border = '2px solid #ccc';
    const ctx = canvas.getContext('2d');
    video.parentNode.appendChild(canvas);
    const MODEL_URL = '/models';
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);

    const imgUpLoadLandmarks = async () => {
      ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);

      const fullFaceDescriptions = await faceapi.detectAllFaces(video).withFaceLandmarks();
      const resizedDetections = faceapi.resizeResults(fullFaceDescriptions, {
        width: video.videoWidth,
        height: video.videoHeight,
      });
      if (fullFaceDescriptions) {
        // fullFaceDescriptions.forEach(fd => {
        //   faceapi.drawDetection(canvas, fd.detection, { withScore: false });
        // });
        faceapi.draw.drawDetections(canvas, resizedDetections);
        if (fullFaceDescriptions.length > 0 && fullFaceDescriptions[0].landmarks) {
          const position = fullFaceDescriptions[0].landmarks.positions[0];
          const imgDims = {
            imageWidth: fullFaceDescriptions[0].landmarks.imageWidth,
            imageHeight: fullFaceDescriptions[0].landmarks.imageHeight,
          };
          // eslint-disable-next-line no-unused-vars
          const base64Data = this.getImgBase64Url({ x: position.x, y: position.y }, imgDims);
        }
      }
      RX.timer(500).subscribe(() => {
        imgUpLoadLandmarks();
      });
    };
    imgUpLoadLandmarks();
  };

  faceSingleRecognition = async (video, faceWidthLimit, callback) => {
    const canvas = this.createCanvas(video, 100);
    const canvasInput = this.createCanvas(video, -1);
    const ctx = canvas.getContext('2d');
    const MODEL_URL = '/models';
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);

    const imgUpLoadLandmarks = async () => {
      ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
      const ctInput = canvasInput.getContext('2d');
      ctInput.drawImage(video, 0, 0);
      const singleFaceDescriptions = await faceapi
        .detectSingleFace(canvasInput)
        .withFaceLandmarks();
      //  const displaySize = { width: video.videoWidth, height: video.videoHeight };
      // faceapi.matchDimensions(canvas, displaySize);
      if (singleFaceDescriptions) {
        // const fd = faceapi.resizeResults(singleFaceDescriptions, displaySize);
        const fd = singleFaceDescriptions;

        if (fd) {
          const detections = [];
          if (fd.landmarks) {
            const position = fd.landmarks.shift;
            const imgDims = {
              imageWidth: fd.landmarks.imageWidth,
              imageHeight: fd.landmarks.imageHeight,
            };
            if (fd.landmarks.imageWidth < faceWidthLimit) {
              return;
            }
            // eslint-disable-next-line no-unused-vars
            const base64Data = this.getImgBase64Url({ x: position.x, y: position.y }, imgDims);
            detections.push({
              img: base64Data,
              startPosition: { x: position.x, y: position.y },
              imgDims,
            });
          }

          if (detections.length > 0) {
            callback(detections, canvas);
          }
        }
      }
      RX.timer(100).subscribe(() => {
        imgUpLoadLandmarks();
      });
    };
    imgUpLoadLandmarks();
  };

  faceRecognition = async (video, faceWidthLimit, callback) => {
    const canvas = this.createCanvas(video, 100);
    const canvasInput = this.createCanvas(video, -1);
    const ctx = canvas.getContext('2d');
    const MODEL_URL = '/models';
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);

    const imgUpLoadLandmarks = async () => {
      ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
      const ctInput = canvasInput.getContext('2d');
      ctInput.drawImage(video, 0, 0);
      const faceDescriptions = await faceapi.detectAllFaces(canvasInput).withFaceLandmarks();
      //  const displaySize = { width: video.videoWidth, height: video.videoHeight };
      // faceapi.matchDimensions(canvas, displaySize);
      const detections = [];
      if (faceDescriptions && faceDescriptions.length > 0) {
        // eslint-disable-next-line array-callback-return
        faceDescriptions.map((fd) => {
          if (fd.landmarks) {
            const position = fd.landmarks.shift;
            const imgDims = {
              imageWidth: fd.landmarks.imageWidth,
              imageHeight: fd.landmarks.imageHeight,
            };
            if (fd.landmarks.imageWidth < faceWidthLimit) {
              return;
            }
            // eslint-disable-next-line no-unused-vars
            const base64Data = this.getImgBase64Url({ x: position.x, y: position.y }, imgDims);
            detections.push({
              img: base64Data,
              startPosition: { x: position.x, y: position.y },
              imgDims,
            });
          }
        });
        if (detections.length > 0) {
          callback(detections, canvas);
        }
      }
      RX.timer(100).subscribe(() => {
        imgUpLoadLandmarks();
      });
    };
    imgUpLoadLandmarks();
  };

  readOutLoud = (message) => {
    if (message !== this.oldMessage) {
      this.oldMessage = message;
      try {
        // eslint-disable-next-line no-undef
        if (speak) {
          // eslint-disable-next-line no-undef
          speak(message);
        } else {
          const speech = new SpeechSynthesisUtterance();
          // const voices = window.speechSynthesis.getVoices();
          // // eslint-disable-next-line prefer-destructuring
          // speech.voice = voices[0];
          // 设置朗读内容和属性
          speech.text = message;
          speech.volume = 3;
          speech.lang = 'zh-cn';
          speech.rate = 1;
          speech.pitch = 1;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(speech);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  getImgBase64Url = (startPosition, imgDims) => {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.video = document.getElementById('videoCamera');
      this.canvas.width = imgDims.imageWidth;
      this.canvas.height = imgDims.imageWidth;
    }
    const { canvas, video } = this;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      video,
      startPosition.x,
      startPosition.y,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    const snapData = canvas.toDataURL('image/jpeg');
    const imgSrc = `${snapData}`;
    return imgSrc;
  };

  // eslint-disable-next-line no-unused-vars
  drawDetectionInfo = (detections, canvas) => {
    // eslint-disable-next-line array-callback-return
    detections.map((info) => {
      const context = canvas.getContext('2d');
      const { imageWidth, imageHeight } = info.imgDims;
      const { x, y } = info.startPosition;
      if (!this.signFace) {
        this.signFace = new Image();
      }
      const drawImage = () => {
        context.drawImage(this.signFace, x, y, imageWidth, imageHeight);
      };

      if (this.signFace.complete) {
        drawImage();
      } else {
        this.signFace.onload = () => {
          drawImage();
        };
      }
      this.signFace.src = signFaceUrl;
      // context.lineWidth = '2';
      // context.strokeStyle = 'blue';
      // const { x, y } = info.startPosition;
      // context.rect(x, y, imageWidth, imageHeight);
      // context.stroke();
      context.font = '16px "微软雅黑"';
      context.fillStyle = '#fff';
      context.textBaseline = 'bottom';
    });
    return (detectionInfo) => {
      let base = 30;
      const context = canvas.getContext('2d');
      this.structure = new Image();
      const drawStructure = (a, b) => {
        context.drawImage(this.structure, a, b, 70, 30);
      };
      // eslint-disable-next-line array-callback-return
      detections.map((info, idx) => {
        const { imageWidth } = info.imgDims;
        const { x, y } = info.startPosition;
        this.structure.src = structureUrl;
        if (this.structure.complete) {
          // eslint-disable-next-line array-callback-return
          Object.keys(detectionInfo[idx]).map((key) => {
            const val = detectionInfo[idx][key];
            if (val.length < 20) {
              drawStructure(x + imageWidth, y + base - 25);
              context.fillText(val, x + imageWidth + 5, y + base);
              base += 30;
            }
          });
        }
        this.structure.src = structureUrl;
        // eslint-disable-next-line array-callback-return
      });
    };
  };

  // eslint-disable-next-line no-unused-vars
  drawDetectionFrame = canvas => (detections) => {
    // eslint-disable-next-line array-callback-return
    detections.map((info) => {
      const context = canvas.getContext('2d');
      const { imageWidth, imageHeight } = info;
      const { x, y } = info;
      if (!this.signFace) {
        this.signFace = new Image();
        this.signFace.src = signFaceUrl;
      }
      const drawImage = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(this.signFace, x, y, imageWidth, imageHeight);
      };
      if (this.signFace.complete) {
        drawImage();
      } else {
        this.signFace.onload = () => {
          drawImage();
        };
      }
    });
  };

  successFunc = (stream) => {
    // myVideoStream = stream
    // haveLocalMedia = true
    // 向我显示我的本地视频
    const videoTracks = stream.getVideoTracks();
    console.log(`Using video device: ${videoTracks[0].label}`);
    window.stream = stream;
    // eslint-disable-next-line no-param-reassign
    this.video.srcObject = stream;
    // 等待pc创建完毕
    // attachMediaIfReady()
  };

  errorFunc = e => console.log(`error :${e}`);
}
export default MediaSource;
