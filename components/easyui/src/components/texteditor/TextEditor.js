import React from 'react';
import PropTypes from 'prop-types';
import classHelper from '../base/ClassHelper';
import FieldBase from '../base/FieldBase';

class TextEditor extends FieldBase{
    constructor(props){
        super(props);
        Object.assign(this.state, {
            value: props.value,
            focused: false
        })
    }
    componentDidMount(){
        super.componentDidMount()
        this.inputRef.innerHTML = this.state.value;
    }
    isDiff(value1, value2){
        return value1 !== value2;
    }
    setValue(value){
        if (this.isDiff(value, this.state.value)){
            this.setState({value:value}, ()=>{
                this.props.onChange(value);
                if (this.context && this.context.fieldChange){
                    this.context.fieldChange(this,value);
                }
            });
        }
    }
    handleInputFocus(event){
        this.setState({focused:true}, ()=>{
            this.props.onFocus();
            if (this.context && this.context.fieldFocus){
                this.context.fieldFocus(this);
            }
        });
    }
    handleInputBlur(event){
        this.setValue(event.target.innerHTML);
        this.setState({focused:false}, ()=>{
            this.props.onBlur();
            if (this.context && this.context.fieldBlur){
                this.context.fieldBlur(this)
            }
        });
    }
    baseClasses() {
        return classHelper.classNames(['f-field','textbox texteditor f-inline-row', this.props.className, {
            'textbox-disabled':this.props.disabled,
            'textbox-readonly':this.props.readOnly,
            'textbox-focused':this.state.focused,
            'textbox-invalid':this.state.invalid
        }]);
    }
    render(){
        return (
            <div className={this.baseClasses()} style={this.props.style}>
                <div 
                    ref={ref=>this.inputRef=ref}
                    className="f-full" 
                    style={{outline:'none'}}
                    contentEditable="true" 
                    onFocus={this.handleInputFocus.bind(this)}
                    onBlur={this.handleInputBlur.bind(this)}
                >
                </div>
            </div>
        )
    }
}
TextEditor.propTypes = Object.assign({}, FieldBase.propTypes, {
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func
})
TextEditor.defaultProps = {
    onFocus(){},
    onBlur(){},
    onChange(value){}
}
export default TextEditor


// WEBPACK FOOTER //
// ./src/components/texteditor/TextEditor.js