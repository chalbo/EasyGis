import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import TimeClock from './TimeClock';

class TimePanel extends LocaleBase {
    constructor(props) {
        super(props);
        this.state = {
            selectingType: 'hour',
            selectingAmpm: props.ampm[0],
            hour: 0,
            minute: 0
        }
    }
    componentWillMount() {
        this.setValue(this.props.value)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setValue(nextProps.value);
        }
    }
    setValue(value) {
        if (value) {
            const parts = value.split(' ');
            const hm = parts[0].split(':');
            this.setState({
                hour: parseInt(hm[0], 10),
                minute: parseInt(hm[1], 10),
                selectingAmpm: parts[1]
            })
        }
    }
    getValue() {
        return this.getHourStr()+':'+this.getMinuteStr()+' '+this.state.selectingAmpm;
    }
    getHourStr(){
        const {hour} = this.state;
        return hour < 10 ? '0' + hour : hour
    }
    getMinuteStr(){
        const {minute} = this.state;
        return minute < 10 ? '0' + minute : minute
    }
    handleAmpmClick(ampm) {
        this.setState({ selectingAmpm: ampm }, () => {
            this.props.onChange(this.getValue())
        })
    }
    handleClockSelect(value) {
        const { selectingType } = this.state;
        if (selectingType === 'hour') {
            this.setState({
                hour: value,
                selectingType: 'minute'
            })
        } else {
            this.setState({
                minute: value
            })
        }
        this.setState({}, () => {
            this.props.onChange(this.getValue())
        })
    }
    renderHeader() {
        const { ampm } = this.props;
        const { selectingType, selectingAmpm } = this.state;
        const titleCls = (selected) => {
            return selected ? 'title title-selected' : 'title';
        }
        return (
            <div className="panel-header f-noshrink f-row f-content-center">
                <div className={titleCls(selectingType === 'hour')} onClick={() => this.setState({ selectingType: 'hour' })}>{this.getHourStr()}</div>
                <div className="sep">:</div>
                <div className={titleCls(selectingType === 'minute')} onClick={() => this.setState({ selectingType: 'minute' })}>{this.getMinuteStr()}</div>
                <div className="ampm f-column">
                    <div className={titleCls(selectingAmpm === ampm[0])} onClick={this.handleAmpmClick.bind(this, ampm[0])}>{ampm[0]}</div>
                    <div className={titleCls(selectingAmpm === ampm[1])} onClick={this.handleAmpmClick.bind(this, ampm[1])}>{ampm[1]}</div>
                </div>
            </div>
        )
    }
    renderClock() {
        const { selectingType, hour, minute } = this.state;
        const value = selectingType === 'hour' ? hour : minute;
        return (
            <TimeClock
                type={selectingType}
                value={value}
                onSelect={this.handleClockSelect.bind(this)}
            />
        )
    }
    render() {
        return (
            <div className="timepicker-panel f-column f-full">
                {this.renderHeader()}
                {this.renderClock()}
            </div>
        )
    }
}
TimePanel.propTypes = Object.assign({}, LocaleBase.propTypes, {
    value: PropTypes.string,
    ampm: PropTypes.array
})
TimePanel.defaultProps = Object.assign({}, LocaleBase.defaultProps, {
    ampm: ['AM', 'PM'],
    onChange(value) { }
})
export default TimePanel


// WEBPACK FOOTER //
// ./src/components/timepicker/TimePanel.js