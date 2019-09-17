import React from 'react';
import PropTypes from 'prop-types';

class LocaleBase extends React.PureComponent{
    t(key,defaultValue=null){
        if (this.context && this.context.t){
            return this.context.t(key,defaultValue);
        } else {
            return defaultValue;
        }
    }
}
LocaleBase.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
}
LocaleBase.contextTypes = {
    locale: PropTypes.object,
    t: PropTypes.func
}
export default LocaleBase;


// WEBPACK FOOTER //
// ./src/components/base/LocaleBase.js