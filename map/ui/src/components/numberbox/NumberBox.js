import React from 'react';
import PropTypes from 'prop-types';
import SpinnerBase from '../base/SpinnerBase';

class NumberBox extends SpinnerBase{
    componentDidMount(){
        super.componentDidMount();
        let value = this.parser.call(this, this.state.value);
        this.setState({value:value,text:this.formatter(value)})
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.prefix !== this.props.prefix ||
            nextProps.suffix !== this.props.suffix ||
            nextProps.decimalSeparator !== this.props.decimalSeparator ||
            nextProps.groupSeparator !== this.props.groupSeparator) {
            this.setState({}, ()=>{
                let value = this.parser.call(this, this.state.value);
                this.setState({value:value,text:this.formatter(value)})
            })
        }
    }
    setValue(value){
        value = this.parser(value);
        super.setValue(value);
        this.setState({text:this.formatter(value)})
    }
    doSpinUp() {
        let v = (this.state.value || 0) + this.props.increment;
        this.setValue(this.parser(String(v)));
    }
    doSpinDown() {
        let v = (this.state.value || 0) - this.props.increment;
        this.setValue(this.parser(String(v)));
    }
    blur(){
        super.blur();
        this.setState({}, ()=>{
            let value = this.parser(this.state.text);
            this.setValue(value);
        })
    }
    filter(e){
        const {decimalSeparator,groupSeparator} = this.props;
        var s = this.state.text;
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
        if (c === '-' || c === decimalSeparator){
            return (s.indexOf(c) === -1) ? true : false;
        } else if (c === groupSeparator){
            return true;
        } else if ('0123456789'.indexOf(c) >= 0){
            return true;
        } else {
            return false;
        }
    }
    formatter(value){
        const {precision,groupSeparator,decimalSeparator,prefix,suffix} = this.props;
        if (value == null){
            return null;
        }
        value = parseFloat(value+'');
        let s = value.toFixed(precision);
        let s1 = s;
        let s2 = '';
        let dpos = s.indexOf('.');
        if (dpos >= 0){
            s1 = s.substring(0, dpos);
            s2 = s.substring(dpos+1, s.length);
        }
        if (groupSeparator){
            let p = /(\d+)(\d{3})/;
            while (p.test(s1)){
                s1 = s1.replace(p, '$1' + groupSeparator + '$2');
            }
        }
        if (s2){
            return prefix + s1 + decimalSeparator + s2 + suffix;
        } else {
            return prefix + s1 + suffix;
        }
    }
    parser(s){
        const {precision,groupSeparator,decimalSeparator,prefix,suffix,min,max} = this.props;
        if (s == null){
            return null;
        }
        s = (s+'').trim();
        if (prefix) {
            s = s.replace(new RegExp('\\'+prefix,'g'), '');
        }
        if (suffix) {
            s = s.replace(new RegExp('\\'+suffix,'g'), '');
        }
        if (groupSeparator){
            s = s.replace(new RegExp('\\'+groupSeparator,'g'), '');
        }
        if (decimalSeparator){
            s = s.replace(new RegExp('\\'+decimalSeparator,'g'), '.')
        }
        s = s.replace(/\s/g,'');
        let v = parseFloat(s);
        if (isNaN(v)){
            return null;
        } else {
            v = parseFloat(v.toFixed(precision));
            if (min != null && min > v){
                v = min;
            }
            if (max != null && max < v){
                v = max;
            }
            return v;
        }
    }
    handleInputChange(event){
        let text = event.target.value
        this.setState({text:text});
    }
    handleKeyPress(event){
        if (this.state.focused){
            if (!this.filter(event)){
                event.preventDefault();
				event.stopPropagation();
            }
        }
    }
    renderInput(){
        return React.cloneElement(super.renderInput(), {
            onKeyPress: this.handleKeyPress.bind(this)
        })
    }

}
NumberBox.propTypes = Object.assign({}, SpinnerBase.propTypes, {
    value: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    increment: PropTypes.number,
    precision: PropTypes.number,
    decimalSeparator: PropTypes.string,
    groupSeparator: PropTypes.string,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
})
NumberBox.defaultProps = Object.assign({}, SpinnerBase.defaultProps, {
    increment: 1,
    precision: 0,
    decimalSeparator: '.',
    groupSeparator: '',
    prefix: '',
    suffix: ''
})
export default NumberBox


// WEBPACK FOOTER //
// ./src/components/numberbox/NumberBox.js