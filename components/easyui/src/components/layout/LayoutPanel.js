import React from 'react';
import Panel from '../panel/Panel';
import PropTypes from 'prop-types';
import classHelper from '../base/ClassHelper';
import domHelper from '../base/DomHelper';
import { Resizable } from '../resizable';

class LayoutPanel extends Panel{
    constructor(props){
        super(props);
        Object.assign(this.state, {
            isExpanding: false,
            collapseToShrinkBody: false
        })
    }
    expand(){
        super.expand();
        this.setState({}, ()=>{
            if (!this.props.animate){
                this.props.layout.updatePaddings();
            }
        })
    }
    collapse(){
        super.collapse();
        this.setState({}, ()=>{
            this.props.layout.updatePaddings();
        })
    }
    clickCollapsibleTool(e){
        e.preventDefault();
        this.collapse();
        this.props.layout.updatePaddings();
    }
    handleSlideEnd(){
        this.props.layout.updatePaddings();
    }
    componentDidMount(){
        if (this.resizable){
            this.panelRef = this.resizable.el;
        }
        this.props.onPanelAdd(this);
        domHelper.bind(this.panelRef, 'transitionend', this.handleSlideEnd.bind(this));
    }
    componentWillUnmount(){
        this.props.onPanelRemove(this)
        domHelper.unbind(this.panelRef);
    }
    panelClasses(){
        const {region,split,animate} = this.props;
        return classHelper.classNames(['panel f-column layout-panel', this.props.className, {
            'layout-collapsed':this.state.collapsed,
            'layout-animate':animate,
            'layout-panel-east':region==='east',
            'layout-panel-west':region==='west',
            'layout-panel-south':region==='south',
            'layout-panel-north':region==='north',
            'layout-panel-center':region==='center',
            'layout-split-east':split&&region==='east',
            'layout-split-west':split&&region==='west',
            'layout-split-south':split&&region==='south',
            'layout-split-north':split&&region==='north',
            'layout-split-center':split&&region==='center'
        }]);
    }
    panelStyles(){
        const {region,paddingTop,paddingBottom} = this.props;
        const top = region==='west'||region==='east' ? paddingTop : null;
        const bottom = region==='west'||region==='east' ? paddingBottom : null;
        return Object.assign({}, this.props.style, {
            top: top?top+'px':null,
            bottom: bottom?bottom+'px':null
        })
    }
    collapsibleClasses(){
        const icons = {
            'west': 'left',
            'east': 'right',
            'north': 'up',
            'south': 'down'
        };
        const {collapsed} = this.state;
        const {region,expandIconCls,collapseIconCls} = this.props;
        if (collapsed){
            return expandIconCls || 'layout-button-'+icons[region];
        } else {
            return collapseIconCls || 'layout-button-'+icons[region];
        }
    }
    fixStyle(){
        if (this.resizable){
            const el = this.resizable.el;
            const {region} = this.props;
            if (region === 'west' || region === 'east'){
                el.style.left = null;
            } else {
                el.style.top = null;
            }
        }
    }
    handleResizeStart(){
        this.props.onPanelResizeStart(this.props.region)
    }
    handleResizing(){
        this.fixStyle();
        this.props.onPanelResizing(this.props.region)
    }
    handleResizeStop(){
        this.fixStyle();
        this.props.onPanelResizeStop(this.props.region)
    }
    render(){
        const {split,region} = this.props;
        const handles = {north:'s',south:'n',east:'w',west:'e'}
        let panel = super.render();
        if (split){
            return (
                <Resizable 
                    handles={handles[region]||''} 
                    ref={ref=>this.resizable=ref}
                    onResizeStart={this.handleResizeStart.bind(this)}
                    onResizing={this.handleResizing.bind(this)}
                    onResizeStop={this.handleResizeStop.bind(this)}
                >
                    {panel}
                </Resizable>
            )
        } else {
            return panel;
        }
    }
}
LayoutPanel.propTypes = Object.assign({}, Panel.propTypes, {
    title: PropTypes.string,
    region: PropTypes.string,
    float: PropTypes.bool,
    split: PropTypes.bool,
    animate: PropTypes.bool,
    collapsible: PropTypes.bool,
    collapsedSize: PropTypes.number,
    expander: PropTypes.bool,
    expandIconCls: PropTypes.string,
    collapseIconCls: PropTypes.string
})
LayoutPanel.defaultProps = Object.assign({}, Panel.defaultProps, {
    region: 'center',
    float: false,
    split: false,
    animate: true,
    collapsible: false,
    collapsedSize: 32,
    expander: false,
    expandIconCls: null,
    collapseIconCls: null
})
export default LayoutPanel


// WEBPACK FOOTER //
// ./src/components/layout/LayoutPanel.js