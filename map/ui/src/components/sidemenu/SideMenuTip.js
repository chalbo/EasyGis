import React from 'react';
import LocaleBase from '../base/LocaleBase';
import Tooltip from '../tooltip/Tooltip';
import SideMenuItems from './SideMenuItems';
import domHelper from '../base/DomHelper';

class SideMenuTip extends LocaleBase{
    handleSelectionChange(selection){
        this.props.onSelectionChange(selection);
    }
    handleItemClick(item){
        this.props.onItemClick(item);
        setTimeout(() => this.tooltip.hide());
    }
    handlePositionChange({left,top}){
        if (this.tooltip && this.tooltip.tip){
            const view = domHelper.getViewport();
            const height = domHelper.outerHeight(this.tooltip.tip.tooltipRef);
            if (top+height>view.height+domHelper.getScrollTop()){
                top = view.height + domHelper.getScrollTop() - height;
                this.tooltip.tip.tooltipRef.style.top = top+'px';
            } 
        }
    }
    render(){
        const {menu,floatMenuWidth,floatMenuPosition,showCollapsedText} = this.props;
        return (
            <Tooltip
                ref={ref=>this.tooltip=ref}
                position={floatMenuPosition}
                tooltipCls="sidemenu-tooltip"
                valign="top"
                hideDelay={20}
                content={()=>(
                    <SideMenuItems 
                        {...this.props}
                        data={menu} 
                        tip 
                        width={floatMenuWidth} 
                        onSelectionChange={this.handleSelectionChange.bind(this)}
                        onItemClick={this.handleItemClick.bind(this)}
                    />
                )}
                onPosition={this.handlePositionChange.bind(this)}
            >
                <div className="panel-header accordion-header">
                    <div className="collapsed-icon">
                        <div className="panel-title panel-with-icon"></div>
                        <div className={'panel-icon '+menu.iconCls}></div>
                    </div>
                    {showCollapsedText && <div className="collapsed-text">{menu.text}</div>}
                </div>
            </Tooltip>
        )
    }
}
export default SideMenuTip


// WEBPACK FOOTER //
// ./src/components/sidemenu/SideMenuTip.js