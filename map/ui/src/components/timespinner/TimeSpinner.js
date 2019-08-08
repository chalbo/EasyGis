import React from 'react';
import PropTypes from 'prop-types';
import SpinnerBase from '../base/SpinnerBase';
import dateHelper from '../base/DateHelper';

class TimeSpinner extends SpinnerBase{
    constructor(props){
        super(props);
        this.highlight = props.highlight;
        this.highlighting = false;
    }
    componentDidMount(){
        super.componentDidMount();
        let value = this.defaultFormatter(this.defaultParser(this.state.value));
        this.setState({value:value,text:value});
    }
    text(){
        if (this.state.focused && this.highlighting){
            setTimeout(() => {
                this.highlightRange(this.highlight);
                this.highlighting = false;
            })
        }
        return this.state.text;
    }
    setValue(value){
        value = this.defaultFormatter(this.defaultParser(value));
        super.setValue(value);
        this.setState({text:value==null?'':String(value)})
    }
    blur(){
        super.blur();
        this.setState({}, ()=>{
            this.setValue(this.state.text);
        })
    }
    doSpin(down) {
        const {ampm} = this.props;
        let range = this.props.selections[this.highlight];
        if (range){
            let s = this.state.text || '';
            if (s){
                let s1 = s.substring(0, range[0]);
                let s2 = s.substring(range[0], range[1]);
                let s3 = s.substring(range[1]);
                if (s2 === ampm[0]){
                    s2 = ampm[1];
                } else if (s2 === ampm[1]){
                    s2 = ampm[0];
                } else {
                    s2 = (parseInt(s2,10)||0) + this.props.increment*(down?-1:1);
                }
                let v = s1 + s2 + s3;
                this.setValue(v);
            } else {
                let v = this.defaultFormatter(new Date());
                this.setValue(v);
            }
            this.focus();
            this.highlighting = true;
        }
    }
    doSpinUp() {
        this.doSpin(false);
    }
    doSpinDown() {
        this.doSpin(true);
    }
    highlightRange(index) {
        this.highlight = index;
        let range = this.props.selections[this.highlight];
        if (range){
            this.setSelectionRange(range[0], range[1]);
            this.focus();
        }
    }
    defaultFormatter(date) {
        dateHelper.setAmPm(this.props.ampm);
        return dateHelper.formatDate(date, this.props.format);
    }
    defaultParser(value){
        let date = this.parseD(value);
        if (date){
            var min = this.parseD(this.props.min);
            var max = this.parseD(this.props.max);
            if (min && min > date){date = min;}
            if (max && max < date){date = max;}
        }
        return date;
    }
    parseD(value) {
        dateHelper.setAmPm(this.props.ampm);
        return dateHelper.parseDate(value, this.props.format);
    }
    handleInputChange(event){
        let text = event.target.value
        this.setState({text:text});
    }
    handleClick(){
        const {selections} = this.props;
        let start = this.getSelectionStart();
        for(let i=0; i<selections.length; i++){
            let range = selections[i];
            if (start >= range[0] && start <= range[1]){
                this.highlightRange(i);
                return;
            }
        }
    }
    handleKeyDown(event){
        if (event.keyCode === 13){
            event.stopPropagation();
            this.setValue(this.state.text);
            this.handleClick(event);
            this.highlighting = true;
        }
    }
    handleKeyPress(e){
        const handle = () => {
            if (!this.state.focused){
                return true;
            }
            if (e.metaKey || e.ctrlKey){
                return true;
            }
            if (['46','8','13','0'].indexOf(String(e.which)) !== -1){
                return true;
            }
            let c = String.fromCharCode(e.which);
            if (!c){
                return true;
            }
            if ('0123456789'.indexOf(c) >= 0){
                return true;
            } else {
                return false;
            }
        }
        if (!handle(e)){
            e.preventDefault();
			e.stopPropagation();
        }
    }
    renderInput(){
        return React.cloneElement(super.renderInput(), {
            onClick: this.handleClick.bind(this),
            onKeyDown: this.handleKeyDown.bind(this),
            onKeyPress: this.handleKeyPress.bind(this)
        })
    }

}
TimeSpinner.propTypes = Object.assign({}, SpinnerBase.propTypes, {
    value: PropTypes.string,
    min: PropTypes.string,
    max: PropTypes.string,
    increment: PropTypes.number,
    highlight: PropTypes.number,
    selections: PropTypes.array,
    format: PropTypes.string,
    ampm: PropTypes.array
})
TimeSpinner.defaultProps = Object.assign({}, SpinnerBase.defaultProps, {
    increment: 1,
    highlight: 0,
    selections: [[0,2],[3,5],[6,8],[9,11]],
    format: 'HH:mm',
    ampm: ['am','pm']
})
export default TimeSpinner


// WEBPACK FOOTER //
// ./src/components/timespinner/TimeSpinner.js