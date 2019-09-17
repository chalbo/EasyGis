import React from 'react';
import PropTypes from 'prop-types';
import Validation from './Validation';
import ValidationContext from './ValidationContext';

class Form extends Validation{
    getChildContext(){
        return Object.assign({}, super.getChildContext(), {
            labelPosition: this.props.labelPosition,
            labelAlign: this.props.labelAlign,
            labelWidth: this.props.labelWidth,
            floatingLabel: this.props.floatingLabel
        })
    }
    handleSubmit(event){
        this.props.onSubmit(event);
    }
    render(){
        return (
            <ValidationContext.Provider 
                value={{
                    validateTime: this.state.validateTime,
                    errorType: this.props.errorType,
                    tooltipPosition: this.props.tooltipPosition,
                    isFocused: (name)=>this.isFocused(name),
                    getError: (name)=>this.getError(name),
                    getValue: (name)=>this.getFieldValue(name)
                }}
            >
                <form className={this.props.className} style={this.props.style} onSubmit={this.handleSubmit.bind(this)}>
                    {this.props.children}
                </form>
            </ValidationContext.Provider>
        )
    }
}
Form.propTypes = Object.assign({}, Validation.propTypes, {
    labelPosition: PropTypes.string,
    labelAlign: PropTypes.string,
    labelWidth: PropTypes.number,
    floatingLabel: PropTypes.bool,
    errorType: PropTypes.oneOf(['label','tooltip']),
    tooltipPosition: PropTypes.string
})
Form.childContextTypes = Object.assign({}, Validation.childContextTypes, {
    labelPosition: PropTypes.string,
    labelAlign: PropTypes.string,
    labelWidth: PropTypes.number,
    floatingLabel: PropTypes.bool
})
Form.defaultProps = Object.assign({}, Validation.defaultProps, {
    labelPosition: 'before',
    labelAlign: 'left',
    labelWidth: 80,
    floatingLabel: false,
    errorType: 'label',
    tooltipPosition: 'right',
    onSubmit(event){}
})
export default Form;


// WEBPACK FOOTER //
// ./src/components/form/Form.js