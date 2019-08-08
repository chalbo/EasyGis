import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import defaultRules from './rules';

class Validation extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            validateTime: null,
            changeTime: null
        }
        this.fields = [];
        this.errors = {};
        this.delayTimer = null;
    }
    fieldChange = (field, value) => {
        let name = field.getFieldName();
        // if (Object.keys(this.props.model).indexOf(name) !== -1){
        // }
        this.props.model[name] = value;
        this.props.onChange(name, value);
        this.setState({changeTime:new Date()});
        if (field.props.validateOnChange){
            clearTimeout(this.delayTimer);
            this.delayTimer = setTimeout(() => {
                this.validateField(field.getFieldName());
            }, this.props.delay);
        }
    }
    fieldFocus = (field) => {
        this.setState({changeTime:new Date()});
    }
    fieldBlur = (field) => {
        this.setState({changeTime:new Date()});
        if (field.props.validateOnBlur){
            this.validateField(field.getFieldName());
        }
    }
    fieldAdd = (field) => {
        this.fields.push(field);
        if (field.props.validateOnCreate){
            this.validateField(field.getFieldName());
        }
    }
    fieldRemove = (field) => {
        let index = this.fields.indexOf(field);
        if (index >= 0){
            this.fields.splice(index,1);
        }
    }
    getChildContext(){
        return {
            fieldChange: this.fieldChange,
            fieldFocus: this.fieldFocus,
            fieldBlur: this.fieldBlur,
            fieldAdd: this.fieldAdd,
            fieldRemove: this.fieldRemove,
            fieldName: this.props.fieldName
        }
    }
    validate(callback) {
        let vtotal = this.fields.length;
        let vcount = 0;
        this.fields.forEach(field => {
            this.validateField(field.getFieldName(), () => {
                vcount++;
                if (vcount >= vtotal && callback){
                    callback(this.getErrors());
                }
            });
        });
    }
    validateField(name, callback){
        const validateRules = Object.assign({}, defaultRules, this.props.validateRules||{})
        // let name = field.getFieldName();
        let vtotal = 1;
        let vcount = 0;
        let validity = () => {
            let valid = this.errors[name].length===0;
            this.fields.filter(f => f.getFieldName() === name).forEach(f => f.setState({invalid:!valid}));
            vcount++;
            if (vcount >= vtotal){
                this.setState({validateTime:new Date()})
                this.props.onValidate(this.errors);
                if (callback){
                    callback(this.getErrors(name));
                }
            }
        };
        this.errors[name] = [];
        let errorMsg = {};
        let setMessage = (vtype, message, param) => {
            param = param || [];
            for(var i=0; i<param.length; i++){
                message = message.replace(new RegExp("\\{" + i + "\\}", "g"), param[i]);
            }
            // this.errors[name].push(message);
            errorMsg[vtype] = message;
            this.errors[name] = [];
            for(let key in errorMsg){
                if (errorMsg[key]){
                    this.errors[name].push(errorMsg[key]);
                }
            }
        };
        let doValidate = (vtype, vparam) => {
            if (!vtype){
                validity();
                return;
            }
            const {model} = this.props;
            let value = model[name];
            if (vtype !== 'required'){
                if (validateRules['required']['validator'](value) === false){
                    validity();
                    return;
                }
            }
            if (vparam && vparam.validator){
                let result = vparam.validator(value);
                if (result instanceof Promise){
                    result.then(valid => {
                        if (!valid){
                            setMessage(vtype, vparam.message);
                        } else {
                            setMessage(vtype, null);
                        }
                        validity();
                    });
                } else {
                    if (!result){
                        setMessage(vtype, vparam.message);
                    } else {
                        setMessage(vtype, null);
                    }
                    validity();
                }
                return;
            }

            let parts = /([a-zA-Z_]+)(.*)/.exec(vtype);
            vtype = parts[1];
            let paramStr = parts[2]||'';
            let rule = validateRules[vtype];
            if (rule){
                let message = this.t('Rules.'+vtype, rule['message']);
                let param = vparam || (paramStr?JSON.parse(paramStr):[]) || [];
                let result = rule['validator'](value, param);
                if (result instanceof Promise){
                    result.then((valid) => {
                        if (!valid){
                            setMessage(vtype, message, param);
                        } else {
                            setMessage(vtype, null);
                        }
                        validity();
                    });
                } else {
                    if (!result){
                        setMessage(vtype, message, param);
                    } else {
                        setMessage(vtype, null);
                    }
                    validity();
                }
            } else {
                validity();
            }
        };

        const {rules} = this.props;
        if (!rules){
            return;
        }
        // this.errors[name] = [];
        let rule = rules[name];
        if (!rule){
            doValidate();
            return;
        }
        if (rule instanceof Array){
            vtotal = rule.length;
            for(let i=0; i<rule.length; i++){
                doValidate(rule[i]);
            }
        } else if (typeof rule === 'string'){
            vtotal = 1;
            doValidate(rule);
        } else {
            vtotal = Object.keys(rule).length;
            for(let vtype in rule){
                let vparam = rule[vtype];
                doValidate(vtype, vparam);
            }
        }
    }
    hasError(name){
        return this.getError(name) != null;
    }
    getError(name){
        let errors = this.errors[name];
        return errors ? errors[0] : null;
    }
    getErrors(name){
        if (name){
            let errors = this.errors[name];
            return errors.length ? errors : null;
        } else {
            if (this.valid()){
                return null;
            } else {
                let errors = {};
                for(let field in this.errors){
                    if (this.errors[field].length){
                        errors[field] = this.errors[field];
                    }
                }
                return errors;
            }
        }
    }
    getFieldValue(name){
        return this.props.model[name];
    }
    isFocused(name){
        const ff = this.fields.filter(f => f.getFieldName() === name);
        if (ff.length){
            return ff[0].state.focused || false;
        }
        return false;
    }
    valid(){
        let count = 0;
        for(let field in this.errors){
            count += this.errors[field].length;
        }
        return count===0;
    }
    render(){
        return React.Children.only(this.props.children);
    }
}
Validation.propTypes = Object.assign({}, LocaleBase.propTypes, {
    model: PropTypes.object,
    rules: PropTypes.object,
    validateRules: PropTypes.object,
    delay: PropTypes.number,
    onChange: PropTypes.func,
    onValidate: PropTypes.func
})
Validation.childContextTypes = {
    fieldChange: PropTypes.func,
    fieldFocus: PropTypes.func,
    fieldBlur: PropTypes.func,
    fieldAdd: PropTypes.func,
    fieldRemove: PropTypes.func,
    fieldName: PropTypes.string
}
Validation.defaultProps = {
    delay: 200,
    onChange(name,value){},
    onValidate(errors){}
}
export default Validation


// WEBPACK FOOTER //
// ./src/components/form/Validation.js