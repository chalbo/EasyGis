import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import classHelper from '../base/ClassHelper';

class MenuItem extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            isActived: props.isActived,
            submenu: null
        }
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.closed !== this.props.closed){
            if (nextProps.closed){
                this.setState({isActived:false})
            }
        }
    }
    handleMouseEnter(){
        this.setState({isActived:true})
        if (this.state.submenu){
            this.state.submenu.alignMenu()
        }
    }
    handleMouseLeave(){
        this.setState({isActived:false})
    }
    handleItemClick(event){
        event.stopPropagation();
        if (this.props.disabled){
            return;
        }
        if (!this.state.submenu){
            this.props.onItemClick(this.props.value || this.props.text);
        }
    }
    handleMenuAdd(menu){
        this.setState({submenu:menu})
    }
    handleMenuRemove(){
        this.setState({submenu:null})
    }
    itemClasses(){
        return classHelper.classNames(['menu-item', {
            'menu-active': this.state.isActived,
            'menu-item-disabled': this.props.disabled,
            'menu-active-disabled': this.props.disabled && this.state.isActived
        }])
    }
    render(){
        const {text,iconCls} = this.props;
        return (
            <div 
                ref={el=>this.el=el}
                className={this.itemClasses()}
                onMouseEnter={this.handleMouseEnter.bind(this)}
                onMouseLeave={this.handleMouseLeave.bind(this)}
                onClick={this.handleItemClick.bind(this)}
            >
                <div className="menu-text">{text}</div>
                {iconCls && <div className={'menu-icon '+iconCls}></div>}
                {this.state.submenu && <div className="menu-rightarrow"></div>}
                {
                    React.Children.map(this.props.children, (child) => (
                        React.cloneElement(child, {
                            menu: this.props.menu,
                            isActived: this.state.isActived,
                            parentItem: this,
                            onMenuAdd: this.handleMenuAdd.bind(this),
                            onMenuRemove: this.handleMenuRemove.bind(this),
                            onItemClick: this.props.onItemClick
                        })
                    ))
                }
            </div>
        )
    }
}
MenuItem.propTypes = Object.assign({}, LocaleBase.propTypes, {
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    text: PropTypes.string,
    iconCls: PropTypes.string,
    disabled: PropTypes.bool
})
MenuItem.defaultProps = {
    disabled: false
}
export default MenuItem


// WEBPACK FOOTER //
// ./src/components/menu/MenuItem.js