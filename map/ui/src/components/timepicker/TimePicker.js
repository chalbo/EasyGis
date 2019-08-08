import React from 'react';
import PropTypes from 'prop-types';
import ComboBase from '../base/ComboBase';
import TimePanel from './TimePanel';

class TimePicker extends ComboBase{
    constructor(props){
        super(props);
        Object.assign(this.state, {
            selectingValue: null
        });
    }
    handleTimeChange(value){
        this.setState({selectingValue:value})
    }
    handleOkClick(event){
        event.preventDefault();
        this.setValue(this.state.selectingValue);
        this.closePanel();
    }
    handleCloseClick(event){
        event.preventDefault();
        this.closePanel();
    }
    renderPanel(){
        const {panelStyle} = this.props;
        const {panelClosed,panelLeft,panelTop} = this.state;
        if (panelClosed){
            return null;
        }
        const style = Object.assign({}, panelStyle, {
            left: panelLeft+'px',
            top: panelTop+'px'
        })
        const okText = this.t('DateBox.okText', this.props.defaultOkText);
        const closeText = this.t('DateBox.closeText', this.props.defaultCloseText);
        return (
            <div key="panel" className="panel-body panel-body-noheader combo-panel combo-p f-column" style={style} ref={el=>this.panelRef=el}>
                <TimePanel 
                    value={this.state.value} 
                    ampm={this.props.ampm}
                    onChange={this.handleTimeChange.bind(this)}
                />
                <div className="datebox-button f-row">
                    <a href=" " className="datebox-button-a f-full" onClick={this.handleOkClick.bind(this)}>{okText}</a>
                    <a href=" " className="datebox-button-a f-full" onClick={this.handleCloseClick.bind(this)}>{closeText}</a>
                </div>
            </div>
        )

    }
}
TimePicker.propTypes = Object.assign({}, ComboBase.propTypes, {
    value: PropTypes.string,
    ampm: PropTypes.array
})
TimePicker.defaultProps = Object.assign({}, ComboBase.defaultProps, {
    defaultCloseText: 'Close',
    defaultOkText: 'Ok',
    editable: false,
    ampm: ['am','pm']
})
export default TimePicker


// WEBPACK FOOTER //
// ./src/components/timepicker/TimePicker.js