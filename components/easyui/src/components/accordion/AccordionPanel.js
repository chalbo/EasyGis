import Panel from '../panel/Panel';
import classHelper from '../base/ClassHelper';

class AccordionPanel extends Panel{
    constructor(props){
        super(props);
        Object.assign(this.state, {
            isLast: false
        })
    }
    setLast(isLast){
        this.setState({isLast:isLast})
    }
    selectedState(){
        return !this.state.collapsed;
    }
    full(){
        return this.props.selected;
    }
    select(){
        if (this.selectedState()){
            return;
        }
        const {multiple,panels} = this.props;
        if (!multiple){
            panels.filter(p => p !== this).forEach(p => p.unselect());
        }
        this.expand();
        this.setState({}, ()=>{
            this.props.onPanelSelect(this);
        })
    }
    unselect(){
        if (!this.selectedState()){
            return;
        }
        this.collapse();
        this.setState({}, ()=>{
            this.props.onPanelUnselect(this);
        })
    }
    panelClasses(){
        return classHelper.classNames(['panel f-column', this.props.className, {
            'panel-last':this.state.isLast,
            'f-full':this.selectedState(),
            'f-noshrink':!this.selectedState()
        }]);
    }
    headerClasses(){
        return classHelper.classNames(['accordion-header panel-header f-noshrink',this.props.headerCls,
            {'panel-header-noborder':!this.props.border},
            {'accordion-header-selected':this.selectedState()}
        ]);
    }
    bodyClasses(){
        return classHelper.classNames(['accordion-body panel-body f-full', this.props.bodyCls, {
            'panel-body-noheader':!this.hasHeader(),
            'panel-body-nobottom':this.props.footer,
            'panel-body-noborder':!this.props.border
        }]);
    }
    componentDidMount(){
        this.props.onPanelAdd(this);
    }
    componentWillUnmount(){
        this.props.onPanelRemove(this)
    }
    clickPanelHeader(event){
        event.stopPropagation();
        if (this.state.collapsed){
            this.select();
        } else if (this.props.multiple){
            this.unselect();
        }
    }
    clickCollapsibleTool(e){
        e.preventDefault();
    }
}
AccordionPanel.defaultProps = Object.assign({}, Panel.defaultProps, {
    title: '',
    collapsible: true,
    expandIconCls: 'accordion-expand',
    collapseIconCls: 'accordion-collapse',
    collapsed: true,
    selected: false
})
export default AccordionPanel


// WEBPACK FOOTER //
// ./src/components/accordion/AccordionPanel.js