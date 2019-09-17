import React from 'react';
import PropTypes from 'prop-types';
import classHelper from '../base/ClassHelper';
import LocaleBase from '../base/LocaleBase';

class ProgressBar extends LocaleBase{
    barClasses(){
        return classHelper.classNames(['progressbar-value f-row f-content-center', this.props.barCls]);
    }
    barStyles(){
        return Object.assign({}, this.props.barStyle, {
            width: this.props.value+'%'
        })
    }
    render(){
        const cls = classHelper.classNames('progressbar f-row', this.props.className)
        return (
            <div className={cls} style={this.props.style}>
                <div className={this.barClasses()} style={this.barStyles()}>
                    {this.props.showValue && <span>{this.props.value}%</span>}
                    {this.props.children}
                </div>
            </div>
        )
    }
}
ProgressBar.propTypes = Object.assign({}, LocaleBase.propTypes, {
    value: PropTypes.number,
    showValue: PropTypes.bool,
    barCls: PropTypes.string,
    barStyle: PropTypes.object
})
ProgressBar.defaultProps = {
    value: 0,
    showValue: false
}
export default ProgressBar


// WEBPACK FOOTER //
// ./src/components/progressbar/ProgressBar.js