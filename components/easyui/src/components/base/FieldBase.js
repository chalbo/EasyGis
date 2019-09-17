import PropTypes from 'prop-types';
import LocaleBase from './LocaleBase';

class FieldBase extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            invalid: props.invalid,
            el: null
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.invalid !== this.props.invalid){
            this.setState({invalid:nextProps.invalid});
        }
    }
    componentDidMount(){
        if (this.context && this.context.fieldAdd){
            this.context.fieldAdd(this);
        }
    }
    componentWillUnmount(){
        if (this.context && this.context.fieldRemove){
            this.context.fieldRemove(this);
        }
    }
    getFieldName(){
        const name = this.props.name;
        if (name){
            return name;
        }
        if (this.context && this.context.fieldName){
            return this.context.fieldName;
        } else {
            return null;
        }
    }
    render(){
        return null;
    }
}
FieldBase.contextTypes = Object.assign({},LocaleBase.contextTypes,{
    fieldChange: PropTypes.func,
    fieldFocus: PropTypes.func,
    fieldBlur: PropTypes.func,
    fieldAdd: PropTypes.func,
    fieldRemove: PropTypes.func,
    fieldName: PropTypes.string
})
FieldBase.propTypes = {
    name: PropTypes.string,
    invalid: PropTypes.bool,
    validateOnCreate: PropTypes.bool,
    validateOnBlur: PropTypes.bool,
    validateOnChange: PropTypes.bool
}
FieldBase.defaultProps = {
    invalid: false,
    validateOnCreate: true,
    validateOnBlur: false,
    validateOnChange: true
}
export default FieldBase;


// WEBPACK FOOTER //
// ./src/components/base/FieldBase.js