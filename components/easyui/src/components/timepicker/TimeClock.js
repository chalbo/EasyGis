import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import { domHelper, classHelper } from '../base';

class TimeClock extends LocaleBase {
    constructor(props) {
        super(props);
        this.state = {
            data: this.getData(props.type),
            value: props.value,
            radius: 0,
            width: 0,
            height: 0
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ value: nextProps.value })
        }
        if (nextProps.type !== this.props.type) {
            this.setState({ data: this.getData(nextProps.type) })
        }
    }
    componentDidMount() {
        setTimeout(() => {
            const width = domHelper.outerWidth(this.el);
            const height = domHelper.outerHeight(this.el);
            const size = Math.min(width, height) - 20;
            this.setState({
                radius: size / 2,
                width: size,
                height: size
            })
        })
    }
    getData(type = 'hour') {
        let data = [];
        if (type === 'hour') {
            for (let i = 0; i < 12; i++) {
                data.push(String(i))
            }
            data[0] = '12'
        } else {
            for (let i = 0; i < 60; i += 5) {
                data.push(i < 10 ? '0' + i : String(i))
            }
            data[0] = '00'
        }
        return data;
    }
    handleItemClick(value) {
        value = parseInt(value, 10);
        this.setState({ value: value }, () => {
            this.props.onSelect(value)
        })
    }
    itemClasses(value) {
        return classHelper.classNames('item f-column f-content-center', {
            'item-selected': parseInt(value, 10) === parseInt(this.state.value, 10)
        })
    }
    itemStyle(value) {
        const { type } = this.props;
        const { radius } = this.state;
        const angular = parseInt(value, 10) / (type === 'hour' ? 12 : 60) * 360 * Math.PI / 180;
        const x = (radius - 20) * Math.sin(angular);
        const y = -(radius - 20) * Math.cos(angular);
        return {
            transform: `translate(${x}px,${y}px)`
        }
    }
    renderItems() {
        const { type } = this.props;
        const { value, data } = this.state;
        const angular = parseInt(value, 10) / (type === 'hour' ? 12 : 60) * 360;
        const handStyle = {
            transform: `rotate(${angular}deg)`
        }
        const style = {
            width: this.state.width,
            height: this.state.height,
            marginLeft: -this.state.width / 2,
            marginTop: -this.state.height / 2
        }

        return (
            <div className="clock" style={style}>
                <div className="center"></div>
                <div className="hand" style={handStyle}>
                    <div className="drag"></div>
                </div>
                {
                    data.map((value, index) => (
                        <div key={index}
                            className={this.itemClasses(value)}
                            style={this.itemStyle(value)}
                            onClick={this.handleItemClick.bind(this, value)}
                        >
                            {value}
                        </div>
                    ))
                }
            </div>
        )
    }
    render() {
        return (
            <div
                className="clock-wrap f-full f-column f-content-center"
                ref={el => this.el = el}
            >
                {
                    this.renderItems()
                }
            </div>
        )
    }
}
TimeClock.propTypes = Object.assign({}, LocaleBase.propTypes, {
    value: PropTypes.number,
    type: PropTypes.oneOf(['hour', 'minute'])
})
TimeClock.defaultProps = Object.assign({}, LocaleBase.defaultProps, {
    value: 0,
    type: 'hour',
    onSelect(value) { }
})
export default TimeClock


// WEBPACK FOOTER //
// ./src/components/timepicker/TimeClock.js