
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
# sugonGis使用

标签（空格分隔）： 未分类

---
### 1. 引入包

```
import {
  MapBase, Base, MapSource, getArgc, WfsHandle, MapInteractive,
} from '../sugonGis';
或者
const {
  MapBase, Base, MapSource, getArgc, WfsHandle, MapInteractive,
} =window.sugonGIs;
```
添加Gis配置文件
```
const configData = {
  map_type: 'amap', //支持高德，百度，谷歌，等瓦片图
  map_Url: 'XXXXX',
  map_center: [101.243746, 25.109256],
  map_projection: 'EPSG:4326',
  map_minZoom: 1,
  map_maxZoom: 20,
  map_zoom: 5,
};
```
map_type 支持多种商业地图的瓦片图，以及arcgis，瓦片，wms服务。
同时如果没有图源也可搭建OSM服务进行支持。
 ### 2. 生成地图
```
const mapBase = new MapBase(configData);
mapBase.makeMap(document.getElementById('map')); 
// 工具栏
mapBase.addZoom();
mapBase.addZoomslider();
```
通过网页，id为map的div标签生成地图。此时如无问题地图可视。
```
const mapBase2 = new MapBase(configData2);
mapBase.map.getLayers().clear();
mapBase.map.addLayer(layer[0]);
```
还可以配置多个图源，进行切换底图图源。如何需要实现切换地图位置不变，需要配置相同坐标系。以及中心点。
 ### 3. 地理要素使用
```
const wfsHandle = new WfsHandle(mapBase);
const typeColors = {
  Point: { fill: { color: 'yellow' }, stroke: { color: 'green' },font: 'Bold 20px / 2 Arial' },
  LineString: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
  MultiLineString: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
  MultiPoint: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
  MultiPolygon: { fill: { color: 'rgb(123,123,123,0.1)' }, stroke: { color: 'green' } },
  Polygon: { fill: { color: 'rgb(123,123,123,0.1)' }, stroke: { color: 'green' } },
  GeometryCollection: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
  Circle: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
};
const hotmapdata = {
  type: 'FeatureCollection',
  features: [
    { type: 'Point', coordinates: [101.243746, 25.109256], count: 30 },
    { type: 'Point', coordinates: [101.243746, 25.109256], count: 60 },
    { type: 'Point', coordinates: [99.873148, 24.420492], count: 90 },
    { type: 'Point', coordinates: [101.749672, 23.575372], count: 80 },
    { type: 'Point', coordinates: [102.540756, 24.899677], count: 60 },
    { type: 'Point', coordinates: [102.540756, 24.899677], count: 90 },
    { type: 'Point', coordinates: [103.166264, 25.318472], count: 60 },
    { type: 'Point', coordinates: [101.676083, 25.60242], count: 40 },
    { type: 'Point', coordinates: [101.676083, 25.60242], count: 10 },
    { type: 'Point', coordinates: [99.413215, 26.168271], count: 80 },
    { type: 'Point', coordinates: [101.01378, 22.818552], count: 100 },
  ],
};
wfsHandle.addHeatmapGeoJson(hotmapdata, typeColors, { name: 'NSRMC', color: 'COLOR' ,pointType: 'normal'});

```
wfsHandle实现了对地理要素服务WFS的添加，删除。暂时只支持geojson格式的要素。pointType: 'normal'|pointRegularShape|null
```
const handel = wfsHandle.getFeaturesHandle('rgb(123,123,123,0.5)', true);
handel.on('select', (e) => {
  const features = e.target.getFeatures().getArray();

  const json = wfsHandle.getGeoJson(features[0]);

  // addGeoJson
  const layer1 = wfsHandle.addGeoJson(json, {
    MultiPolygon: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
    Polygon: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
  }, { name: 'NAME' });
  // setTimeout(() => {
  //   wfsHandle.map.removeLayer(layer1);
  // }, 1000);


  // mapSource.addJsonFeatures(features,{
  //   MultiPolygon: { fill: { color: 'rgb(123,123,123,0.4)' }, stroke: { color: 'red' } },
  //   Polygon: { fill: { color: 'rgb(123,123,123,0.4)' }, stroke: { color: 'red' } },}
  // )
});
```
要素选区交互
 ### 4. 地图交互
与dom交互一般使用mapInteractive
mapInteractive 实现对页面特效，与dom交互。可通过事件模型回调用相关信息
```
const mapInteractive = new MapInteractive(mapBase);
mapInteractive.emit('changeName'); //触发 MapInteractive.event.emit('check'); }}>aaaccccaaa</div>,//触发

Base.event.on('check', () => { alert(3); }); //响应
//添加标注
属性有{comparisonAddress:string,title:string|Dom,extra:string|Dom,lonLat:Array }
mapInteractive.setMapLabel({ title: '111122222', lonLat: [120.419354, 36.122387] }, () => {
  console.log(111111);
  alert(1);
});
```

api 暂时简单说明，下个版本使用jsdoc标准化注释。
大部分机构基于[openlayer5](https://openlayers.org/en/latest/apidoc/)
基本结构
```
LonLat=:[string,string];
void
Map  = ol/map
MapDom = :DOMElement
MapSource = ol/source
FeatureCollection= ol/format/WFS/FeatureCollection
JSXContent = react jsx
Dom     = :DOMElement
Cameras=:Array<LonLat>
featureCollection=:Array<{FeatureCollection, typeColors:TypeColors}>
TypeColors=:Array<{ type:string, coordinates:LonLat}>
ConfigData:{map_type:string,map_url:string ...}
interface Base extends EventEmitter{ 
    configData: ConfigData;
}
interface MapBase extends Base{
     ...
}
...
```
常用方法
mapebase对象：
```
getMapSource = ()=>MapSource   //获取地图图源  
 
getProjection=()=>string //获取当前地图坐标系
getCenter=()=>LonLat //获取中心点
clearMap =()=>void  //清理overlayer
addZoom  =()=>void    //工具添加放大
addZoomslider =()=>void //工具添加拖动放大
getMapDom =()=>MapDom //获取map对应dom元素
makeMap =()=>Map //生成地图

```
MapInteractive对象
```
addMapJSXPopup=(jsxContent:JSXContent, lonLat:LonLat, showStatusHandel:funciton)=>void: // 添加jsxdom
addMapPopup=(content:string, lonLat:LonLat, showStatusHandel:funciton)=>void  // 添加dom字符串方式
addMapDom= (dom:Dom, lonLat:LonLat)=>void //直接添加dom进入地图
drawStar(cameras:Cameras, colorNum:string)=>void// colorNum为rgb颜色的值
drawTrack=(cameras) => void 
```

WfsHandle对象
```
getFeaturesHandle=  (color:string, multi:boolean)=>Select //添加创建动作 选择后有颜色区分
getNoneStyleFeaturesHandle=()=>Select //添加创建动作无颜色
getPointerMoveFeaturesHandlee=()=>Select //添加鼠标动作
getStyle= (feature:Feature, typeColors:TypeColors, field = {自定义字段}) =>Style //要素绘制使用的样式类
addFeatures= (feature:Feature, typeColors:TypeColors) => void //添加要素
addJsonFeatures= (features:JSON, typeColors:TypeColors) => void //添加json要素
setMourseMoveFeatures= (color:string) => void //添加鼠标移动要素
addGeoJson=(featureCollection:FeatureCollection, typeColors:TypeColors, field = {})  => void //添加json要素
addHeatmapGeoJson=(featureCollection:FeatureCollection, typeColors:TypeColors, field = {})  => void //添加json要素
getGeoJson=(feature:Feature)=>string//获取要素的json
makeGeoJsonMap= (mapName:string)=>void //直接生成要素地图 
```



 