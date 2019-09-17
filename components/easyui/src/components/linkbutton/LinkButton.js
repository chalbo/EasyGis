import React from 'react';
import PropTypes from 'prop-types';
import classHelper from '../base/ClassHelper';
import LocaleBase from '../base/LocaleBase';

class LinkButton extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            selected: props.selected,
            focused: false
        }
    }
    focus(){
        this.setState({focused:true})
    }
    blur(){
        this.setState({focused:false})
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.selected !== this.props.selected){
            this.setState({selected:nextProps.selected})
        }
    }
    innerCls() {
        const {size,plain,outline,focused,className} = this.props;
        return classHelper.classNames(['l-btn f-inline-row f-content-center', 'l-btn-' + size, className, {
            'l-btn-plain': plain,
            'l-btn-outline': outline,
            'l-btn-selected': this.state.selected,
            'l-btn-plain-selected': this.state.selected && plain,
            'l-btn-disabled': this.isDisabled(),
            'l-btn-plain-disabled': this.isDisabled() && plain,
            'l-btn-focus': focused
        }])
    }
    btnIconCls() {
        let cls = 'l-btn-icon';
        if (this.props.iconCls){
            cls += ' ' + this.props.iconCls;
        }
        return cls;
    }
    btnLeftCls() {
        let cls = 'l-btn-left';
        if (this.props.iconCls){
            cls += ' l-btn-icon-' + this.props.iconAlign;
        }
        return cls;
    }
    btnTextCls() {
        return classHelper.classNames(['l-btn-text', {
            'l-btn-empty': this.isEmpty()
        }]);
    }
    isDisabled() {
        return this.props.disabled;
    }
    isEmpty(){
        return !this.props.text && !this.props.children;
    }
    text(){
        if (this.isEmpty()){
            return null;
        } else {
            return this.props.text || this.props.children;
        }
    }
    handleClick(event){
        const {disabled,href,toggle} = this.props;
        event.stopPropagation();
        if (disabled){
            event.preventDefault();
            return false;
        }
        if (!href){
            event.preventDefault();
        }
        if (toggle){
            this.setState({selected:!this.state.selected})
        }
        this.props.onClick();
    }
    renderInners(){
        return [
            <span key="text" className={this.btnTextCls()}>{this.text()}</span>,
            <span key="icon" className={this.btnIconCls()}></span>
        ]
    }
    renderOthers(){
        return null;
    }
    renderButton(){
        return (
            <a href={this.props.href||'#'} 
                ref={el=>this.el=el}
                className={this.innerCls()} 
                style={this.props.style} 
                onClick={this.handleClick.bind(this)}
            >
                <span className={this.btnLeftCls()}>
                    {this.renderInners()}
                </span>
                {this.renderOthers()}
            </a>
        )
    }
    render(){
        return this.renderButton();
    }
}
LinkButton.propTypes = {
    disabled: PropTypes.bool,
    toggle: PropTypes.bool,
    selected: PropTypes.bool,
    outline: PropTypes.bool,
    plain: PropTypes.bool,
    text: PropTypes.string,
    iconCls: PropTypes.string,
    iconAlign: PropTypes.string,
    size: PropTypes.string,
    href: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func
}
LinkButton.defaultProps = {
    disabled: false,
    toggle: false,
    selected: false,
    outline: false,
    plain: false,
    iconAlign: 'left',
    size: 'small',
    onClick(){}
}
export default LinkButton


// WEBPACK FOOTER //
// ./src/components/linkbutton/LinkButton.js