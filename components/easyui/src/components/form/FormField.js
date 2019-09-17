import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import Label from '../base/Label';
import classHelper from '../base/ClassHelper';
import ValidationContext from './ValidationContext';
import { Tooltip } from '../tooltip';

class FormField extends LocaleBase{
    constructor(props){
        super(props);
        this.inputId = 'form-field-inputid-' + FormField.idIndex++;
    }
    renderInput(context, child){
        let inputProps = {
            name: this.props.name,
            className: 'f-full'
        };
        if (this.props.label){
            inputProps.inputId = this.inputId;
        }
        const input = React.cloneElement(child, inputProps);
        if (context.errorType === 'label'){
            return input;
        } else {
            const error = context.getError(this.props.name);
            return (
                <Tooltip content={error} position={context.tooltipPosition}>
                {input}
                </Tooltip>
            )
        }
    }
    renderLabel(position){
        if (!this.props.label){
            return null;
        }
        const labelPosition = this.props.labelPosition || this.context.labelPosition;
        if (labelPosition !== position){
            return null;
        }
        const labelAlign = this.props.labelAlign || this.context.labelAlign;
        const labelWidth = this.props.labelWidth || this.context.labelWidth;
        const labelCls = classHelper.classNames({
            'f-noshrink': true,
            'textbox-label-after': labelPosition==='after',
            'textbox-label-top': labelPosition==='top'
        })
        const labelStyle = {
            width: labelWidth
        }
        return (
            <Label htmlFor={this.inputId} align={labelAlign} className={labelCls} style={labelStyle}>{this.props.label}</Label>
        )
    }
    renderError(context){
        const error = context.getError(this.props.name);
        if (context.errorType !== 'label' || !error){
            return null;
        }
        const labelPosition = this.props.labelPosition || this.context.labelPosition;
        const labelWidth = this.props.labelWidth || this.context.labelWidth;
        let errorStyle = null;
        if (this.props.label && labelPosition === 'before'){
            errorStyle = {
                marginLeft: labelWidth
            }
        }
        return (
            <div className="form-field-error" style={errorStyle}>{error}</div>
        )
    }
    renderField(context){
        const labelPosition = this.props.labelPosition || this.context.labelPosition;
        const floatingLabel = this.context.floatingLabel;
        const error = context.getError(this.props.name);
        const value = context.getValue(this.props.name);
        const focused = context.isFocused(this.props.name);
        const cls = classHelper.classNames(this.props.className, 'form-field f-column', {
            'form-field-haserror': error && context.errorType==='label',
            'form-field-empty': value == null || String(value).trim().length === 0,
            'form-field-focused': focused,
            'form-floating-label': floatingLabel && labelPosition==='top'
        });
        const innerCls = classHelper.classNames('f-full', {
            'f-row f-vcenter': labelPosition !== 'top',
            'f-column': labelPosition === 'top'
        })
        return(
            <div className={cls} style={this.props.style}>
                <div className={innerCls}>
                    {this.renderLabel('top')}
                    {this.renderLabel('before')}
                    {
                        React.Children.map(this.props.children, child => (
                            this.renderInput(context, child)
                        ))
                    }
                    {this.renderLabel('after')}
                </div>
                {this.renderError(context)}
            </div>
        )
    }
    render(){
        return(
            <ValidationContext.Consumer>
            {
                context => this.renderField(context)
            }
            </ValidationContext.Consumer>
        )
    }
}
FormField.idIndex = 1;
FormField.propTypes = Object.assign({}, LocaleBase.propTypes, {
    name: PropTypes.string,
    label: PropTypes.string,
    labelPosition: PropTypes.string,
    labelAlign: PropTypes.string,
    labelWidth: PropTypes.number
})
FormField.contextTypes = Object.assign({}, LocaleBase.contextTypes, {
    labelPosition: PropTypes.string,
    labelAlign: PropTypes.string,
    labelWidth: PropTypes.number,
    floatingLabel: PropTypes.bool
})
export default FormField


// WEBPACK FOOTER //
// ./src/components/form/FormField.js