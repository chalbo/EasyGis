 
import { TileGrid } from 'ol/tilegrid';
import { Image, Tile } from 'ol/layer'; 
import { TileImage, Vector, TileArcGISRest, ImageArcGISRest, XYZ, OSM, Vector as VectorSource } from 'ol/source';
import { transform  } from 'ol/proj'; // toLonLat
function getSourceType(config) {

  const mapSourceType={
    config: config,
    arcgis: {
      source: () => {
        const source = new TileArcGISRest({
          ratio: 1,
          params: {},
          url: config.map_Url
        });
        return [
          new Tile({
            source,
          })
        ];
        // , new ol.layer.Vector({ source: source })
      },
      setPosition: gis => gis,
      setRevertPosition: gis => gis,
    },
    arcgisImage: {
      source: () => {
        const source = new ImageArcGISRest({
          ratio: 1,
          params: {},
          url: config.map_Url // 'http://21.58.255.10/arcgis/rest/services/dzdt2015/MapServer'
        });
        return [
          new Image({
            source,
          })
        ];
        // , new ol.layer.Vector({ source: source })
      },
      setPosition: gis => gis,
      setRevertPosition: gis => gis,
    },
    amap: {
      source: () => {
        const amapsource = new XYZ({
          url: config.map_Url,
        });
  
        return [
          new Tile({
            extent: [-180, -90, 180, 90],
            source: amapsource,
          })
        ];
        // , new ol.layer.Vector({ source: source })
      },
      setPosition: gis => gis,
      setRevertPosition: gis => gis,
    },
    baidu: {
      source: () => {
        // 自定义分辨率和瓦片坐标系
        const resolutions = [];
        const { 'map-maxZoom': maxZoom } = config;
  
        // 计算百度使用的分辨率
        for (let i = 0; i <= maxZoom; i += 1) {
          resolutions[i] = 2 ** (maxZoom - i);
        }
        const tilegrid = new TileGrid({
          origin: [0, 0],
          resolutions, // 设置分辨�?
        });
  
        // 创建百度地图的数据源
        const baiduSource = new TileImage({
          projection: config.map_projection,
          tileGrid: tilegrid,
          tileUrlFunction: tileCoord => {
            const z = tileCoord[0];
            let x = tileCoord[1];
            let y = tileCoord[2];
  
            // 百度瓦片服务url将负数使用M前缀来标�?
            if (x < 0) {
              x = -x;
            }
            if (y < 0) {
              y = -y;
            }
            return `${config.map_Url}${z}/${x}/${y}.jpg`;
          },
        });
        const baiduMapLayer2 = new Tile({
          source: baiduSource,
        });
        return [baiduMapLayer2];
      },
      setPosition: gis => transform(gis, 'EPSG:4326', 'EPSG:3857'),
      setRevertPosition: gis => transform(gis, 'EPSG:3857', 'EPSG:4326'),
    },
    pgis: {
      source: () => {
        //  let source = new ol.source.TileImage({
        //   url: Single.get("config").map_Url,// 'http://21.58.255.10/arcgis/rest/services/dzdt2015/MapServer'
        // });
        const projectionExtent = [-180, -90, 180, 90];
        const tileOrigin = ol.extent.getTopLeft(projectionExtent);
        const resolutions = [];
        const { 'map-maxZoom': maxZoom } = config;
        const maxResolution = ol.extent.getWidth(projectionExtent) / (256 * 2);
        // 计算百度使用的分辨率
        for (let i = 0; i < maxZoom; i += 1) {
          resolutions[i] = maxResolution / 2 ** i;
        }
        const tilegrid = new TileGrid({
          origin: tileOrigin,
          resolutions, // 设置分
          tileSize: 256,
        });
        // 创建pgis地图的数据源
        const pgisSource = new TileImage({
          tileGrid: tilegrid,
          projection: ol.proj.get(config.map_projection),
          tileUrlFunction: tileCoord => {
            const z = tileCoord[0] + 1;
            let x = tileCoord[1];
            const y = -tileCoord[2] - 1;
            const n = 2 ** (z + 1);
            x %= n;
            if (x * n < 0) {
              x = +n;
            }
            return config.map_Url
              .replace('{z}', z.toString())
              .replace('{y}', y.toString())
              .replace('{x}', x.toString());
          },
        });
        return [
          new Tile({
            extent: [-180, -90, 180, 90],
            source: pgisSource,
          }),
        ];
        // , new ol.layer.Vector({ source: source })
      },
      setPosition: gis => gis,
      setRevertPosition: gis => gis,
    },
  };
  return mapSourceType;
}

export default  getSourceType