import React from 'react';
import PropTypes from 'prop-types';
import ComboBase from '../base/ComboBase';
import dateHelper from '../base/DateHelper';
import Calendar from '../calendar/Calendar';

class DateBox extends ComboBase{
    componentDidMount(){
        super.componentDidMount();
        const {value} = this.state;
        this.setState({
            text: value?this.defaultFormatter(value):''
        })
    }
    isDiff(date1, date2) {
        if (date1 != null && date2 == null){
            return true;
        }
        if (date1 == null && date2 != null){
            return true;
        }
        if (date1 != null && date2 != null){
            if (date1.getTime() !== date2.getTime()){
                return true;
            }
        }
        return false;
    }
    text(){
        const {text,focused} = this.state;
        if (!focused){
            return this.props.textFormatter(text);
        }
        return text;
    }
    setValue(value){
        if (value){
            value = this.defaultParser(this.defaultFormatter(value));
        }
        super.setValue(value);
        this.setState({
            text: value?this.defaultFormatter(value):''
        })
    }
    blur(){
        super.blur();
        this.setState({}, ()=>{
            this.fixValue();
        })
    }
    fixValue(){
        if (this.state.panelClosed){
            return;
        }
        let text = this.state.text.trim();
        if (!text){
            this.setValue(null);
            return;
        }
        const {value} = this.state;
        this.setState({
            text: value?this.defaultFormatter(value):''
        })

    }
    doFilter(value) {
        let date = this.defaultParser(value);
        if (!date){
            date = this.state.value;
        }
        this.calendar.moveTo(date);
        this.calendar.highlightDate(date);
    }
    defaultFormatter(date) {
        return dateHelper.formatDate(date, this.props.format);
    }
    defaultParser(value){
        return dateHelper.parseDate(value, this.props.format);
    }
    handleSelectionChange(date){
        this.setValue(date);
        this.setState({selection:date})
        this.closePanel();
    }
    handleKeyDown(event){
        const {panelClosed} = this.state;
        if (panelClosed && event.which === 40){
            this.openPanel();
            event.preventDefault();
            return;
        }
        if (panelClosed){
            return;
        }
        switch(event.which){
            case 40:	// down
                this.calendar.navDate(7);
                event.preventDefault();
                break;
            case 38:	// up
                this.calendar.navDate(-7);
                event.preventDefault();
                break;
            case 37:	// left
                this.calendar.navDate(-1);
                event.preventDefault();
                break;
            case 39:	// right
                this.calendar.navDate(1);
                event.preventDefault();
                break;
            case 13:	// enter
                this.calendar.selectDate();
                event.preventDefault();
                setTimeout(() => this.closePanel());
                break;
            default:
        }
    }
    handleTodayClick(event){
        event.preventDefault();
        this.setValue(new Date());
        this.closePanel();
    }
    handleCloseClick(event){
        event.preventDefault();
        this.closePanel();
    }
    renderInput(){
        return React.cloneElement(super.renderInput(), {
            onKeyDown: this.handleKeyDown.bind(this)
        })
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
        const currentText = this.t('DateBox.currentText', this.props.defaultCurrentText);
        const closeText = this.t('DateBox.closeText', this.props.defaultCloseText);
        return (
            <div key="panel" className="panel-body panel-body-noheader combo-panel combo-p f-column" style={style} ref={el=>this.panelRef=el}>
                <Calendar 
                    ref={ref=>this.calendar=ref}
                    className="f-full"
                    border={false}
                    showInfo={this.props.showInfo}
                    info={this.props.info}
                    selection={this.state.value}
                    onSelectionChange={this.handleSelectionChange.bind(this)}
                />
                <div className="datebox-button f-row">
                    <a href=" " className="datebox-button-a f-full" onClick={this.handleTodayClick.bind(this)}>{currentText}</a>
                    <a href=" " className="datebox-button-a f-full" onClick={this.handleCloseClick.bind(this)}>{closeText}</a>
                </div>
            </div>
        )
    }

}
DateBox.propTypes = Object.assign({}, ComboBase.propTypes, {
    value: PropTypes.object,
    format: PropTypes.string,
    currentText: PropTypes.string,
    closeText: PropTypes.string,
    okText: PropTypes.string,
    showInfo: PropTypes.bool,
    info: PropTypes.func
})
DateBox.defaultProps = Object.assign({}, ComboBase.defaultProps, {
    format: 'MM/dd/yyyy',
    defaultCurrentText: 'Today',
    defaultCloseText: 'Close',
    defaultOkText: 'Ok',
    showInfo: false,
    info: null
})
export default DateBox


// WEBPACK FOOTER //
// ./src/components/datebox/DateBox.js