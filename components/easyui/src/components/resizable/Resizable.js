import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import ResizableClass from './ResizableClass';

class Resizable extends LocaleBase{
    componentDidMount(){
        while(!(this.el instanceof Element)){
            this.el = this.el.el;
        }
        this._resizeInstance = new ResizableClass(this.el, this.props);
        this._resizeInstance.bindEvents();
    }
    componentWillUnmount(){
        this._resizeInstance.unbindEvents();
    }
    componentWillReceiveProps(nextProps){
        this._resizeInstance.updateOptions(nextProps);
    }
    render(){
        return React.cloneElement(React.Children.only(this.props.children), {ref:ref=>this.el=ref})
    }

}
Resizable.propTypes = {
    disabled: PropTypes.bool,
    handles: PropTypes.string,
    edge: PropTypes.number,
    minWidth: PropTypes.number,
    minHeight: PropTypes.number,
    maxWidth: PropTypes.number,
    maxHeight: PropTypes.number,
    onResizeStart: PropTypes.func,
    onResizing: PropTypes.func,
    onResizeStop: PropTypes.func
}
Resizable.defaultProps = {
    disabled: false,
    handles: 'all', // n, e, s, w, ne, se, sw, nw, all
    edge: 5,
    minWidth: 10,
    minHeight: 10,
    maxWidth: 10000,
    maxHeight: 10000,
    onResizeStart(e){},
    onResizing(e){},
    onResizeStop(e){}
}
export default Resizable


// WEBPACK FOOTER //
// ./src/components/resizable/Resizable.js