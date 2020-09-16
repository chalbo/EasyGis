import React from 'react';
import {
  MapBase, Base, MapSource, getArgc, WfsHandle, MapInteractive,
} from '../sugonGis';
// import communityJson from '../mapData/json/community';
// import enterprise from '../mapData/Enterprise';
import '../map.css';
import 'font-awesome/css/font-awesome.min.css';

const configData = {
  // map_type: 'XYZ',
  // map_Url:
  //   'http://localhost:3000/terrain/{z}/{x}/{y}.jpg',
  // map_center: [11224194.75460964, 2789606.398616877],
  // map_projection: 'EPSG:3857',
  map_type: 'amap',
  map_name: '卫星图',
  map_img: '../../assets/images/satellite.jpg',
  map_Url:
    'http://wprd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',

  "map_center": [
    120.8748857735294,
    31.17615108705883
  ],
  map_projection: 'EPSG:4326',
  map_minZoom: 1,
  map_maxZoom: 20,
  map_zoom: 12,
};
const configData2 = {
  map_type: 'XYZ',
  map_name: '高德地图',
  map_img: '../../assets/images/street.jpg',
  map_Url:
    'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  map_center: [101.243746, 25.109256],
  map_projection: 'EPSG:4326',
  // map_type: 'amap',
  // map_Url:
  //   'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',

  // map_center: [101.243746, 25.109256],
  // map_projection: 'EPSG:4326',
  map_minZoom: 1,
  map_maxZoom: 20,
  map_zoom: 5,
};

const mapBase = new MapBase(configData);
// const mapBase2 = new MapBase(configData2);
const wfsHandle = new WfsHandle(mapBase);
const mapInteractive = new MapInteractive(mapBase);
// const layer = mapBase2.getMapSource();
mapBase.makeMap(document.getElementById('map'));

// mapBase.map.addLayer(layer[0]);
// mapBase.map.getLayers().clear();
//mapBase.map.removeLayer(layer[0]);  

const typeColors = {
  Point: { fill: { color: 'red' }, stroke: { color: 'green' }, font: 'Bold 20px / 2 Arial' },
  LineString: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
  MultiLineString: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
  MultiPoint: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
  MultiPolygon: { fill: { color: 'rgb(123,123,123,0.1)' }, stroke: { color: 'green' } },
  Polygon: { fill: { color: 'rgb(123,123,123,0.1)' }, stroke: { color: 'green' } },
  GeometryCollection: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
  Circle: { fill: { color: 'yellow' }, stroke: { color: 'green' } },
};

var mapList = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.84095524604496,
          31.130574799929196
        ]
      },
      "properties": {
        "COUNT": 847
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.83303621973691,
          31.178804490657896
        ]
      },
      "properties": {
        "COUNT": 76
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.8390314763407,
          31.401525460599366
        ]
      },
      "properties": {
        "COUNT": 317
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.83992305934963,
          31.509300807967488
        ]
      },
      "properties": {
        "COUNT": 123
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.85079728571428,
          31.21186757142857
        ]
      },
      "properties": {
        "COUNT": 7
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.85972266369414,
          31.336269687070054
        ]
      },
      "properties": {
        "COUNT": 628
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.85397900401655,
          31.3782743328117
        ]
      },
      "properties": {
        "COUNT": 1195
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.84393643734042,
          31.447525053005453
        ]
      },
      "properties": {
        "COUNT": 549
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.85964349607379,
          31.132713503510367
        ]
      },
      "properties": {
        "COUNT": 433
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.8748857735294,
          31.17615108705883
        ]
      },
      "properties": {
        "COUNT": 34
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.861336,
          31.261623
        ]
      },
      "properties": {
        "COUNT": 4
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.85944270757581,
          31.456491645606064
        ]
      },
      "properties": {
        "COUNT": 132
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.87119671000002,
          31.4984532
        ]
      },
      "properties": {
        "COUNT": 10
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.88517902562944,
          31.27760178377577
        ]
      },
      "properties": {
        "COUNT": 437
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.87768685701757,
          31.335607307807027
        ]
      },
      "properties": {
        "COUNT": 114
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.88758137362602,
          31.39493714660854
        ]
      },
      "properties": {
        "COUNT": 2984
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.87864438528642,
          31.445421770290583
        ]
      },
      "properties": {
        "COUNT": 1101
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.90344460316857,
          31.17874121038215
        ]
      },
      "properties": {
        "COUNT": 1073
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.90337268181817,
          31.209800175454543
        ]
      },
      "properties": {
        "COUNT": 11
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.89623406842108,
          31.304076613684202
        ]
      },
      "properties": {
        "COUNT": 19
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.90052742894315,
          31.355237565133375
        ]
      },
      "properties": {
        "COUNT": 4958
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.9065815038055,
          31.4207746535518
        ]
      },
      "properties": {
        "COUNT": 1419
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.90444498799997,
          31.50115595953331
        ]
      },
      "properties": {
        "COUNT": 300
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.91541676024484,
          31.16512887697247
        ]
      },
      "properties": {
        "COUNT": 327
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.92165498474576,
          31.230005009661014
        ]
      },
      "properties": {
        "COUNT": 59
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.92702500186671,
          31.28854693113592
        ]
      },
      "properties": {
        "COUNT": 1875
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.92316743668633,
          31.340563135266283
        ]
      },
      "properties": {
        "COUNT": 169
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.92450731311119,
          31.388637303428194
        ]
      },
      "properties": {
        "COUNT": 1861
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.92294188870285,
          31.43140552635981
        ]
      },
      "properties": {
        "COUNT": 239
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.92519899000001,
          31.507981884888878
        ]
      },
      "properties": {
        "COUNT": 90
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.93792986410251,
          31.17977522666667
        ]
      },
      "properties": {
        "COUNT": 39
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.9477026080152,
          31.236736951335907
        ]
      },
      "properties": {
        "COUNT": 262
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.94283604939162,
          31.29759579160183
        ]
      },
      "properties": {
        "COUNT": 2547
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.95203039573866,
          31.370127437627357
        ]
      },
      "properties": {
        "COUNT": 5867
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.94952376412297,
          31.416959774614064
        ]
      },
      "properties": {
        "COUNT": 3381
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.94941379496753,
          31.46819666209412
        ]
      },
      "properties": {
        "COUNT": 616
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.94314254271708,
          31.509675551249952
        ]
      },
      "properties": {
        "COUNT": 920
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.96153773063189,
          31.175231147608667
        ]
      },
      "properties": {
        "COUNT": 506
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.95709415964905,
          31.28512773473685
        ]
      },
      "properties": {
        "COUNT": 228
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.98970352063462,
          31.18768201571428
        ]
      },
      "properties": {
        "COUNT": 189
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.97234528021984,
          31.307896627582416
        ]
      },
      "properties": {
        "COUNT": 91
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.97199717614332,
          31.369576748562057
        ]
      },
      "properties": {
        "COUNT": 2427
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.98148726123205,
          31.403474127281374
        ]
      },
      "properties": {
        "COUNT": 2711
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.9779296879147,
          31.456037005814764
        ]
      },
      "properties": {
        "COUNT": 2019
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.97689345833338,
          31.48899962500001
        ]
      },
      "properties": {
        "COUNT": 48
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.00142024554296,
          31.17324475232557
        ]
      },
      "properties": {
        "COUNT": 516
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.00311382972758,
          31.260280054242173
        ]
      },
      "properties": {
        "COUNT": 2718
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.99783296612627,
          31.33620614220416
        ]
      },
      "properties": {
        "COUNT": 1234
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.99937694711859,
          31.384021144183087
        ]
      },
      "properties": {
        "COUNT": 1475
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          120.99297757243242,
          31.442361008162173
        ]
      },
      "properties": {
        "COUNT": 185
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.00608980989011,
          31.218059128681325
        ]
      },
      "properties": {
        "COUNT": 91
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.00694551162785,
          31.44508783860466
        ]
      },
      "properties": {
        "COUNT": 86
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.00701133333332,
          31.491535690000003
        ]
      },
      "properties": {
        "COUNT": 3
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.0186411908672,
          31.148338799794505
        ]
      },
      "properties": {
        "COUNT": 438
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.0239540093383,
          31.182481306381305
        ]
      },
      "properties": {
        "COUNT": 1285
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.02007327740903,
          31.251687341777288
        ]
      },
      "properties": {
        "COUNT": 934
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.02025900000001,
          31.27417448419355
        ]
      },
      "properties": {
        "COUNT": 62
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.02821283733827,
          31.318209852840432
        ]
      },
      "properties": {
        "COUNT": 1623
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.0315524181532,
          31.389324573097902
        ]
      },
      "properties": {
        "COUNT": 3173
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.03006076774193,
          31.427888632580636
        ]
      },
      "properties": {
        "COUNT": 31
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.05138352499998,
          31.18192845141024
        ]
      },
      "properties": {
        "COUNT": 156
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.04318328756838,
          31.25594534505467
        ]
      },
      "properties": {
        "COUNT": 1464
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.0520442460041,
          31.36230241605767
        ]
      },
      "properties": {
        "COUNT": 1489
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.05313109523811,
          31.217391226190472
        ]
      },
      "properties": {
        "COUNT": 84
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.06715956364687,
          31.294395138513853
        ]
      },
      "properties": {
        "COUNT": 1810
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.05324477280224,
          31.406777968543974
        ]
      },
      "properties": {
        "COUNT": 364
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.06573745454547,
          31.18094481818182
        ]
      },
      "properties": {
        "COUNT": 11
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.07880528887496,
          31.37106863845129
        ]
      },
      "properties": {
        "COUNT": 1582
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.0733451550848,
          31.408948666737306
        ]
      },
      "properties": {
        "COUNT": 236
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.09749429485373,
          31.29452284357898
        ]
      },
      "properties": {
        "COUNT": 1710
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.09920311555548,
          31.36471209088888
        ]
      },
      "properties": {
        "COUNT": 90
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.12627028698867,
          31.29069204233136
        ]
      },
      "properties": {
        "COUNT": 1883
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.11845290000001,
          31.339831599999997
        ]
      },
      "properties": {
        "COUNT": 10
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          121.13656244449676,
          31.301490692704395
        ]
      },
      "properties": {
        "COUNT": 636
      }
    }
  ]
}

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

Base.event.on('check', () => { alert(3); });

// mapInteractive.setMapLabel({ title: '111122222', lonLat: [120.419354, 36.122387] }, () => {
//   console.log(111111);
//   alert(1);
// });
mapInteractive.drawStar([{ count: 25, lonLat: [120.419354, 36.122387] }, { count: 25, lonLat: [101.243746, 25.109256] }], '123,123,123');
wfsHandle.addGeoJson(mapList, typeColors, { name: 'COUNT', pointType: 'normal' });

wfsHandle.addHeatmapGeoJson(hotmapdata, typeColors, { name: 'COUNT', color: 'COLOR', });
// 气泡支持
const a = {};
mapInteractive.on('changeName', () => { alert(2); });
// eslint-disable-next-line max-len
//mapInteractive.addMapJSXPopup(<div onClick={() => { alert(1111); mapInteractive.emit('changeName'); MapInteractive.event.emit('check'); }}>aaaccccaaa</div>, [101.243746, 25.109256], (changeStatus) => { a.changeStatus = changeStatus; });
// a.changeStatus(true);

// 工具栏
mapBase.addZoom();
mapBase.addZoomslider();

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
