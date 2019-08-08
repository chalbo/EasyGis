import React from 'react';
import LocaleBase from '../base/LocaleBase';
import classHelper from '../base/ClassHelper';

class TabPanelHeader extends LocaleBase{
    handleCloseClick(event){
        event.stopPropagation();
        event.preventDefault();
        this.props.onClose();
    }
    handleHeaderClick(event){
        event.preventDefault();
    }
    renderTitle(){
        const {panel} = this.props;
        const {header,iconCls,closable} = panel.props;
        if (header){
            return header();
        }
        const cls = classHelper.classNames('tabs-title', {
            'tabs-with-icon': iconCls,
            'tabs-closable': closable
        })
        return <span className={cls}>{panel.props.title}</span>
    }
    renderIcon(){
        const {iconCls} = this.props.panel.props;
        if (iconCls){
            return <span className={classHelper.classNames('tabs-icon',iconCls)}></span>
        } else {
            return null;
        }
    }
    renderClosable(){
        const {closable} = this.props.panel.props;
        if (closable){
            return (
                <a href=" " 
                    key="a2"
                    tabIndex="-1" 
                    className="tabs-close"
                    onClick={this.handleCloseClick.bind(this)}
                > </a>
            )
        } else {
            return null;
        }

    }
    render(){
        const {panel,tabWidth,tabHeight,tabPosition} = this.props;
        const {headerCls,headerStyle} = panel.props;
        
        const cls = classHelper.classNames('tabs-inner f-inline-row f-full', headerCls)
        const isHorizontal = tabPosition === 'left' || tabPosition === 'right';
        const style = Object.assign({}, headerStyle||{}, {
            width: !isHorizontal?tabWidth+'px':null,
            height: isHorizontal?tabHeight+'px':null
        })
        return [
            <span href=" " 
                key="a1"
                className={cls}
                style={style}
                onClick={this.handleHeaderClick.bind(this)}
            >
                {this.renderTitle()}
                {this.renderIcon()}
            </span>,
            this.renderClosable()
        ]
    }
}
export default TabPanelHeader


// WEBPACK FOOTER //
// ./src/components/tabs/TabPanelHeader.js