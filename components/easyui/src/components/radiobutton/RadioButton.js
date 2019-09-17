import React from 'react';
import PropTypes from 'prop-types';
import classHelper from '../base/ClassHelper';
import FieldBase from '../base/FieldBase';

class RadioButton extends FieldBase{
    constructor(props){
        super(props);
        Object.assign(this.state, {
            checked: false
        });
    }
    componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps);
        if (nextProps.groupValue !== this.props.groupValue){
            let checked = nextProps.groupValue===this.props.value;
            this.setChecked(checked);
        }
    }
    componentDidMount(){
        super.componentDidMount();
        let checked = this.props.value===this.props.groupValue;
        this.setState({checked:checked});
    }
    wrapperClasses(){
        return classHelper.classNames(['f-inline-row f-none radiobutton', this.props.className, {
            'radiobutton-invalid': this.state.invalid
        }]);
    }
    radioClasses(){
        return classHelper.classNames(['f-full', {
            'radiobutton-disabled': this.props.disabled,
            'radiobutton-checked': this.state.checked
        }])
    }
    setChecked(checked){
        if (this.state.checked !== checked){
            this.setState({checked:checked}, ()=>{
                this.props.onChange(checked);
                if (checked){
                    let fieldChange = this.context && this.context.fieldChange ? this.context.fieldChange : ()=>{};
                    fieldChange(this, this.props.value);
                }
            });
        }
    }
    select(){
        if (this.props.disabled){
            return;
        }
        this.setChecked(true);
    }
    handleClick(){
        this.select();
    }
    handleChange(){
        this.select();
    }
    render(){
        return (
            <span className={this.wrapperClasses()} style={this.props.style} ref={el=>this.el=el}>
                <span className={this.radioClasses()} onClick={this.handleClick.bind(this)}>
                    {
                        this.state.checked && <span className="radiobutton-inner"></span>
                    }
                </span>
                <div className="radiobutton-value">
                    <input type="radio" name={this.props.name} id={this.props.inputId} disabled={this.props.disabled} checked={this.state.checked} value={this.props.value} onChange={this.handleChange.bind(this)}></input>
                </div>
            </span>
        )
    }
}
RadioButton.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    groupValue: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    inputId: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
}
RadioButton.defaultProps = {
    disabled: false,
    onChange(checked){}
}
export default RadioButton


// WEBPACK FOOTER //
// ./src/components/radiobutton/RadioButton.js