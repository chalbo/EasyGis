// // 四分法递归
// /*
//  * left:原点左方极限X坐标 left<x 87.XXXX lontitude
//  * right:原点右方极限X坐标 right>x
//  * top:原点上方极限Y坐标  top <y 43.XXX latitude
//  * bottom:原点下方极限Y坐标 bottom>y
//  * oriPoint:区域中心点
//  * pointArr:坐标点集合
//  * level:坐标数据层级（当前缩放比例）
//  * id:象限id
//  *
//  *         |
//  *    2    |   第一象限
//  * -----（x,y）------
//  *    3    |   4
//  *         |
//  */
const mapSource = require('../common/mapSource');

class QTreeMap {
  qtree(left, bottom, right, top, oriPoint, pointArr, zoom, maxZoom, id, count, centerPoint) {
    const s = {
      child: {
        arr1: [],
        arr2: [],
        arr3: [],
        arr4: [],
        level: zoom || 0,
      },
      level: zoom || 0,
      id: id || 0,
      count,
      oriPoint,
      centerPoint,
    };
    // 中心点和层级
    const x = oriPoint[0];// 原点x坐标
    const y = oriPoint[1];// 原点y坐标


    if (pointArr.length > 4 && zoom <= maxZoom) {
      var subLevel = s.level + 1;
      s.child.level = subLevel;
      // 将点划分象限

      for (let i = 0; i < pointArr.length; i++) {
        if (pointArr[i].lon >= x && pointArr[i].lon <= right) { // 判断是否在y轴右侧
          if (pointArr[i].lat >= y && pointArr[i].lat <= top) { // 判断是否为第一象限
            s.child.arr1.push(pointArr[i]);
          } else { // 判断是否为第四象限
            s.child.arr4.push(pointArr[i]);
          }
        } else { // y轴左侧
          if (pointArr[i].lat >= y && pointArr[i].lat <= top) { // 判断是否为第二象限
            s.child.arr2.push(pointArr[i]);
          } else { // 判断是否为第三象限
            s.child.arr3.push(pointArr[i]);
          }
        }
      }
    }
    // 判断各象限坐标数是否大于100，如果大于100的话，继续划分
    if (s.child.arr1.length > 4) {
      // 第一象限继续划分
      // 1)获取中心点（原点）坐标
      var oriPointX = (right + x) / 2;
      var oriPointY = (top + y) / 2;
      var oriP = [oriPointX, oriPointY];
      // 2）设置坐标点所属层级
      var identify = `${s.id}-1`;
      // 3）递归

      var l = x;
      var r = right;
      var t = top;
      var b = y;
      const centerPoint = this.searchCenterPointInArray(s.child.arr1);
      s.child.arr1 = this.qtree(l, b, r, t, oriP, s.child.arr1, subLevel, maxZoom, identify, s.child.arr1.length, centerPoint);
    }
    if (s.child.arr2.length > 4) {
      // 第二象限继续划分

      // 1)获取中心点（原点）坐标
      var oriPointX = (left + x) / 2;
      var oriPointY = (top + y) / 2;
      var oriP = [oriPointX, oriPointY];
      // 2）设置坐标点所属层级
      var identify = `${s.id}-2`;
      // 3）递归
      var l = left;
      var r = x;
      var t = top;
      var b = y;
      const centerPoint = this.searchCenterPointInArray(s.child.arr2);
      s.child.arr2 = this.qtree(l, b, r, t, oriP, s.child.arr2, subLevel, maxZoom, identify, s.child.arr2.length, centerPoint);
    }
    if (s.child.arr3.length > 4) {
      // 第三象限继续划分

      // 1)获取中心点（原点）坐标
      var oriPointX = (left + x) / 2;
      var oriPointY = (bottom + y) / 2;
      var oriP = [oriPointX, oriPointY];
      // 2）设置坐标点所属层级
      var identify = `${s.id}-3`;
      // 3）递归
      var l = left;
      var r = x;
      var t = y;
      var b = bottom;
      const centerPoint = this.searchCenterPointInArray(s.child.arr3);
      s.child.arr3 = this.qtree(l, b, r, t, oriP, s.child.arr3, subLevel, maxZoom, identify, s.child.arr3.length, centerPoint);
    }
    if (s.child.arr4.length > 4) {
      // 第四象限继续划分

      var oriPointX = (right + x) / 2;
      var oriPointY = (bottom + y) / 2;
      var oriP = [oriPointX, oriPointY];
      // 2）设置坐标点所属层级
      var identify = `${s.id}-4`;
      // 3）递归
      var l = x;
      var r = right;
      var t = y;
      var b = bottom;
      const centerPoint = this.searchCenterPointInArray(s.child.arr4);
      s.child.arr4 = this.qtree(l, b, r, t, oriP, s.child.arr4, subLevel, maxZoom, identify, s.child.arr4.length, centerPoint);
    }
    return s;
  }

  poiArr = [];

  searchPoints(points, zoom, finalPoints) {
    if (!finalPoints) {
      var finalPoints = new Object();
      finalPoints.clusterObj = new Array();
      finalPoints.noClusterObj = new Array();
    }
    for (const i in points) {
      if (points[i] != '' && points[i].level && points[i].child && points[i].child != '') {
        // 有层级和孩子，则判断该层级是不是和zoom缩放级别一致，不一致的话，继续遍历
        if (points[i].level == zoom && zoom != mapSource.getMaxZoom()) {
          finalPoints.clusterObj.push(points[i]);
        } else if (points[i].child && points[i] != '') {
          this.searchPoints(points[i].child, zoom, finalPoints);
        } else if (i != 'level' && points[i] != '') {
          finalPoints.noClusterObj.push(points[i]);
        }
      } else {
        // 无级别的，未被聚散的点
        if (i != 'level' && points[i] != '') {
          finalPoints.noClusterObj.push(points[i]);
        }
      }
    }
    return finalPoints;
  }

  searchCenterPointInArray(arr) {
    const point = [];
    if (arr.length > 0) {
      let lat = 0;
      let lon = 0;
      let count = 0;
      for (const i in arr) {
        if (arr[i].lat && arr[i].lon) {
          lat += arr[i].lat;
          lon += arr[i].lon;
          count += 1;
        }
      }
      if (count == 0) { count = 1; }
      point.push(lon / count);
      point.push(lat / count);
    }
    return point;
  }
}

module.exports = QTreeMap;
