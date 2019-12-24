import { Table, Button } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';

const ol = require('openlayers/dist/ol');
// 相关图形
const typeContant = {
  NONE: 'None', SQUARE: 'Square', SQUARE2: 'Box', CIRCLE: 'Circle',
};
// 内容页外框模版
class MouseDraw extends React.Component {
  state = {
    store: this.props.store,
    draw: null,
    drawClick: null,
    coordinates: [],
  }

  // 切换鼠标类型
  selectMouseType(e) {
    const type = e.target.getAttribute('data-type');
    this.addInteraction(type);
  }

  setMouseNoneType() {
    this.addInteraction(typeContant.NONE);
  }

  addEventInteraction(type) {
    const drawClick = new ol.interaction.Select({
      condition: ol.events.condition.click,
    });
    drawClick.removeEventListener('select');
    drawClick.on('select', (e) => {
      const gis = e.mapBrowserEvent.coordinate;
      const type = type;
    });
    this.setState({ drawClick });
    this.state.store.emit('addInteraction', drawClick);
  }

  createBox = function () {
    return (
      function (coordinates, opt_geometry) {
        const extent = ol.extent.boundingExtent(coordinates);
        const geometry = opt_geometry || new ol.geom.Polygon(null);
        this.setState({ coordinates });
        geometry.setCoordinates([[
          ol.extent.getBottomLeft(extent),
          ol.extent.getBottomRight(extent),
          ol.extent.getTopRight(extent),
          ol.extent.getTopLeft(extent),
          ol.extent.getBottomLeft(extent),
        ]]);
        return geometry;
      }.bind(this)
    );
  };

  // 添加矩形
  addInteraction(value) {
    let draw;
    if (value !== typeContant.NONE) {
      this.state.store.emit('removeInteraction', this.state.draw);
      let geometryFunction;
      // if (value === typeContant.SQUARE) {
      //     value = typeContant.CIRCLE;
      //     geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
      // } else
      if (value === typeContant.SQUARE2) {
        value = typeContant.CIRCLE;
        geometryFunction = this.createBox();
      }
      // else if (value === typeContant.CIRCLE) {
      //     value = typeContant.CIRCLE;
      // }
      const source = new ol.source.Vector({ wrapX: false });
      draw = new ol.interaction.Draw({
        source,
        type: value,
        geometryFunction,
      });
      draw.removeEventListener('drawend');
      draw.on('drawend', (e) => {
        this.state.store.emit('coordinates', this.state.coordinates);
        this.setMouseNoneType();
      });

      this.setState({ draw });
      this.state.store.emit('addInteraction', draw);
    } else {
      this.state.store.emit('removeInteraction', this.state.draw);
      // this.state.store.emit("removeInteraction",this.state.drawClick);
    }
  }

  render() {
    return (
      <div className="map toolset">
        <i className="tool fa fa-mouse-pointer fa-x" data-type={typeContant.NONE} onClick={this.selectMouseType.bind(this)}>无</i>
        <i className="tool fa fa-arrows fa-x" data-type={typeContant.SQUARE} onClick={this.selectMouseType.bind(this)}>棱形</i>
        <i className="tool fa fa-square-o fa-x" data-type={typeContant.SQUARE2} onClick={this.selectMouseType.bind(this)}>矩形</i>
        <i className="tool fa fa-circle-o fa-x" data-type={typeContant.CIRCLE} onClick={this.selectMouseType.bind(this)}>圆形</i>
      </div>

    );
  }
}
module.exports = MouseDraw;
