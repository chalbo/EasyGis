
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
 