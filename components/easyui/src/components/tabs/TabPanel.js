import React from 'react';
import Panel from '../panel/Panel';
import PropTypes from 'prop-types';
import classHelper from '../base/ClassHelper';
import TabsContext from './TabsContext';

class TabPanel extends Panel{
    constructor(props){
        super(props);
        Object.assign(this.state, {
            isFirst: false,
            isLast: false,
            isUsed: true,
            selected: props.selected
        })
    }
    select() {
        const {disabled,tabs} = this.props;
        const {selected} = this.state;
        if (selected || disabled){
            return;
        }
        tabs.panels.filter(p => p !== this).forEach(p => p.unselect());
        this.setState({selected:true}, ()=>{
            tabs.addHis(this);
            tabs.setScrollers();
            tabs.initUsedPanels();
            tabs.props.onTabSelect(this);
        })
    }
    unselect() {
        const {disabled,tabs} = this.props;
        const {selected} = this.state;
        if (!selected || disabled){
            return;
        }
        this.setState({selected:false}, ()=>{
            tabs.initUsedPanels();
            tabs.props.onTabUnselect(this)
        })
    }
    close() {
        const {disabled,tabs} = this.props;
        const {selected} = this.state;
        if (disabled){
            return;
        }
        if (selected){
            this.setState({selected:false})
        }
        this.setState({closed:true,isUsed:false}, ()=>{
            tabs.initPanels();
            tabs.removeHis(this);
            tabs.backHis();
            tabs.setState({}, ()=>{
                tabs.setScrollers();
                tabs.props.onTabClose(this);
            })
        })
    }
    componentDidMount(){
        this.props.onPanelAdd(this);
    }
    componentWillUnmount(){
        this.props.onPanelRemove(this)
    }
    panelClasses(){
        const {selected} = this.state;
        return classHelper.classNames(['panel f-column', this.props.className, {
            'f-full': selected,
            'f-hide': !selected
        }]);
    }
    render(){
        const panel = super.render();
        return (
            <TabsContext.Provider value={{selectedTab:this,selected:this.state.selected}}>
                {panel}
            </TabsContext.Provider>
        )
    }
}
TabPanel.propTypes = Object.assign({}, Panel.propTypes, {
    selected: PropTypes.bool,
    showHeader: PropTypes.bool,
    border: PropTypes.bool,
    disabled: PropTypes.bool,
    closable: PropTypes.bool
})
TabPanel.defaultProps = Object.assign({}, Panel.defaultProps, {
    selected: false,
    showHeader: false,
    border: false,
    disabled: false,
    closable: false
})
export default TabPanel


// WEBPACK FOOTER //
// ./src/components/tabs/TabPanel.js