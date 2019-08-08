import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LocaleProvider extends Component{
    constructor(props){
        super(props);
        this.state = {
            locale: props.locale
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.locale !== this.props.locale){
            this.setState({locale:nextProps.locale});
        }
    }
    t = (path,defValue=null) => {
        if (this.state.locale){
            let value = this.state.locale;
            let pp = path.split('.');
            for(let i=0; i<pp.length; i++){
                let key = pp[i];
                if (value[key]){
                    value = value[key];
                } else {
                    return defValue;
                }
            }
            return value||defValue;
        }
        return defValue;
    }
    getChildContext(){
        return {
            locale:this.state.locale,
            t:this.t
        }
    }
    render(){
        return React.Children.only(this.props.children);
    }
}
LocaleProvider.childContextTypes = {
    locale: PropTypes.object,
    t: PropTypes.func
}
export default LocaleProvider


// WEBPACK FOOTER //
// ./src/components/locale/LocaleProvider.js