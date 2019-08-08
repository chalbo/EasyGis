import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import classHelper from '../base/ClassHelper';
import domHelper from '../base/DomHelper';
import TabsContext from '../tabs/TabsContext';
import CollapsedPanel from './CollapsedPanel';

class Layout extends LocaleBase{
    constructor(props){
        super(props);
        this.panels = [];
        this.panelTimer = null;
        this.state = {
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            resizing: false
        }
    }
    getPanel(region){
        let pp = this.panels.filter(p => p.props.region === region);
        return pp.length ? pp[0] : null;
    }
    getPaddingValue(region) {
        let panel = this.getPanel(region);
        if (!panel){
            return 0;
        }
        const {float,split,border} = panel.props;
        const {collapsed} = panel.state;
        let val = 0;
        // if (!collapsed && !float){
        //     if (region === 'west' || region === 'east'){
        //         val = domHelper.outerWidth(panel.panelRef);
        //     } else {
        //         val = domHelper.outerHeight(panel.panelRef);
        //     }
        //     if (!split && border){
        //         val -= 1;
        //     }
        // }
        if (collapsed){
            if (panel.props.expander){
                val += panel.props.collapsedSize-1;
            }
        } else {
            if (float){
                if (panel.props.expander){
                    val += panel.props.collapsedSize-1;
                }
            } else {
                if (region === 'west' || region === 'east'){
                    val = domHelper.outerWidth(panel.panelRef);
                } else {
                    val = domHelper.outerHeight(panel.panelRef);
                }
                if (!split && border){
                    val -= 1;
                }
            }
        }
        return val;
    }
    updatePaddings() {
        let left = this.getPaddingValue('west');
        let right = this.getPaddingValue('east');
        let top = this.getPaddingValue('north');
        let bottom = this.getPaddingValue('south');
        this.setState({
            paddingLeft: left,
            paddingRight: right,
            paddingTop: top,
            paddingBottom: bottom,
            _t: new Date()
        })
    }
    changePanels(){
        clearTimeout(this.panelTimer);
        this.panelTimer = setTimeout(() => {
            if (this.panels.length){
                this.updatePaddings();
            }
        })
    }
    handlePanelAdd(panel){
        this.panels.push(panel);
        this.changePanels();
    }
    handlePanelRemove(panel){
        let index = this.panels.indexOf(panel);
        if (index >= 0){
            this.panels.splice(index,1);
            this.changePanels();
        }
    }
    handlePanelResizeStart(){
        this.setState({resizing:true})
    }
    handlePanelResizing(){
        this.updatePaddings();
    }
    handlePanelResizeStop(){
        this.setState({resizing:false})
    }
    handleClick(event){
        let cp = domHelper.closest(event.target, '.layout-panel');
        this.panels.filter(p => p.panelRef !== cp).forEach(p => {
            if (p.props.float && !p.state.collapsed){
                p.collapse();
            }
        })
    }
    renderCollapsedPanel(region){
        let panel = this.getPanel(region);
        if (!panel){
            return null;
        }
        if (!panel.state.collapsed || !panel.props.expander){
            return null;
        }
        const iconMap = {
            'east':'left',
            'west':'right',
            'north':'down',
            'south':'up'
        };
        const icon = 'layout-button-' + iconMap[region];
        const panelProps = {
            layout: this,
            region: region,
            title: region==='west'||region==='east' ? ' ' : panel.props.title,
            iconCls: panel.props.iconCls,
            bodyCls: 'f-column f-vcenter',
            paddingLeft: this.state.paddingLeft,
            paddingRight: this.state.paddingRight,
            paddingTop: this.state.paddingTop,
            paddingBottom: this.state.paddingBottom,
            collapsedSize: panel.props.collapsedSize,
            collapsible: true,
            collapseIconCls: icon
        }
        return (
            <CollapsedPanel {...panelProps}>
            {
                (region==='west'||region==='east') && <div className="f-vtitle f-full">{panel.props.title}</div>
            }
            </CollapsedPanel>
        )
    }
    renderLayout(){
        const {paddingLeft,paddingRight,paddingTop,paddingBottom} = this.state;
        const cls = classHelper.classNames('layout', this.props.className);
        const style = Object.assign({}, this.props.style||{}, {
            paddingLeft: paddingLeft,
            paddingRight: paddingRight,
            paddingTop: paddingTop,
            paddingBottom: paddingBottom
        })
        return (
            <div key="layout" className={cls} style={style} onClick={this.handleClick.bind(this)}>
            {
                React.Children.map(this.props.children, (panel) => (
                    React.cloneElement(panel, {
                        layout: this,
                        paddingLeft: this.state.paddingLeft,
                        paddingRight: this.state.paddingRight,
                        paddingTop: this.state.paddingTop,
                        paddingBottom: this.state.paddingBottom,
                        onPanelAdd: this.handlePanelAdd.bind(this),
                        onPanelRemove: this.handlePanelRemove.bind(this),
                        onPanelResizeStart: this.handlePanelResizeStart.bind(this),
                        onPanelResizing: this.handlePanelResizing.bind(this),
                        onPanelResizeStop: this.handlePanelResizeStop.bind(this)
                    })
                ))
            }
            {this.renderCollapsedPanel('west')}
            {this.renderCollapsedPanel('east')}
            {this.renderCollapsedPanel('north')}
            {this.renderCollapsedPanel('south')}
            {this.state.resizing && <div className="layout-mask"></div>}
            </div>
        )
    }
    renderConsumer(){
        return (
            <TabsContext.Consumer key="consumer">
                {context => {
                    if (context.selected){
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => this.updatePaddings())
                    }
                }}
            </TabsContext.Consumer>
        )
    }
    render(){
        return [
            this.renderLayout(),
            this.renderConsumer()
        ]
    }
}
Layout.propTypes = {
    selectedTab: PropTypes.object
}
export default Layout


// WEBPACK FOOTER //
// ./src/components/layout/Layout.js