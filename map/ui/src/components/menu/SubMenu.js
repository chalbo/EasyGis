import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import classHelper from '../base/ClassHelper';
import domHelper from '../base/DomHelper';
import Menu from './Menu';

class SubMenu extends LocaleBase{
    constructor(props){
        super(props);
        this.timer = null;
        this.state = {
            left: 0,
            top: 0,
            zIndex: Menu.zIndex++
        }
    }
    componentDidMount(){
        this.props.onMenuAdd(this);
    }
    componentWillUnmount(){
        this.props.onMenuRemove(this);
    }
    alignMenu() {
        let view = domHelper.getViewport();
        let pos = domHelper.offset(this.props.parentItem.el);
        let width = domHelper.outerWidth(this.el);
        let height = domHelper.outerHeight(this.el);
        let pwidth = domHelper.outerWidth(this.props.parentItem.el);
        let left = pwidth - 1;
        if (left + pos.left + width > view.width + domHelper.getScrollLeft()){
            left = -width - 1;
        }
        let top = -4;
        if (height > view.height + domHelper.getScrollTop()){
            top = -pos.top + domHelper.getScrollTop();
        } else {
            if (top + pos.top + height > view.height + domHelper.getScrollTop()){
                top = view.height + domHelper.getScrollTop() - pos.top - height - 2;
            }
        }
        this.setState({
            left: left,
            top: top,
            zIndex: Menu.zIndex++
        })
    }
    render(){
        const {left,top,zIndex} = this.state;
        const menuCls = classHelper.classNames('menu-container', this.props.className, {
            'f-hide': !this.props.isActived
        })
        const menuStyle = Object({
            width: domHelper.toStyleValue(this.props.menuWidth),
            left: left+'px',
            top: top+'px',
            zIndex: zIndex,
        }, this.props.style)
        const innerCls = classHelper.classNames('menu f-column f-full', this.props.menuCls)
        return(
            <div className={menuCls} style={menuStyle} ref={el=>this.el=el}>
                <div className="menu-shadow"></div>
                <div className="menu-line"></div>
                <div className={innerCls} style={this.props.menuStyle}>
                {
                    React.Children.map(this.props.children, (child) => (
                        React.cloneElement(child, {
                            onItemClick: this.props.onItemClick
                        })
                    ))
                }
                </div>
            </div>
        )
    }
}
SubMenu.propTypes = Object.assign({}, LocaleBase.propTypes, {
    menuWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    menuCls: PropTypes.string,
    menuStyle: PropTypes.object
})

export default SubMenu


// WEBPACK FOOTER //
// ./src/components/menu/SubMenu.js