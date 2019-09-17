import React from 'react';
import PropTypes from 'prop-types';
import classHelper from '../base/ClassHelper';
import FieldBase from '../base/FieldBase';

class CheckBox extends FieldBase{
    constructor(props){
        super(props);
        Object.assign(this.state, {
            checked: props.checked
        });
    }
    componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps);
        if (nextProps.values !== this.props.values && nextProps.multiple){
            let v1 = Object.assign([],this.props.values).sort();
            let v2 = Object.assign([], nextProps.values).sort();
            if (v1.join('-') !== v2.join('-')){
                this.initChecked(nextProps, ()=>{
                    this.updateValues();
                });
            }
        }
        if (nextProps.checked !== this.props.checked && !nextProps.multiple){
            if (nextProps.checked !== this.state.checked){
                this.setState({checked:nextProps.checked}, () => {
                    this.updateValues();
                });
            }
        }
    }
    componentDidMount(){
        super.componentDidMount();
        this.initChecked(this.props);
    }
    wrapperClasses(){
        return classHelper.classNames(['f-inline-row f-none checkbox', this.props.className, {
            'checkbox-invalid': this.state.invalid
        }]);
    }
    checkClasses(){
        return classHelper.classNames(['f-full', {
            'checkbox-disabled': this.props.disabled,
            'checkbox-checked': this.state.checked
        }]);
    }
    initChecked(props, cb=()=>{}){
        const { multiple,value,values,checked } = props;
        if (multiple){
            this.setState({checked: values.indexOf(value)!==-1}, cb);
        } else {
            this.setState({checked: checked}, cb);
        }
    }
    updateValues(){
        let fieldChange = this.context && this.context.fieldChange ? this.context.fieldChange : ()=>{};
        if (this.props.multiple){
            let index = this.props.values.indexOf(this.props.value);
            if (index >= 0){
                this.props.values.splice(index, 1);
            }
            if (this.state.checked){
                this.props.values.push(this.props.value);
            }
            fieldChange(this, this.props.values);
        } else {
            fieldChange(this, this.state.checked);
        }
        this.props.onChange(this.state.checked);
    }
    handleClick(event){
        if (this.props.disabled){
            return;
        }
        event.preventDefault();
        this.setState({checked: !this.state.checked}, ()=>{
            this.updateValues();
        });
    }
    handleChange(){
        this.setState({checked: !this.state.checked}, ()=>{
            this.updateValues();
        });
    }
    render(){
        return (
            <span className={this.wrapperClasses()} style={this.props.style} ref={el=>this.el=el}>
                <span className={this.checkClasses()} onClick={this.handleClick.bind(this)}>
                    {   this.state.checked &&
                        <svg className="checkbox-inner" space="preserve" focusable="false" version="1.1" viewBox="0 0 24 24"><path d="M4.1,12.7 9,17.6 20.3,6.3" fill="none" stroke="white"></path></svg>
                    }
                </span>
                <div className="checkbox-value">
                    <input id={this.props.inputId} type="checkbox" name={this.props.name} value={this.props.value} checked={this.state.checked} disabled={this.props.disabled} onChange={this.handleChange.bind(this)}></input>;
                </div>
            </span>
        )
    }
}
CheckBox.propTypes = {
    checked: PropTypes.bool,
    value: PropTypes.string,
    values: PropTypes.array,
    inputId: PropTypes.string,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    onChange: PropTypes.func
}
CheckBox.defaultProps = {
    checked: false,
    disabled: false,
    multiple: false,
    values: [],
    onChange(checked){}
}
export default CheckBox


// WEBPACK FOOTER //
// ./src/components/checkbox/CheckBox.js