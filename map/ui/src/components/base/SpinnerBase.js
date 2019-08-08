import React from 'react';
import PropTypes from 'prop-types';
import InputBase from './InputBase';
import classHelper from './ClassHelper';

class SpinnerBase extends InputBase{
    doSpinUp() {

    }
    doSpinDown() {
        
    }
    handleClickUp(){
        const {disabled,readOnly,spinAlign,reversed} = this.props;
        if (disabled || readOnly){
            return;
        }
        if (spinAlign === 'left' || spinAlign === 'right'){
            this.doSpinUp();
        } else {
            reversed ? this.doSpinDown() : this.doSpinUp();
        }
    }
    handleClickDown(){
        const {disabled,readOnly,spinAlign,reversed} = this.props;
        if (disabled || readOnly){
            return;
        }
        if (spinAlign === 'left' || spinAlign === 'right'){
            this.doSpinDown();
        } else {
            reversed ? this.doSpinUp() : this.doSpinDown();
        }
    }
    getButtonCls(pos){
        const {reversed} = this.props;
        if (pos === 'left' || pos === 'up'){
            return classHelper.classNames('spinner-button', {
                'spinner-button-down': !reversed,
                'spinner-button-up': reversed
            })
        } else {
            return classHelper.classNames('spinner-button', {
                'spinner-button-down': reversed,
                'spinner-button-up': !reversed
            })
        }
    }
    renderDefault(){
        const {spinAlign} = this.props;
        const cls = classHelper.classNames('textbox-addon spinner-button-updown f-column f-noshrink', {
            'f-order1': spinAlign==='left',
            'f-order5': spinAlign==='right'
        })
        return (
            <span className={cls}>
                <span className="spinner-arrow spinner-button-top f-full" onClick={this.handleClickUp.bind(this)}>
					<span className="spinner-arrow-up"></span>
				</span>
                <span className="spinner-arrow spinner-button-bottom f-full" onClick={this.handleClickDown.bind(this)}>
					<span className="spinner-arrow-down"></span>
				</span>
            </span>
        )
    }
    renderHorizontal(){
        const leftButton = (
            <span key="left" className="textbox-addon spinner-arrow spinner-button-left f-inline-row f-noshrink f-order1" onClick={this.handleClickDown.bind(this)}>
                <span className={this.getButtonCls('left')}></span>
            </span>
        );
        const rightButton = (
            <span key="right" className="textbox-addon spinner-arrow spinner-button-right f-inline-row f-noshrink f-order5" onClick={this.handleClickUp.bind(this)}>
                <span className={this.getButtonCls('right')}></span>
            </span>
        )
        return [leftButton,rightButton]
    }
    renderVertical(){
        const upButton = (
            <span key="up" className="textbox-addon spinner-arrow spinner-button-bottom f-noshrink" onClick={this.handleClickDown.bind(this)}>
                <span className={this.getButtonCls('up')}></span>
            </span>
        );
        const downButton = (
            <span key="down" className="textbox-addon spinner-arrow spinner-button-top f-noshrink" onClick={this.handleClickUp.bind(this)}>
                <span className={this.getButtonCls('down')}></span>
            </span>
        )
        return [upButton,downButton]
    }
    renderOthers(){
        const {spinners,spinAlign} = this.props;
        if (!spinners){
            return null;
        }
        if (spinAlign === 'horizontal'){
            return this.renderHorizontal();
        } else if (spinAlign === 'vertical'){
            return this.renderVertical();
        } else {
            return this.renderDefault();
        }
    }
}
SpinnerBase.propTypes = Object.assign({}, InputBase.propTypes, {
    reversed: PropTypes.bool,
    spinners: PropTypes.bool,
    spinAlign: PropTypes.string
})
SpinnerBase.defaultProps = Object.assign({}, InputBase.defaultProps, {
    reversed: false,
    spinners: true,
    spinAlign: 'right'
})
export default SpinnerBase


// WEBPACK FOOTER //
// ./src/components/base/SpinnerBase.js