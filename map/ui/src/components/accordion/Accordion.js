import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import classHelper from '../base/ClassHelper';

class Accordion extends LocaleBase{
    constructor(props){
        super(props);
        this.panels = [];
        this.panelTimer = null;
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedIndex !== this.props.selectedIndex){
            let value = nextProps.selectedIndex;
            let indexes = value instanceof Array ? value : [value];
            if (nextProps.multiple){
				this.panels.filter((p, index) => indexes.indexOf(index) === -1).forEach(p => p.unselect());
                indexes.forEach(index => this.select(index));
            } else {
                this.select(indexes[0]);
            }
        }
    }
    initPanels(){
        if (this.panels.length){
            this.panels.forEach(p => p.setLast(false));
            let last = this.panels[this.panels.length-1];
            last.setLast(true);
            this.initSelectedPanel();
        }
    }
    initSelectedPanel(){
        const {multiple,selectedIndex} = this.props;
        let panels = this.panels.filter(p => p.selectedState());
        if (!panels.length){
            if (multiple){
                panels = this.getPanels(selectedIndex||[]);
            } else {
                panels = this.getPanels([selectedIndex]);
            }
        }
        if (panels.length){
            panels.forEach(p => p.setState({animate:false}));
            if (multiple){
                panels.forEach(p => p.setState({collapsed:false}));
            } else {
                panels[0].setState({collapsed:false});
                panels.filter((p, index) => index !== 0).forEach(p => p.setState({collapsed:true}));
            }
            setTimeout(() => {
                panels.forEach(p => p.setState({animate:this.props.animate}))
            })
        }
    }
    getPanel(index){
        return this.panels[index];
    }
    getPanels(indexes){
        let panels = [];
        for(let index of indexes){
            let panel = this.getPanel(index);
            if (panel){
                panels.push(panel);
            }
        }
        return panels;
    }
    getSelectedPanels(){
        return this.panels.filter(p => p.selectedState());
    }
    getSelectedPanel(){
        let pp = this.getSelectedPanels();
        return pp.length ? pp[0] : null;
    }
    getPanelIndex(panel){
        for(let i=0; i<this.panels.length; i++){
            if (this.panels[i] === panel){
                return i;
            }
        }
        return -1;
    }
    getSelectedIndex(){
        let panel = this.getSelectedPanel();
        return panel ? this.getPanelIndex(panel) : -1;    
    }
    select(index){
        let panel = this.getPanel(index);
        if (panel){
            panel.select();
        }
    }
    unselect(index){
        let panel = this.getPanel(index);
        if (panel){
            panel.unselect();
        }
    }
    accordionClasses(){
        return classHelper.classNames(['accordion f-column', this.props.className, {
            'accordion-noborder':!this.props.border
        }]);
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
    }
    handlePanelSelect(panel){
        this.props.onPanelSelect(panel);
    }
    handlePanelUnselect(panel){
        this.props.onPanelUnselect(panel);
    }
    render(){
        return (
            <div className={this.accordionClasses()} style={this.props.style}>
            {
                React.Children.map(this.props.children, (panel) => (
                    React.cloneElement(panel, {
                        panels: this.panels,
                        multiple: this.props.multiple,
                        animate: this.props.animate,
                        onPanelAdd: this.handlePanelAdd.bind(this),
                        onPanelRemove: this.handlePanelRemove.bind(this),
                        onPanelSelect: this.handlePanelSelect.bind(this),
                        onPanelUnselect: this.handlePanelUnselect.bind(this)
                    })
                ))
            }
            </div>
        )
    }
}
Accordion.propTypes = Object.assign({}, LocaleBase.propTypes, {
    border: PropTypes.bool,
    multiple: PropTypes.bool,
    animate: PropTypes.bool,
    selectedIndex: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.array
    ]),
    onPanelSelect: PropTypes.func,
    onPanelUnselect: PropTypes.func
})
Accordion.defaultProps = {
    border: true,
    multiple: false,
    animate: false,
    selectedIndex: 0,
    onPanelSelect(panel){},
    onPanelUnselect(panel){}
}
export default Accordion


// WEBPACK FOOTER //
// ./src/components/accordion/Accordion.js