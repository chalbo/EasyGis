import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import classHelper from '../base/ClassHelper';
import domHelper from '../base/DomHelper';
import TabPanelHeader from './TabPanelHeader';

class Tabs extends LocaleBase{
    constructor(props){
        super(props);
        this.panels = [];
        this.selectedHis = [];
        this.panelTimer = null;
        this.state = {
            usedPanels: [],
            scrollDistance: 0,
            maxScrollDistance: 0
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedIndex !== this.props.selectedIndex){
            this.select(nextProps.selectedIndex)
        }
    }
    componentWillUnmount(){
        this.destroyed = true;
    }
    initUsedPanels(){
        const usedPanels = this.panels.filter(p => p.state.isUsed);
        this.setState({usedPanels:usedPanels})
    }
    initPanels() {
        if (this.destroyed){
            return;
        }
        const usedPanels = this.panels.filter(p => p.state.isUsed);
        this.panels.forEach(p => p.setState({isFirst:false,isLast:false}));
        this.setState({usedPanels:usedPanels})
        if (usedPanels.length){
            usedPanels[0].setState({isFirst:true});
            usedPanels[usedPanels.length-1].setState({isLast:true});
        }
        this.initSelectedPanel();
        this.setScrollers();
    }
    initSelectedPanel() {
        let panel = this.getSelectedPanel();
        if (!panel){
            panel = this.selectedHis.pop();
        }
        if (!panel){
            panel = this.getPanel(this.props.selectedIndex);
        }
        if (panel){
            this.state.usedPanels.filter(p => p !== panel).forEach(p => p.setState({selected:false}));
            panel.setState({selected:true}, ()=>{
                this.initUsedPanels()
            })
            this.selectedHis = this.selectedHis.filter(p => this.getPanelIndex(p) !== -1);
            this.removeHis(panel);
            this.addHis(panel);
        }
    }
    setScrollers(){
        if (!this.isScrollable()){
            return;
        }
        this.setMaxScrollDistance(()=>{
            let panel = this.getSelectedPanel();
            if (panel){
                let wrapWidth = domHelper.outerWidth(this.tabsWrapRef);
                let index = this.getPanelIndex(panel);
                let li = this.tabsRef.children[index];
                let width = domHelper.outerWidth(li, true);
                let pos = domHelper.position(li);
                let left = pos.left - this.state.scrollDistance;
                let right = left + width;
                if (left < 0){
                    let distance = left - (wrapWidth-width)/2;
                    this.scrollBy(distance);
                } else if (right > wrapWidth){
                    let distance = left - (wrapWidth-width)/2;
                    this.scrollBy(distance);
                } else {
                    this.scrollBy(0);
                }
            }
        });
    }
    setMaxScrollDistance(callback) {
        let width = this.tabsRef.scrollWidth;
        let wrapWidth = this.tabsWrapRef.offsetWidth;
        let maxScrollDistance = width > wrapWidth ? width - wrapWidth : 0;
        this.setState({maxScrollDistance:maxScrollDistance}, ()=>{
            if (callback){
                callback()
            }
        })
    }
    scrollBy(distance){
        this.setMaxScrollDistance(()=>{
            distance += this.state.scrollDistance;
            if (distance > this.state.maxScrollDistance){
                distance = this.state.maxScrollDistance;
            }
            if (distance < 0){
                distance = 0;
            }
            this.setState({scrollDistance:distance})
        });
    }
    addHis(panel) {
        this.selectedHis.push(panel);
    }
    removeHis(panel) {
        this.selectedHis = this.selectedHis.filter(p => p !== panel);
    }
    backHis() {
        let panel = this.selectedHis.pop();
        if (panel){
            this.removeHis(panel);
            panel.select();
        } else {
            this.select(0);
        }
    }
    select(index) {
        let panel = this.getPanel(index);
        if (panel){
            panel.select();
        }
    }
    unselect(index) {
        let panel = this.getPanel(index);
        if (panel){
            panel.unselect();
        }
    }
    getPanel(index) {
        return this.state.usedPanels[index];
    }
    getPanelIndex(panel) {
        let pp = this.state.usedPanels;
        for(let i=0; i<pp.length; i++){
            if (pp[i] === panel){
                return i;
            }
        }
        return -1;
    }
    getSelectedPanel() {
        let pp = this.state.usedPanels.filter(p => p.state.selected && !p.props.disabled);
        return pp.length ? pp[0] : null;
    }
    isHorizontal() {
        const {tabPosition} = this.props
        return tabPosition === 'left' || tabPosition === 'right';
    }
    isScrollable() {
        const {scrollable,justified} = this.props;
        if (this.isHorizontal()){
            return false;
        } else {
            return scrollable && !justified;
        }
    }
    isScrollerVisible() {
        if (this.isScrollable()){
            return this.state.maxScrollDistance > 0;
        } else {
            return false;
        }
    }
    containerClasses(){
        return classHelper.classNames('tabs-container', this.isHorizontal() ? 'f-row' : 'f-column', this.props.className);
    }
    headerClasses(){
        const {plain,narrow,border,tabPosition} = this.props;
        return classHelper.classNames(['tabs-header f-row f-noshrink', {
            'tabs-header-plain': plain,
            'tabs-header-narrow': narrow,
            'tabs-header-noborder': !border,
            'tabs-header-bottom f-order2': tabPosition==='bottom',
            'tabs-header-left f-column': tabPosition==='left',
            'tabs-header-right f-column f-order2': tabPosition==='right'
        }])
    }
    bodyClasses(){
        const {border,tabPosition} = this.props;
        return classHelper.classNames(['tabs-panels f-column f-full', {
            'tabs-panels-noborder': !border,
            'tabs-panels-top': tabPosition==='bottom',
            'tabs-panels-right': tabPosition==='left',
            'tabs-panels-left': tabPosition==='right'
        }])
    }
    tabsClasses(){
        return classHelper.classNames(['tabs f-full', {
            'f-row': !this.isHorizontal(),
            'f-column': this.isHorizontal(),
            'tabs-scrollable': this.isScrollable(),
            'tabs-narrow': this.props.narrow
        }])
    }
    tabsStyle() {
        if (this.isScrollable()){
            return {
                left: (-this.state.scrollDistance)+'px'
            };
        } else {
            return null;
        }
    }
    changePanels(){
        clearTimeout(this.panelTimer);
        this.panelTimer = setTimeout(() => {
            this.initPanels();
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
        this.removeHis(panel);
    }
    handleTabClick(panel){
        panel.select();
    }
    handleTabClose(panel){
        if (!panel.props.disabled){
            panel.close();
        }
    }
    render(){
        const headerStyle = {
            width: this.isHorizontal()?this.props.headerWidth+'px':null,
            height: !this.isHorizontal()?this.props.headerHeight+'px':null
        }
        const liClasses = (panel) => {
            return classHelper.classNames('f-inline-row', {
                'f-full': this.props.justified,
                'f-noshrink': this.isScrollable(),
                'tabs-selected': panel.state.selected,
                'tabs-disabled': panel.props.disabled,
                'tabs-first': panel.state.isFirst,
                'tabs-last': panel.state.isLast
            })
        }
        return (
            <div className={this.containerClasses()} style={this.props.style} ref={el=>this.containerRef=el}>
                <div className={this.headerClasses()} style={headerStyle} ref={el=>this.headerRef=el}>
                    {this.isScrollerVisible() && <div className="tabs-scroller-left f-order1" onClick={()=>this.scrollBy(-this.props.scrollIncrement)}></div>}
                    {this.isScrollerVisible() && <div className="tabs-scroller-right f-order3" onClick={()=>this.scrollBy(this.props.scrollIncrement)}></div>}
                    <div className="tabs-wrap f-column f-full f-order2" ref={el=>this.tabsWrapRef=el}>
                        {this.isScrollable() && <ul className="tabs tabs-scrollable f-full" style={{width:'100%'}}></ul>}
                        <ul className={this.tabsClasses()} style={this.tabsStyle()} ref={el=>this.tabsRef=el}>
                        {
                            this.state.usedPanels.map((panel,index) => (
                                <li key={index} className={liClasses(panel)} onClick={(event)=>this.handleTabClick(panel,event)}>
                                    <TabPanelHeader {...this.props} panel={panel} onClose={()=>this.handleTabClose(panel)}></TabPanelHeader>
                                </li>
                            ))
                        }
                        </ul>
                    </div>
                </div>
                <div className={this.bodyClasses()}>
                {
                    React.Children.map(this.props.children, (panel) => (
                        React.cloneElement(panel, {
                            tabs: this,
                            onPanelAdd: this.handlePanelAdd.bind(this),
                            onPanelRemove: this.handlePanelRemove.bind(this)
                        })
                    ))
                }
                </div>
            </div>
        )
    }
}
Tabs.propTypes = Object.assign({}, LocaleBase.propTypes, {
    headerWidth: PropTypes.number,
    headerHeight: PropTypes.number,
    tabWidth: PropTypes.number,
    tabHeight: PropTypes.number,
    tabPosition: PropTypes.string,
    plain: PropTypes.bool,
    narrow: PropTypes.bool,
    justified: PropTypes.bool,
    border: PropTypes.bool,
    scrollable: PropTypes.bool,
    scrollIncrement: PropTypes.number,
    selectedIndex: PropTypes.number
})
Tabs.defaultProps = {
    headerWidth: 150,
    headerHeight: 35,
    tabHeight: 32,
    tabPosition: 'top',
    plain: false,
    narrow: false,
    justified: false,
    border: true,
    scrollable: false,
    scrollIncrement: 100,
    selectedIndex: 0,
    onTabSelect(panel){},
    onTabUnselect(panel){},
    onTabClose(panel){}
}
export default Tabs


// WEBPACK FOOTER //
// ./src/components/tabs/Tabs.js