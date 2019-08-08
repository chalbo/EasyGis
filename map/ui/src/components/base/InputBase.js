import React from 'react';
import PropTypes from 'prop-types';
import classHelper from '../base/ClassHelper';
import FieldBase from './FieldBase';
import { LocaleBase } from '.';

class InputBase extends FieldBase{
    constructor(props){
        super(props);
        Object.assign(this.state, {
            value: props.value,
            text: props.value==null?'':String(props.value),
            focused: false
        });
    }
    componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps);
        if (nextProps.value !== this.props.value){
            this.setValue(nextProps.value);
        }
    }
    baseClasses() {
        return classHelper.classNames(['f-field','textbox f-inline-row', this.props.className, {
            'textbox-disabled':this.props.disabled,
            'textbox-readonly':this.props.readOnly,
            'textbox-focused':this.state.focused,
            'textbox-invalid':this.state.invalid
        }]);
    }
    inputClasses() {
        return classHelper.classNames(['textbox-text f-full f-order3', this.props.inputCls, {
            'validatebox-invalid':this.state.invalid
        }]);
    }
    addonClasses() {
        return classHelper.classNames(['textbox-addon textbox-addon-icon f-inline-row f-noshrink', {
            'f-order1':this.props.iconAlign==='left',
            'f-order5':this.props.iconAlign==='right'
        }]);
    }
    addonIconClasses() {
        return classHelper.classNames(['textbox-icon textbox-icon-disabled', this.props.iconCls]);
    }
    isDiff(value1, value2){
        return value1 !== value2;
    }
    setValue(value){
        if (this.isDiff(value, this.state.value)){
            this.setState({value:value,text:value==null?'':String(value)}, ()=>{
                this.props.onChange(value);
                if (this.context && this.context.fieldChange){
                    this.context.fieldChange(this,value);
                }
            });
        }
    }
    text(){
        return this.props.textFormatter(this.state.text);
    }
    focus(){
        if (this.inputRef){
            this.inputRef.focus();
            this.setState({focused:true}, ()=>{
                this.props.onFocus();
                if (this.context && this.context.fieldFocus){
                    this.context.fieldFocus(this);
                }
            });
        }
    }
    blur(){
        if (this.inputRef){
            this.inputRef.blur();
            this.setState({focused:false}, ()=>{
                this.props.onBlur();
                if (this.context && this.context.fieldBlur){
                    this.context.fieldBlur(this)
                }
            });
        }
    }
    getSelectionStart() {
        return this.getSelectionRange().start;
    }
    getSelectionRange() {
        let start = 0;
        let end = 0;
        let target = this.inputRef;
        if (typeof target.selectionStart === 'number'){
            start = target.selectionStart;
            end = target.selectionEnd;
        }
        return {start:start,end:end};
    }
    setSelectionRange(start, end) {
        let target = this.inputRef;
        if (target.setSelectionRange){
            target.setSelectionRange(start, end);
        } else if (target.createTextRange){
            var range = target.createTextRange();
            range.collapse();
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    }
    handleInputChange(event){
        this.setValue(event.target.value);
    }
    renderInput(){
        let pp = {
            autoComplete: 'off',
            className: this.inputClasses(),
            style: this.props.inputStyle,
            value: this.text(),
            id: this.props.inputId,
            disabled: this.props.disabled,
            readOnly: this.props.readOnly||!this.props.editable,
            tabIndex: this.props.tabIndex,
            placeholder: this.props.placeholder,
            onFocus: this.focus.bind(this),
            onBlur: this.blur.bind(this),
            onChange: this.handleInputChange.bind(this)
        }
        return (
            this.props.multiline===true
            ? <textarea ref={ref=>this.inputRef=ref} {...pp}></textarea>
            : <input ref={ref=>this.inputRef=ref} {...pp}></input>
        )
    }
    renderAddon(align){
        let name = align.substring(0,1).toUpperCase()+align.substring(1);
        let addon = this.props['addon'+name];
        if (!addon){
            return null;
        }
        let cls = classHelper.classNames(['textbox-addon f-inline-row f-noshrink', {
            'f-order2': align==='left',
            'f-order4': align==='right',
        }])
        return (
            <span className={cls}>{addon()}</span>
        )
    }
    renderOthers(){
        return null;
    }
    render(){
        return (
            <span className={this.baseClasses()} style={this.props.style} ref={el=>this.el=el}>
                {this.renderInput()}
                {this.renderAddon('left')}
                {this.renderAddon('right')}
                {
                    this.props.iconCls &&
                    <span className={this.addonClasses()}>
                        <span className={this.addonIconClasses()}></span>
                    </span>
                }
                {this.renderOthers()}
            </span>
        )
    }
}
InputBase.propTypes = Object.assign({}, LocaleBase.propTypes, {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    editable: PropTypes.bool,
    iconCls: PropTypes.string,
    iconAlign: PropTypes.oneOf(['left','right']),
    placeholder: PropTypes.string,
    multiline: PropTypes.bool,
    tabIndex: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
    inputCls: PropTypes.string,
    inputStyle: PropTypes.object,
    inputId: PropTypes.string,
    textFormatter: PropTypes.func,
    addonLeft: PropTypes.func,
    addonRight: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func
})
InputBase.defaultProps = Object.assign({}, FieldBase.defaultProps, {
    value: null,
    disabled: false,
    readOnly: false,
    editable: true,
    iconAlign: 'left',
    multiline: false,
    textFormatter: (value) => {
        return String(value||'');
    },
    onChange(value){},
    onFocus(){},
    onBlur(){}
})
export default InputBase;


// WEBPACK FOOTER //
// ./src/components/base/InputBase.js