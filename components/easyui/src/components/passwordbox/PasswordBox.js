import React from 'react';
import PropTypes from 'prop-types';
import classHelper from '../base/ClassHelper';
import InputBase from '../base/InputBase';

class PasswordBox extends InputBase{
    constructor(props){
        super(props);
        this.lastTimer = null;
        Object.assign(this.state, {
            revealed: props.revealed
        })
    }
    componentDidMount(){
        super.componentDidMount();
        const {revealed,value} = this.state;
        this.setState({
            text: revealed ? value : (value || '').replace(/./ig, this.props.passwordChar)
        })
    }
    convert(value, all = false){
        if (this.state.revealed){
            this.setValue(value);
            return;
        }
        if (!value){
            this.setValue(value);
            return;
        }
        let pchar = this.props.passwordChar;
        let cc = value.split('');
        let vv = this.state.value ? this.state.value.split('') : [];
        for(let i=0; i<cc.length; i++){
            let c = cc[i];
            if (c !== vv[i]){
                if (c !== pchar){
                    vv.splice(i, 0, c);
                }				
            }
        }
        let pos = this.getSelectionStart();
        if (cc.length < vv.length){
            vv.splice(pos, vv.length-cc.length, '');
        }
        for(var i=0; i<cc.length; i++){
            if (all || i !== pos-1){
                cc[i] = pchar;
            }
        }
        this.setValue(vv.join(''));
        this.setState({text:cc.join('')}, ()=>{
            this.setSelectionRange(pos, pos);
        });
    }
    handleEyeClick(){
        const {revealed,value} = this.state;
        this.setState({
            revealed: !revealed,
            text: !revealed ? value : (value || '').replace(/./ig, this.props.passwordChar)
        })
    }
    handleInputChange(event){
        this.convert(event.target.value);
        clearTimeout(this.lastTimer);
        this.lastTimer = setTimeout(() => {
            this.convert(this.state.text, true);
        }, this.props.lastDelay);
    }
    eyeClasses(){
        const {eyeAlign} = this.props;
        return classHelper.classNames(['textbox-addon f-column f-noshrink', {
            'f-order0': eyeAlign==='left',
            'f-order6': eyeAlign==='right'
        }]);
    }
    eyeIconClasses(){
        const {revealed} = this.state;
        return classHelper.classNames(['textbox-icon f-full', {
            'passwordbox-open': revealed,
            'passwordbox-close': !revealed
        }]);
    }
    renderOthers(){
        const {showEye} = this.props;
        if (!showEye){
            return null;
        }
        return (
            <span className={this.eyeClasses()}>
                <span className={this.eyeIconClasses()} onClick={this.handleEyeClick.bind(this)}></span>
            </span>
        )
    }
}
PasswordBox.propTypes = Object.assign({}, InputBase.propTypes, {
    passwordChar: PropTypes.string,
    checkInterval: PropTypes.number,
    lastDelay: PropTypes.number,
    showEye: PropTypes.bool,
    eyeAlign: PropTypes.string,
    revealed: PropTypes.bool
})
PasswordBox.defaultProps = Object.assign({}, InputBase.defaultProps, {
    passwordChar: '●',
    checkInterval: 200,
    lastDelay: 500,
    showEye: true,
    eyeAlign: 'right',
    revealed: false
})
export default PasswordBox


// WEBPACK FOOTER //
// ./src/components/passwordbox/PasswordBox.js