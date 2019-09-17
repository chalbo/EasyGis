import React from 'react';
import PropTypes from 'prop-types';
import classHelper from '../base/ClassHelper';
import FieldBase from '../base/FieldBase';

class SwitchButton extends FieldBase{
    constructor(props){
        super(props);
        Object.assign(this.state, {
            value: props.value
        })
    }
    componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps);
        if (nextProps.value !== this.props.value){
            this.setValue(nextProps.value)
        }
    }
    setValue(value){
        if (value !== this.state.value){
            this.setState({value:value}, ()=>{
                this.props.onChange(value);
                if (this.context && this.context.fieldChange){
                    this.context.fieldChange(this,value);
                }
            })
        }
    }
    handleClick(event){
        const {readonly,disabled} = this.props;
        event.stopPropagation();
        if (disabled || readonly){
            return;
        }
        this.setValue(!this.state.value);
    }
    buttonClasses(){
        const {readonly,disabled} = this.props;
        return classHelper.classNames(['switchbutton f-inline-row', this.props.className, {
            'switchbutton-readonly':readonly,
            'switchbutton-disabled':disabled,
            'switchbutton-checked':this.state.value
        }]);
    }
    render(){
        const {onText,offText,handleText,inputId} = this.props;
        return (
            <span className={this.buttonClasses()} style={this.props.style} onClick={this.handleClick.bind(this)}>
                <span className="switchbutton-inner">
                    <span className="switchbutton-on">
                        <span className="f-row f-content-center">{onText}</span>
                    </span>
                    <span className="switchbutton-handle">
                        <span className="f-row f-content-center">{handleText}</span>
                    </span>
                    <span className="switchbutton-off">
                        <span className="f-row f-content-center">{offText}</span>
                    </span>
                    <input className="switchbutton-value" type="checkbox" id={inputId}/>
                </span>
            </span>
        )
    }
}
SwitchButton.propTypes = Object.assign({}, FieldBase.propTypes, {
    value: PropTypes.bool,
    onText: PropTypes.string,
    offText: PropTypes.string,
    handleText: PropTypes.string,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    inputId: PropTypes.string
})
SwitchButton.defaultProps = Object.assign({}, FieldBase.defaultProps, {
    onText: 'ON',
    offText: 'OFF',
    disabled: false,
    readonly: false,
    onChange(value){}
})
export default SwitchButton


// WEBPACK FOOTER //
// ./src/components/switchbutton/SwitchButton.js