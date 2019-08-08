import React from 'react';
import PropTypes from 'prop-types';
import LinkButton from '../linkbutton/LinkButton';

class MenuButton extends LinkButton{
    constructor(props){
        super(props);
        this.timer = null;
        this.clickToShowMenu = true;
        Object.assign(this.state, {
            isActived: false
        })
    }
    showMenu() {
        if (this.props.disabled){
            return;
        }
        if (this.menuRef){
            this.menuRef.showAt(this.el, this.props.menuAlign);
        }
    }
    innerCls(){
        const {size,plain} = this.props;
        let cls = super.innerCls();
        cls += ' m-btn m-btn-' + size;
        if (this.state.isActived){
            cls += plain ? ' m-btn-plain-active' : ' m-btn-active';
        }
        return cls;
    }
    handleClick(event){
        if (super.handleClick(event) !== false){
            if (this.clickToShowMenu){
                this.showMenu()
            }
        }
    }
    handleMouseEnter(){
        const {disabled,duration} = this.props;
        if (disabled){
            return;
        }
        this.timer = setTimeout(() => {
            this.showMenu();
        }, duration);
    }
    handleMouseLeave(){
        const {disabled} = this.props;
        if (disabled){
            return;
        }
        clearTimeout(this.timer);
        if (this.menuRef){
            this.menuRef.delayHide();
        }
    }
    handleItemClick(value){
        this.props.onMenuItemClick(value);
    }
    handleMenuShow(){
        this.setState({isActived:true})
        this.props.onMenuShow();
    }
    handleMenuHide(){
        this.setState({isActived:false})
        this.props.onMenuHide();
    }
    renderMenu(){
        if (!this.props.menu){
            return null;
        }
        return React.cloneElement(React.Children.only(this.props.menu()), {
            key: 'menu',
            ref: (ref)=>this.menuRef=ref,
            onItemClick: this.handleItemClick.bind(this),
            onShow: this.handleMenuShow.bind(this),
            onHide: this.handleMenuHide.bind(this)
        })
    }
    renderInners(){
        return super.renderInners().concat([
            <span key="arrow" className="m-btn-downarrow"></span>,
            <span key="line" className="m-btn-line"></span>,
            this.renderMenu()
        ])
    }
    render(){
        return React.cloneElement(this.renderButton(), {
            onMouseEnter: this.handleMouseEnter.bind(this),
            onMouseLeave: this.handleMouseLeave.bind(this)
        })
    }
}
MenuButton.propTypes = Object.assign({}, LinkButton.propTypes, {
    menu: PropTypes.func,
    menuAlign: PropTypes.string,
    duration: PropTypes.number
})
MenuButton.defaultProps = Object.assign({}, LinkButton.defaultProps, {
    menuAlign: 'left',
    duration: 100,
    onMenuItemClick(value){},
    onMenuShow(){},
    onMenuHide(){}
})
export default MenuButton


// WEBPACK FOOTER //
// ./src/components/menubutton/MenuButton.js