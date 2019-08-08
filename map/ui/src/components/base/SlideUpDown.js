import React, { Component } from 'react';
import domHelper from '../base/DomHelper';

class SlideUpDown extends Component {
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.disabled){
            return;
        }
        if (this.props.collapsed !== nextProps.collapsed){
            if (nextProps.animate){
                if (nextProps.collapsed){
                    domHelper.slideUp(this.el);
                } else {
                    domHelper.slideDown(this.el);
                }
            } else {
                if (nextProps.collapsed){
                    domHelper.addClass(this.el, 'f-hide');
                } else {
                    domHelper.removeClass(this.el, 'f-hide');
                }
            }
        }
    }
    componentDidMount(){
        if (this.props.disabled){
            return;
        }
        if (this.props.collapsed){
            domHelper.addClass(this.el, 'f-hide');
        }
    }
    render(){
        return React.cloneElement(React.Children.only(this.props.children), {ref:ref=>this.el=ref})
    }
}
SlideUpDown.defaultProps = {
    collapsed: false,
    disabled: false,
    animate: true
}

export default SlideUpDown;


// WEBPACK FOOTER //
// ./src/components/base/SlideUpDown.js