
### 安装

```bash
 $git clone https://10.6.8.8/zhangbo/sugongis
 $cd sugongis
 $webpack -p 
or
 $npm start        
```
### 使用
#### sugonGis    
```
      var sugonGis = window.sugonGis;
      var _orientation = { A1: '市场监督-已定位', A2: '市场监督-未定位', A3: '市场监督-虚假地址', B1: '共有-已定位', B2: '共有-未定位', B3: '共有-虚假地址', C1: '税务-已定位', C2: '税务-未定位', C3: '税务-虚假地址' };
      typeColors = {
        Point: { fill: { color: 'red' }, stroke: { color: 'green' } },
        LineString: { fill: { color: 'red' }, stroke: { color: 'green' } },
        MultiLineString: { fill: { color: 'red' }, stroke: { color: 'green' } },
        MultiPoint: { fill: { color: 'red' }, stroke: { color: 'green' } },
        MultiPolygon: { fill: { color: 'rgb(123,123,123,0.1)' }, stroke: { color: 'green' } },
        Polygon: { fill: { color: 'rgb(123,123,123,0.1)' }, stroke: { color: 'green' } },
        GeometryCollection: { fill: { color: 'red' }, stroke: { color: 'green' } },
        Circle: { fill: { color: 'red' }, stroke: { color: 'green' } },
      }
      //var lonLat = [parseFloat(argc['lonLat'].split(',')[0]), parseFloat(argc['lonLat'].split(',')[1])];  
      var mapSource = new sugonGis.MapSource({ ..._configData, map_zoom: 14 });
      mapSource.makeMap(document.getElementById('map'));
      mapSource.addGeoJson(_MAP_GRIED, typeColors, { name: 'NAME' });
      mapSource.addZoom();
      mapSource.addZoomslider();
```
#### sugonVideo   
##### 使用：  
```
const { SugonVideo, mediaSource } = window.sugonVideo;

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
```
#####  api接口汇总
SugonVideo, mediaSource
使用： 插件支持多种视屏访问，直播m3u8,普通视屏播放， 调用原生摄像头。
```
const mp4 = new SugonVideo({
  videoType: 'video/mp4', id: 'video', src: 'movie.mp4', isPlay: true,
});
SugonVideo 类 公共属性方法：
    //获取原始对象
    mp4.getVideoObj()
        //获取原始标签
        mp4.getVideoObj().video
        // m3u8 心跳函数 ：heartbeat
         m3u8.getVideoObj().heartbeat({ quest: { url: '/ks/application/dynamicStructure/breath', src: '/video/60073db6a95444c0994bdd54e943060e/video.m3u8', type: 'POST' }, rate: 1000 });
    //获取视频base64
    mp4.getImage()
    //获取视屏类型
    mp4.videoType

//画框类：

mediaSource 类
调用
var source= new mediaSource(this.video)
//创建画板 参数 当前video 和z-index
var canvas= source.createCanvas(this.video, 10000000);
//画框canvas为创建的画板，source.drawDetectionInfoCallback(canvas)(detections), detections结构为后台获取：[{x,y,imageWidth, imageHeight},{}...]
使用：
setInterval(() => { (source.drawDetectionInfoCallback(canvas))(detections)},500) 

```