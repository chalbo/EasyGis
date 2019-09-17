import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classHelper from '../base/ClassHelper';

class Label extends Component{
    render(){
        const {align} = this.props;
        const cls = classHelper.classNames('textbox-label', this.props.className, {
            'textbox-label-top': align==='top'
        });
        const style = Object.assign({textAlign:this.props.align}, this.props.style);
        return (
            <label className={cls} style={style} htmlFor={this.props.htmlFor}>
                {this.props.children}
            </label>
        )
    }
}
Label.propTypes = {
    align: PropTypes.string,
    htmlFor: PropTypes.string
}
Label.defaultProps = {
    align: 'left'
}
export default Label


// WEBPACK FOOTER //
// ./src/components/base/Label.js